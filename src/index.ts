#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import path from "path";
import { getLinearToken, setLinearToken, deleteLinearToken } from "./utils/config";
import { getLinearClient } from "./utils/linear-client";

const pkg = require("../package.json");

const program = new Command();

async function ensureAuthenticated() {
  let token = getLinearToken();
  if (!token) {
    console.log("No se encontró un token de Linear. Por favor, configúralo ahora.");
    const answers = await inquirer.prompt([
      {
        type: "password",
        name: "token",
        message: "Introduce tu API Key de Linear:",
        validate: (input: string) => input.length > 0 || "El token no puede estar vacío.",
      },
    ]);
    setLinearToken(answers.token);
    console.log("¡Token guardado correctamente!");
  }
}

program
  .name("linear-cli")
  .description("CLI para interactuar con Linear")
  .version(pkg.version);

program
  .command("update")
  .description("Mostrar instrucciones para actualizar la CLI a la última versión")
  .action(() => {
    console.log("\n🚀 Para actualizar a la última versión disponible, ejecuta:");
    console.log("-----------------------------------------------------------");
    console.log("npm install -g git+https://github.com/DanmerCC/linear-cli.git");
    console.log("-----------------------------------------------------------\n");
  });

program
  .command("ping")
  .description("Verificar la conexión con la CLI")
  .action(async () => {
    await ensureAuthenticated();
    console.log("linear-cli está funcionando correctamente y autenticado.");
  });

program
  .command("login")
  .description("Configurar o actualizar el API Key de Linear")
  .argument("[token]", "El API Key de Linear")
  .action(async (token) => {
    if (token) {
      setLinearToken(token);
      console.log("¡Token guardado correctamente!");
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: "password",
        name: "token",
        message: "Introduce tu API Key de Linear:",
        validate: (input: string) => input.length > 0 || "El token no puede estar vacío.",
      },
    ]);
    setLinearToken(answers.token);
    console.log("¡Token actualizado correctamente!");
  });

program
  .command("logout")
  .description("Cerrar sesión y eliminar el API Key guardado")
  .action(() => {
    deleteLinearToken();
    console.log("Sesión cerrada. El token ha sido eliminado.");
  });

program
  .command("projects")
  .description("Listar todos los proyectos de tu organización")
  .action(async () => {
    await ensureAuthenticated();
    try {
      const client = getLinearClient();
      const projects = await client.projects();
      
      if (projects.nodes.length === 0) {
        console.log("No se encontraron proyectos.");
        return;
      }

      console.log("\nProyectos disponibles:");
      console.log("----------------------");
      projects.nodes.forEach(project => {
        console.log(`- ${project.name} (Estado: ${project.state})`);
      });
      console.log("");
    } catch (error) {
      console.error("Error al obtener los proyectos:", error instanceof Error ? error.message : error);
    }
  });

program
  .command("issues <project>")
  .description("Listar tareas de un proyecto específico")
  .option("-s, --status <status>", "Filtrar por nombre de estado (ej: Todo, In Progress)")
  .action(async (projectName, options) => {
    await ensureAuthenticated();
    try {
      const client = getLinearClient();
      const projects = await client.projects();
      const project = projects.nodes.find(
        (p) => p.name.toLowerCase().includes(projectName.toLowerCase()) || p.id === projectName
      );

      if (!project) {
        console.error(`No se encontró el proyecto: ${projectName}`);
        return;
      }

      const issues = await project.issues();
      let filteredIssues = issues.nodes;

      console.log(`\nTareas para el proyecto: ${project.name}`);
      console.log("------------------------------------------");
      for (const issue of filteredIssues) {
        const state = await issue.state;
        const assignee = await issue.assignee;
        
        // Filtro manual de estado si se proporcionó la opción
        if (options.status && state?.name.toLowerCase() !== options.status.toLowerCase()) {
          continue;
        }

        console.log(`[${issue.identifier}] ${issue.title}`);
        console.log(`   Estado: ${state?.name || "N/A"} | Asignado: ${assignee?.name || "Sin asignar"}`);
        console.log("");
      }
    } catch (error) {
      console.error("Error al obtener las tareas:", error instanceof Error ? error.message : error);
    }
  });

program
  .command("search <query>")
  .description("Buscar tareas globalmente por texto")
  .action(async (query) => {
    await ensureAuthenticated();
    try {
      const client = getLinearClient();
      const issues = await client.issues({ filter: { or: [{ title: { contains: query } }, { description: { contains: query } }] } });
      
      console.log(`\nResultados de búsqueda para: "${query}"`);
      console.log("------------------------------------------");
      issues.nodes.forEach(issue => {
        console.log(`- [${issue.identifier}] ${issue.title}`);
      });
    } catch (error) {
      console.error("Error en la búsqueda:", error instanceof Error ? error.message : error);
    }
  });

program
  .command("issue-status <identifier> <status>")
  .description("Cambiar el estado de una tarea")
  .action(async (identifier, statusName) => {
    await ensureAuthenticated();
    try {
      const client = getLinearClient();
      const issue = await client.issue(identifier);
      
      if (!issue) {
        console.error(`No se encontró la tarea con identificador: ${identifier}`);
        return;
      }

      const team = await issue.team;
      if (!team) return;
      
      const states = await team.states();
      const newState = states.nodes.find(s => s.name.toLowerCase() === statusName.toLowerCase());

      if (!newState) {
        console.error(`No se encontró el estado: ${statusName}`);
        console.log("Estados disponibles para este equipo:");
        states.nodes.forEach(s => console.log(`- ${s.name}`));
        return;
      }

      await client.updateIssue(issue.id, { stateId: newState.id });
      console.log(`Tarea ${identifier} actualizada a estado: ${newState.name}`);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error instanceof Error ? error.message : error);
    }
  });

program
  .command("comment <identifier> <body>")
  .description("Agregar un comentario a una tarea")
  .action(async (identifier, body) => {
    await ensureAuthenticated();
    try {
      const client = getLinearClient();
      const issue = await client.issue(identifier);

      if (!issue) {
        console.error(`No se encontró la tarea con identificador: ${identifier}`);
        return;
      }

      await client.createComment({ issueId: issue.id, body });
      console.log(`Comentario agregado a ${identifier}.`);
    } catch (error) {
      console.error("Error al agregar el comentario:", error instanceof Error ? error.message : error);
    }
  });

program
  .command("setup-windows")
  .description("Mostrar guía para agregar la CLI al PATH en Windows")
  .action(() => {
    const distPath = path.resolve(__dirname);
    console.log("\nPara agregar la CLI al PATH en Windows y usarla desde cualquier terminal:");
    console.log("--------------------------------------------------------------------------");
    console.log("1. Abre PowerShell como Administrador.");
    console.log("2. Copia la siguiente ruta:");
    console.log(`   ${distPath}`);
    console.log("\n3. Ejecuta el siguiente comando, reemplazando la ruta copiada:");
    console.log(`   setx /M PATH "$env:PATH;${distPath}"`);
    console.log("\n4. Cierra y vuelve a abrir la terminal para que los cambios surtan efecto.");
    console.log("5. Verifica la instalación ejecutando: linear-cli --version");
    console.log("--------------------------------------------------------------------------\n");
  });

program.parseAsync(process.argv);

#!/usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";
import inquirer from "inquirer";
import { getLinearToken, setLinearToken, deleteLinearToken } from "./utils/config";
import { getLinearClient } from "./utils/linear-client";

dotenv.config();

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
  .version("1.0.0");

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
  .action(async () => {
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

program.parseAsync(process.argv);

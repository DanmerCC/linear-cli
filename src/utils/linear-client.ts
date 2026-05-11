import { LinearClient } from "@linear/sdk";
import { getLinearToken } from "./config";

export const getLinearClient = (): LinearClient => {
  const token = getLinearToken();
  if (!token) {
    throw new Error("No se encontró el token de Linear. Por favor, ejecuta 'linear-cli login'.");
  }
  return new LinearClient({ apiKey: token });
};

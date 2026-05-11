import Conf from "conf";

interface ConfigSchema {
  linearToken?: string;
}

const schema = {
  linearToken: {
    type: "string" as const,
  },
};

const config = new Conf<ConfigSchema>({ schema, projectName: "linear-cli" });

export const getLinearToken = (): string | undefined => {
  return config.get("linearToken");
};

export const setLinearToken = (token: string): void => {
  config.set("linearToken", token);
};

export const deleteLinearToken = (): void => {
  config.delete("linearToken");
};

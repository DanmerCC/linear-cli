"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinearClient = void 0;
const sdk_1 = require("@linear/sdk");
const config_1 = require("./config");
const getLinearClient = () => {
    const token = (0, config_1.getLinearToken)();
    if (!token) {
        throw new Error("No se encontró el token de Linear. Por favor, ejecuta 'linear-cli login'.");
    }
    return new sdk_1.LinearClient({ apiKey: token });
};
exports.getLinearClient = getLinearClient;

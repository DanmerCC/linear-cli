"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLinearToken = exports.setLinearToken = exports.getLinearToken = void 0;
const conf_1 = __importDefault(require("conf"));
const schema = {
    linearToken: {
        type: "string",
    },
};
const config = new conf_1.default({ schema, projectName: "linear-cli" });
const getLinearToken = () => {
    return config.get("linearToken");
};
exports.getLinearToken = getLinearToken;
const setLinearToken = (token) => {
    config.set("linearToken", token);
};
exports.setLinearToken = setLinearToken;
const deleteLinearToken = () => {
    config.delete("linearToken");
};
exports.deleteLinearToken = deleteLinearToken;

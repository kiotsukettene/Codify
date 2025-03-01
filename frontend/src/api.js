// api.js
import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
    withCredentials: false
});

export const executeCode = async (language, sourceCode, input = "") => {
    const response = await API.post("/execute", {
        language: language,
        version: LANGUAGE_VERSIONS[language],
        files: [
            {
                content: sourceCode
            }
        ],
        stdin: input // Add input if supported by Piston API
    });
    return response.data;
};
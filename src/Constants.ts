export const OPENAI_API_KEY = "";
export const OPENAI_API_TOKEN = "";
global["OPENAI_API_KEY"] = process.env["OPENAI_API_KEY"] = OPENAI_API_KEY;
global["OPENAI_API_TOKEN"] = process.env["OPENAI_API_TOKEN"] = OPENAI_API_TOKEN;
export interface IScriptDef {
    requiredFiles: Record<string, string>;
    generateInputBatch: (_requiredFiles: Record<string, string>) => Promise<TInputBatch>;
}

export interface IInput {
    prompt: string;
}

export type TInputBatch = {
    inputs: Array<IInput>;
    parseOutputForResult: (_output: string) => string
};
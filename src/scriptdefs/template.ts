import { IScriptDef, TInputBatch } from "../SharedTypes";

export const scriptdef: IScriptDef = {
    requiredFiles: {
        // key: path as string,
    },
    generateInputBatch: async (_requiredFiles): Promise<TInputBatch> => {
        return {
            inputs: [],
            parseOutputForResult(_output: string): string {
                return _output;
            }
        };
    },
}
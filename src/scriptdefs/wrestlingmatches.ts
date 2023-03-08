import { IInput, IScriptDef, TInputBatch } from "../SharedTypes";

export const scriptdef: IScriptDef = {
    requiredFiles: {
        // key: path as string,
    },
    generateInputBatch: async (_requiredFiles): Promise<TInputBatch> => {
        const inputs: Array<IInput> = [];

        const wrestlers = [
            "Edge",
            "Elias",
            "Finn Balor",
            "The Miz",
            "Otis",
            "Randy Orton",
            "The Undertaker"
        ];
        const alwaysSunnyInPhiladelphaCharacters = [
            "Charlie",
            "Dee",
            "Mac",
            "Dennis",
            "Frank",
            "The McPoyle Brothers"
        ];
        const promptTemplate = `Please generate a fictional microphone exchange between wrestler "%WRESTLER%" and the Always Sunny in Philadelpha character "%ALWAYSSUNNY%".`;
        for(let i = 0; i < wrestlers.length; i++) {
            const wrestler = wrestlers[i];
            const randomAlwaysSunnyCharacter = alwaysSunnyInPhiladelphaCharacters[
                Math.floor(alwaysSunnyInPhiladelphaCharacters.length * Math.random())
            ];
            inputs.push({
                prompt: promptTemplate
                    .replace("%WRESTLER%", wrestler)
                    .replace("%ALWAYSSUNNY%", randomAlwaysSunnyCharacter)
            })
        }

        return {
            inputs: inputs,
            parseOutputForResult(_output: string): string {
                return _output + "\n===========================================\n";
            }
        };
    },
}
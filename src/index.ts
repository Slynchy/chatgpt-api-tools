/**
 * chatgpt-api-tools
 *
 * A tiny framework for more-easily handling batch operations with ChatGPT
 *
 * By Sam Lynch
 */

import * as path from "path";
import { scriptdef } from "./scriptdefs/diagnosisnames";
import { IScriptDef } from "./SharedTypes";
import * as fs from "fs";
import { OPENAI_API_KEY, OPENAI_API_TOKEN } from "./Constants";

function wait(_time: number): Promise<void> {
    return new Promise<void>((res) => {
        setTimeout(() => res(), _time);
    });
}

const args = process.argv.slice(2);
async function main() {
    if(args.length == 0) {
        console.log(`
chatgpt-api-tools

Usage:
  ts-node src/index.ts [relative path to scriptdef file]

Flags:
  -h                 -- Shows this help screen
  -l [milliseconds]  -- Adds a delay (in MS) to requests to prevent rate limiting (default: 1000)
`
        );
        return;
    }

    const delay = parseInt(args[args.indexOf("-l") + 1]) || 1000;
    console.log(`Using delay of ${delay} milliseconds`);

    const pathToFile = path.resolve(args[args.length-1]);
    let output: string = "";
    try {
        const evalResult: IScriptDef = (await require(pathToFile))["scriptdef"];
        if(!evalResult) {
            throw new Error("ScriptDef is missing exported `scriptdef` object!");
        }

        const fileBuffers: Record<string, string> = {};
        for (const [key, value] of Object.entries(evalResult.requiredFiles)) {
            fileBuffers[key] = fs.readFileSync(value, "utf8");
        }
        const inputBatch = await evalResult.generateInputBatch(fileBuffers);

        const { ChatGPTAPI, ChatGPTUnofficialProxyAPI } = await import("chatgpt");
        const api =
            OPENAI_API_KEY ?
                new ChatGPTAPI({
                    apiKey: OPENAI_API_KEY as string
                })
            :
            OPENAI_API_TOKEN ?
                new ChatGPTUnofficialProxyAPI({
                    accessToken: OPENAI_API_TOKEN as string
                })
                : null;
        if(!api) {
            throw new Error("Must provide apiKey or accessToken in Constants.ts!");
        }
        const totalStart = Date.now();
        let estimatedCompleteTimeMs = 0;
        let durations: number[] = [];
        for(let i = 0; i < inputBatch.inputs.length; i++) {
            const startTime = Date.now();

            const res = await api.sendMessage(inputBatch.inputs[i].prompt);
            const parsedRes = inputBatch.parseOutputForResult(res.text);
            output += parsedRes + "\n";

            const endTime = Date.now();
            durations.push(endTime - startTime);
            estimatedCompleteTimeMs = ((durations.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0) / durations.length) * (inputBatch.inputs.length - i)) + (
                (delay * (inputBatch.inputs.length - i))
            );
            const timeInMin = Math.floor(estimatedCompleteTimeMs / (1000 * 60));
            const timeInSecs = Math.floor(estimatedCompleteTimeMs / 1000) % 60;
            const timeInMinStr = timeInMin < 10 ? `0${timeInMin}` : timeInMin.toString();
            const timeInSecsStr = timeInSecs < 10 ? `0${timeInSecs}` : timeInSecs.toString();
            console.log(`Estimated time remaining: ${timeInMinStr}:${timeInSecsStr}`);
            await wait(delay);
        }
        const totalEnd = Date.now();
        console.log("All operations complete in %is", Math.ceil((totalEnd - totalStart) / 1000));

    } catch(err) {
        console.error(err);
    }

    if(output)
        fs.writeFileSync("output.txt", output, "utf8");
}

main().then(() => {
    console.log("Closing...");
})
# chatgpt-api-tools
A small framework designed to help batch prompts to ChatGPT for large tasks (e.g. iterating over a list of words and finding the best synonym for them).

## How to use

```
Usage:
  ts-node src/index.ts [relative path to scriptdef file]

Flags:
  -h                 -- Shows this help screen
  -l [milliseconds]  -- Adds a delay (in MS) to requests to prevent rate limiting (default: 1000)
```


1. Run `npm install`
2. Create a new "scriptdef" under `src/scriptdefs` (use `template.ts` for guidance)
    i. Add paths to files required by your script to `requiredFiles` and they'll be ready to use when generating the prompts
3. Run the scriptdef with the following command: `ts-node src/index.ts [path to scripdef file]`
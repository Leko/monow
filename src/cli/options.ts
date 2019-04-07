import yargs from "yargs";

const cmd = yargs
  .option("build-script", {
    alias: "b",
    type: "string",
    default: "npm run prepare",
    description: "Shell script to build your package"
  })
  .option("test-script", {
    alias: "t",
    type: "string",
    default: "npm run test",
    description: "Shell script to test your package"
  })
  .option("no-test", {
    alias: "T",
    type: "boolean",
    default: false,
    description: "Do not run test when dependent packages changed"
  });

export const parse = cmd.parse;

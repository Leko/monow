import yargs from "yargs";
// @ts-ignore
import { name, version, repository } from "../../package.json";

const cmd = yargs
  .scriptName(name)
  .version(version)
  .option("build-script", {
    alias: "b",
    type: "string",
    default: "prepare",
    description: "Shell script to build your package"
  })
  .option("test-script", {
    alias: "t",
    type: "string",
    default: "test",
    description: "Shell script to test your package"
  })
  .option("run-test", {
    alias: "T",
    type: "boolean",
    default: false,
    description: "Run test when dependent packages changed"
  })
  .option("no-notify", {
    alias: "N",
    type: "boolean",
    default: false,
    description: "Do not notify"
  })
  .example("$0", "Run build only")
  .example("$0 -T", "Run build and test when dependent packages changed")
  .example('$0 -b "make build"', "Customize build script")
  .example('$0 -t "lint"', "Customize test script")
  .epilogue(
    `For more information, please visit our repository at:\nhttps://github.com/${repository}`
  );

export const parse = cmd.parse;

import yargs from "yargs";
import { name, version, repository } from "../../package.json";

const cmd = yargs
  .scriptName(name)
  .version(version)
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
  .option("run-test", {
    alias: "T",
    type: "boolean",
    default: false,
    description: "Run test when dependent packages changed"
  })
  .example("$0", "Run build only")
  .example("$0 -T", "Run build and test when dependent packages changed")
  .example('$0 -b "make build"', "Customize build script")
  .example('$0 -t "npm run lint"', "Customize test script")
  .epilogue(
    `For more information, please visit our repository at:\nhttps://github.com/${repository}`
  );

export const parse = cmd.parse;

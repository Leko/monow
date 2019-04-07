import { main } from "./main";
import { parse } from "./options";

const options = parse();

main(process.cwd(), {
  buildScript: options["build-script"],
  testScript: options["test-script"],
  runTests: options["no-test"]
}).catch(error => {
  console.error(error.stack);
  process.exit(1);
});

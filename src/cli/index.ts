import tmp from "tmp";
import logUpdate from "log-update";
import { createStore } from "../store";
import { getPackages } from "../store/selectors";
import { watch } from "../watcher";
import { render } from "../renderer";
import { getIgnore } from "../lib/gitignore";
import { getRootDir, getLernaPackages } from "../lib/lerna";
import { reducer } from "../store/reducer";
import * as actions from "../store/action";
import { State } from "../store/state";
import { Compiler } from "../compiler";

function escapePackageName(name: string): string {
  return name.replace("@", "").replace("/", "__");
}

function getLogNameTemplate(name: string): string {
  return `.monow-${escapePackageName(name)}-XXXXXX.log`;
}

async function getStore(rootDir: string) {
  const compiler = new Compiler({ shell: `npm run prepare` });
  const packages = await getLernaPackages(rootDir);
  const initialState: State = packages.reduce((acc, pkg) => {
    const { name: logPath } = tmp.fileSync({
      template: getLogNameTemplate(pkg.name)
    });
    return reducer(acc, actions.addPackage(pkg, logPath));
  }, {});

  return createStore(initialState, { compiler });
}

export async function main(cwd) {
  const rootDir = getRootDir(cwd);
  if (!rootDir) {
    throw new Error("Cannot find lerna.json");
  }

  tmp.setGracefulCleanup();

  const store = await getStore(rootDir);
  store.subscribe(() =>
    logUpdate(
      render({
        // FIXME: Move to redux state
        width: process.stdout.columns!,
        height: process.stdout.rows!,
        packages: getPackages(store.getState())
      })
    )
  );

  const packages = getPackages(store.getState());
  if (packages.length === 0) {
    console.log(`package not found in ${rootDir}`);
  }
  for (let { package: pkg } of packages) {
    const ignore = getIgnore(pkg.location);
    watch(pkg.location, { ignore, ignoreInitial: true })
      .on("add", () => store.dispatch(actions.startCompile(pkg.location)))
      .on("unlink", () => store.dispatch(actions.startCompile(pkg.location)))
      .on("change", () => store.dispatch(actions.startCompile(pkg.location)))
      .on("error", () => store.dispatch(actions.startCompile(pkg.location)))
      .on("ready", () => store.dispatch(actions.makeReady(pkg.location)));
  }
}

main(process.cwd()).catch(error => {
  console.error(error.stack);
  process.exit(1);
});

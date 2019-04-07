import tmp from "tmp";
import { createStore } from "../store";
import { getPackages } from "../store/selectors";
import { watch } from "../watcher";
import { createRenderer } from "../renderer";
import { getIgnore } from "../lib/gitignore";
import { getRootDir, getLernaPackages } from "../lib/lerna";
import { reducer } from "../store/reducer";
import * as actions from "../store/action";
import { Compiler } from "../compiler";

async function getStore(rootDir: string) {
  const tty = process.stdout;
  const compiler = new Compiler({ shell: `npm run prepare` });
  const lernaPackages = await getLernaPackages(rootDir);
  const initialState = lernaPackages.reduce(
    (state, pkg) => {
      const { name: logPath } = tmp.fileSync({
        template: `.monow-XXXXXX.log`
      });
      return reducer(state, actions.addPackage(pkg, logPath));
    },
    {
      size: {
        width: tty.columns!,
        height: tty.rows!
      },
      packages: {}
    }
  );

  return createStore(initialState, { compiler, tty });
}

export async function main(cwd: string) {
  const rootDir = getRootDir(cwd);
  if (!rootDir) {
    throw new Error("Cannot find lerna.json");
  }

  tmp.setGracefulCleanup();

  const store = await getStore(rootDir);
  store.subscribe(createRenderer(store));

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

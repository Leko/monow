import { FSWatcher } from "fs";
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
import { Tester } from "../tester";

type Options = {
  buildScript: string;
  testScript: string;
  runTests: boolean;
  allowNotify: boolean;
};

async function getStore(rootDir: string, options: Options) {
  const tty = process.stdout;
  const compiler = new Compiler({ scriptName: options.buildScript });
  const tester = new Tester({ scriptName: options.testScript });
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

  return createStore(initialState, {
    compiler,
    tty,
    runTests: options.runTests,
    allowNotify: options.allowNotify,
    tester
  });
}

export async function main(cwd: string, options: Options) {
  const rootDir = getRootDir(cwd);
  if (!rootDir) {
    throw new Error("Cannot find lerna.json");
  }

  tmp.setGracefulCleanup();

  const store = await getStore(rootDir, options);
  store.subscribe(createRenderer(store));

  const packages = getPackages(store.getState());
  if (packages.length === 0) {
    console.log(`package not found in ${rootDir}`);
  }

  const watchers: FSWatcher[] = [];
  process.on("SIGINT", () => {
    watchers.forEach(w => w.close());
  });
  for (let { package: pkg } of packages) {
    const ignore = getIgnore(pkg.location);
    const watcher = watch(pkg.location);
    watchers.push(watcher);
    watcher.on("change", (_, filename: string) => {
      if (ignore.ignores(filename)) {
        return;
      }
      store.dispatch(actions.startCompile(pkg.location));
    });
    watcher.on("error", (error: Error) => {
      store.dispatch(actions.completeCompile(pkg.location, error));
    });
    store.dispatch(actions.makeReady(pkg.location));
  }
}

#!/usr/bin/env node

// import { getPackages } from "./selectors";
// import { render } from "../renderer";
// const store = createStore({});
// const unSubscribe = store.subscribe(() => {
//   const props = {
//     packages: getPackages(store.getState())
//   };
//   logUpdate(render(props));
// });

const { EOL } = require("os");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const sortBy = require("lodash/sortBy");
const logUpdate = require("log-update");
const execa = require("execa");
const findUp = require("find-up").sync;
const chokidar = require("chokidar");
const ignore = require("ignore");
const Project = require("@lerna/project");
const PackageGraph = require("@lerna/package-graph");

const pattern = "**/*";
const cmd = "npm run prepare";

let state = {};
const setSubState = (key, newState) => {
  state = {
    ...state,
    [key]: {
      ...(state[key] || {}),
      ...newState
    }
  };
  render(state);
};

const render = state => {
  const packages = sortBy(Object.entries(state), ([p]) => p);
  const lines = packages.map(([, { ready, queued, busy, package }]) => {
    const indicator = ready
      ? busy
        ? chalk.yellow("●")
        : chalk.green("●")
      : chalk.dim("●");
    const name = busy
      ? queued
        ? chalk.yellow(package.name)
        : chalk.dim(package.name)
      : package.name;

    return `${indicator} ${name}`;
  });

  logUpdate(lines.join("\n"));
};

const compile = (pkg, command) => {
  if (state[pkg.location].busy) {
    setSubState(pkg.location, {
      queued: true
    });
    return false;
  }

  setSubState(pkg.location, {
    busy: true,
    queued: false
  });

  return execa
    .shell(command, {
      cwd: pkg.location
    })
    .then(() => {
      setSubState(pkg.location, {
        busy: false
      });

      if (state[pkg.location].queued) {
        return compile(pkg, command);
      }
    })
    .catch(e => {
      console.error(`  error! ${pkg.location}`);
      throw e;
    });
};

const handleAdd = (pkg, command) => path => {
  compile(pkg, command);
};
const handleUnlink = (pkg, command) => path => {
  compile(pkg, command);
};
const handleChange = (pkg, command) => path => {
  compile(pkg, command);
};
const handleError = (pkg, command) => error => {
  console.error(error.stack);
};
const handleReady = (pkg, command) => () => {
  setSubState(pkg.location, {
    ready: true
  });
};

const main = async lernaJsonPath => {
  if (!lernaJsonPath) {
    throw new Error(
      "Cannot find lerna.json in current directoly: " + process.cwd()
    );
  }

  const lernaRootDir = path.dirname(lernaJsonPath);
  const project = new Project(lernaRootDir);
  const packages = await project.getPackages();
  const graph = new PackageGraph(packages);
  for (let [packageName, package] of graph.entries()) {
    let p = package.location;
    const ignores = [];
    while (p !== "/") {
      const gitIgnorePath = path.join(p, ".gitignore");
      if (fs.existsSync(gitIgnorePath)) {
        ignores.push(gitIgnorePath);
      }
      p = path.dirname(p);
    }

    const lines = []
      .concat(...ignores.map(p => fs.readFileSync(p, "utf8").split(EOL)))
      .filter(l => !!l && !l.startsWith("#"));
    const globPattern = path.join(package.location, pattern);
    const watcher = chokidar.watch(globPattern, {
      ignored: console.log,
      ignoreInitial: true
    });

    state[package.location] = {
      package,
      ready: false,
      busy: false,
      queued: false
    };

    watcher
      .on("add", handleAdd(package, cmd))
      .on("unlink", handleUnlink(package, cmd))
      .on("change", handleChange(package, cmd))
      .on("error", handleError(package, cmd))
      .on("ready", handleReady(package, cmd));
  }
  render(state);
};

main(findUp("lerna.json"), package => {
  console.log(package);
}).catch(console.error);

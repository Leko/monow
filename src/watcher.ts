import { FSWatcher, WatchOptions } from "chokidar";
import ignore from "ignore";

type Ignore = ReturnType<typeof ignore>;

type Options = {
  ignore: Ignore;
};

export class Watcher extends FSWatcher {
  private ignore: Ignore;

  constructor(opts: WatchOptions & Options) {
    const { ignore, ...options } = opts;
    super(options);
    this.ignore = ignore;
  }

  _isIgnored(path: string): boolean {
    return this.ignore.ignores(path);
  }
}

export function watch(dir: string, options: WatchOptions & Options) {
  const watcher = new Watcher(options);
  watcher.add(dir);

  return watcher;
}

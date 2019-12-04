import path from "path";
import execa from "execa";

type Options = {
  scriptName: string;
};

export class Compiler {
  scriptName: string;

  constructor(options: Options) {
    this.scriptName = options.scriptName;
  }

  async compile(cwd: string): Promise<void> {
    if (!(await this.shouldRun(cwd))) {
      return;
    }
    try {
      await execa("npm", ["run", this.scriptName], {
        cwd,
        all: true,
      });
    } catch (e) {
      throw new Error(`[exitCode:${e.exitCode}] ${e.all}`);
    }
  }

  private async shouldRun(cwd: string) {
    const pkg = require(path.join(cwd, "package.json"));
    return pkg.scripts && !!pkg.scripts[this.scriptName];
  }
}

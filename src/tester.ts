import path from "path";
import execa from "execa";

type Options = {
  scriptName: string;
};

export class Tester {
  scriptName: string;

  constructor(options: Options) {
    this.scriptName = options.scriptName;
  }

  async test(cwd: string): Promise<void> {
    if (!(await this.shouldRun(cwd))) {
      return;
    }
    const shell = `npm run ${this.scriptName}`;
    const { stderr, failed, exitCode } = await execa(shell, {
      cwd,
      shell: true
    });
    if (failed) {
      throw new Error(`[exitCode:${exitCode}] ${stderr}`);
    }
  }

  private async shouldRun(cwd: string) {
    const pkg = require(path.join(cwd, "package.json"));
    return !!pkg[this.scriptName];
  }
}

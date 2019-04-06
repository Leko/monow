import execa from "execa";

type Options = {
  cwd: string;
  shell: string;
};

export class Compiler {
  cwd: string;
  shell: string;

  constructor(options: Options) {
    this.cwd = options.cwd;
    this.shell = options.shell;
  }

  async compile(): Promise<void> {
    const { stderr, failed, code } = await execa.shell(this.shell, {
      cwd: this.cwd
    });
    if (failed) {
      throw new Error(`[code:${code}] ${stderr}`);
    }
  }
}

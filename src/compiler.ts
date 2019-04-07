import execa from "execa";

type Options = {
  shell: string;
};

export class Compiler {
  shell: string;

  constructor(options: Options) {
    this.shell = options.shell;
  }

  async compile(cwd: string): Promise<void> {
    const { stderr, failed, code } = await execa.shell(this.shell, { cwd });
    if (failed) {
      throw new Error(`[code:${code}] ${stderr}`);
    }
  }
}

import execa from "execa";

type Options = {
  shell: string;
};

export class Tester {
  shell: string;

  constructor(options: Options) {
    this.shell = options.shell;
  }

  async test(cwd: string): Promise<void> {
    const { stderr, failed, exitCode } = await execa(this.shell, { cwd, shell: true });
    if (failed) {
      throw new Error(`[exitCode:${exitCode}] ${stderr}`);
    }
  }
}

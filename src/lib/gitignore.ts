import fs from "fs";
import path from "path";
import ignore from "ignore";

type Ignore = ReturnType<typeof ignore>;

function findUpRecursive(cwd: string, fileName: string): string[] {
  const paths: string[] = [];
  while (cwd !== "/") {
    const p = path.join(cwd, fileName);
    if (fs.existsSync(p)) {
      paths.push(p);
    }
    cwd = path.dirname(cwd);
  }
  return paths;
}

function findIgnoreFiles(cwd: string): string[] {
  return findUpRecursive(cwd, ".gitignore");
}

export function getIgnore(cwd: string): Ignore {
  const rawIgnore = findIgnoreFiles(cwd)
    .map(p => fs.readFileSync(p, "utf8"))
    .reduce((ign, f) => ign.add(f), ignore());

  return {
    ...rawIgnore,
    // Patch for "path should be a `path.relative()`d string"
    ignores(pathname: string): boolean {
      if (cwd === pathname) {
        return false;
      }

      const relative = path.isAbsolute(pathname)
        ? path.relative(cwd, pathname)
        : pathname;

      return rawIgnore.ignores(relative);
    }
  };
}

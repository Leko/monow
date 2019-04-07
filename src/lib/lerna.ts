import path from "path";
import { sync as findUp } from "find-up";
import { Package } from "../store/state";

export function getRootDir(cwd: string): string | null {
  const dir = findUp("lerna.json", { cwd });
  return dir ? path.dirname(dir) : null;
}

export async function getLernaPackages(rootDir: string): Promise<Package[]> {
  // @ts-ignore peerDependencies
  const { default: Project } = await import(path.join(
    rootDir,
    "node_modules",
    "@lerna/project"
  ));
  // @ts-ignore peerDependencies
  const { default: PackageGraph } = await import(path.join(
    rootDir,
    "node_modules",
    "@lerna/package-graph"
  ));

  const project = new Project(rootDir);
  const packages = await project.getPackages();
  const graph = new PackageGraph(packages);

  return Array.from(graph.values());
}

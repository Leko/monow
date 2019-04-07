import path from "path";
import { sync as findUp } from "find-up";
// @ts-ignore peerDependencies
import Project from "@lerna/project";
// @ts-ignore peerDependencies
import PackageGraph from "@lerna/package-graph";
import { Package } from "../store/state";

export function getRootDir(cwd: string): string | null {
  const dir = findUp("lerna.json", { cwd });
  return dir ? path.dirname(dir) : null;
}

export async function getLernaPackages(rootDir: string): Promise<Package[]> {
  const project = new Project(rootDir);
  const packages = await project.getPackages();
  const graph = new PackageGraph(packages);

  return Array.from(graph.values());
}

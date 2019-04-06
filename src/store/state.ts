// import { PackageGraphNode } from "@lerna/package-graph";

export type Package = {
  name: string;
};

export type SubState = {
  ready: boolean;
  queued: boolean;
  busy: boolean;
  error: Error | null;
  package: Package;
};

export type State = {
  [dir: string]: SubState;
};

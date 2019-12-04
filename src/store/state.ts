// import { PackageGraphNode } from "@lerna/package-graph";

export type Package = {
  name: string;
  location: string;
  localDependents: Map<string, Package>;
};

export type SubState = {
  ready: boolean;
  selected: boolean;
  buildQueued: boolean;
  testQueued: boolean;
  buildBusy: boolean;
  testBusy: boolean;
  error: Error | null;
  logPath: string;
  package: Package;
};

export type State = {
  size: {
    width: number;
    height: number;
  };
  cursor: {
    position: number;
  };
  packages: {
    [dir: string]: SubState;
  };
};

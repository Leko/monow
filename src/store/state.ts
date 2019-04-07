// import { PackageGraphNode } from "@lerna/package-graph";

export type Package = {
  name: string;
  location: string;
};

export type SubState = {
  ready: boolean;
  queued: boolean;
  busy: boolean;
  error: Error | null;
  logPath: string;
  package: Package;
};

export type State = {
  size: {
    width: number;
    height: number;
  };
  packages: {
    [dir: string]: SubState;
  };
};

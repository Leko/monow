// import { PackageGraphNode } from "@lerna/package-graph";

export type SubState = {
  ready: boolean;
  queued: boolean;
  busy: boolean;
  package: {
    name: string;
  };
};

export type State = {
  [dir: string]: SubState;
};

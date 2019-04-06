import { Package } from "./state";

export const addPackage = (dir: string, pkg: Package) => ({
  type: "ADD_PACKAGE" as const,
  dir,
  pkg
});

export const makeReady = (dir: string) => ({
  type: "MAKE_READY" as const,
  dir
});

export const getBusy = (dir: string) => ({
  type: "GET_BUSY" as const,
  dir
});

export const free = (dir: string) => ({
  type: "FREE" as const,
  dir
});

export const startCompile = (dir: string) => ({
  type: "COMPILE_STARTED" as const,
  dir
});

export const completeCompile = (dir: string, error: Error | null) => ({
  type: "COMPILE_COMPLETED" as const,
  dir,
  error
});

export type Action =
  | ReturnType<typeof addPackage>
  | ReturnType<typeof makeReady>
  | ReturnType<typeof getBusy>
  | ReturnType<typeof free>
  | ReturnType<typeof startCompile>
  | ReturnType<typeof completeCompile>;

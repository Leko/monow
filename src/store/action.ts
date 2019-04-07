import { Package } from "./state";

export const addPackage = (pkg: Package, logPath: string) => ({
  type: "ADD_PACKAGE" as const,
  pkg,
  logPath
});

export const makeReady = (dir: string) => ({
  type: "MAKE_READY" as const,
  dir
});

export const getBusy = (dir: string) => ({
  type: "GET_BUSY" as const,
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

export const enqueueCompile = (dir: string) => ({
  type: "COMPILE_QUEUED" as const,
  dir
});

export type Action =
  | ReturnType<typeof addPackage>
  | ReturnType<typeof makeReady>
  | ReturnType<typeof getBusy>
  | ReturnType<typeof free>
  | ReturnType<typeof startCompile>
  | ReturnType<typeof completeCompile>
  | ReturnType<typeof enqueueCompile>;

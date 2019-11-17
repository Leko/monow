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

export const runTest = (dir: string) => ({
  type: "TEST_STARTED" as const,
  dir
});

export const completeTest = (dir: string, error: Error | null) => ({
  type: "TEST_COMPLETED" as const,
  dir,
  error
});

export const enqueueTest = (dir: string) => ({
  type: "TEST_QUEUED" as const,
  dir
});

export const setSize = ({
  width,
  height
}: {
  width: number;
  height: number;
}) => ({
  type: "RESIZED" as const,
  width,
  height
});

export const onKeypress = (chunk:any, key:any) => ({
  type: "ON_KEYPRESS" as const,
  chunk,
  key
});

export const moveUpCursor = () => ({
  type: "CURSOR_MOVE_UP" as const,
});

export const moveDownCursor = () => ({
  type: "CURSOR_MOVE_DOWN" as const,
});

export type Action =
  | ReturnType<typeof addPackage>
  | ReturnType<typeof makeReady>
  | ReturnType<typeof startCompile>
  | ReturnType<typeof completeCompile>
  | ReturnType<typeof enqueueCompile>
  | ReturnType<typeof runTest>
  | ReturnType<typeof completeTest>
  | ReturnType<typeof enqueueTest>
  | ReturnType<typeof setSize>
  | ReturnType<typeof onKeypress>
  | ReturnType<typeof moveUpCursor>
  | ReturnType<typeof moveDownCursor>

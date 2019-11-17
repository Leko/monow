import { createStore as createReduxStore, applyMiddleware } from "redux";
import { reducer } from "./reducer";
import { State } from "./state";
import { Action } from "./action";
import { Compiler } from "../compiler";
import { Tester } from "../tester";
import { createMiddleware as createCompileMiddleware } from "./middleware/compile";
import { createMiddleware as createTestMiddleware } from "./middleware/test";
import { createMiddleware as createLogMiddleware } from "./middleware/log";
import { createMiddleware as createResizeMiddleware } from "./middleware/resize";
import { createMiddleware as createNotifyMiddleware } from "./middleware/notify";
import { createMiddleware as createCursorMiddleware } from "./middleware/cursor";

export function createStore(
  initialState: State,
  {
    compiler,
    tester,
    runTests,
    allowNotify,
    tty
  }: {
    compiler: Compiler;
    tester: Tester;
    runTests: boolean;
    allowNotify: boolean;
    tty: typeof process.stdout;
  }
) {
  const middlewares = [
    createNotifyMiddleware({ allowNotify }),
    createResizeMiddleware(tty),
    createCursorMiddleware(),
    createCompileMiddleware(compiler, { runTests }),
    createTestMiddleware(tester),
    createLogMiddleware()
  ];

  return createReduxStore<State, Action, {}, {}>(
    reducer,
    initialState,
    applyMiddleware(...middlewares)
  );
}

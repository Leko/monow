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

export function createStore(
  initialState: State,
  {
    compiler,
    tester,
    tty
  }: { compiler: Compiler; tester: Tester | null; tty: typeof process.stdout }
) {
  const middlewares = [
    createResizeMiddleware(tty),
    createCompileMiddleware(compiler),
    createLogMiddleware()
  ];
  if (tester !== null) {
    middlewares.unshift(createTestMiddleware(tester));
  }

  return createReduxStore<State, Action, {}, {}>(
    reducer,
    initialState,
    applyMiddleware(...middlewares)
  );
}

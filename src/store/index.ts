import { createStore as createReduxStore, applyMiddleware } from "redux";
import { reducer } from "./reducer";
import { State } from "./state";
import { Action } from "./action";
import { Compiler } from "../compiler";
import { createMiddleware as createCompileMiddleware } from "./middleware/compile";
import { createMiddleware as createLogMiddleware } from "./middleware/log";
import { createMiddleware as createResizeMiddleware } from "./middleware/resize";

export function createStore(
  initialState: State,
  { compiler, tty }: { compiler: Compiler; tty: typeof process.stdout }
) {
  return createReduxStore<State, Action, {}, {}>(
    reducer,
    initialState,
    applyMiddleware(
      createResizeMiddleware(tty),
      createCompileMiddleware(compiler),
      createLogMiddleware()
    )
  );
}

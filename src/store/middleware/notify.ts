import path from "path";
import notifier from "node-notifier";
import { Middleware } from "redux";
import { State } from "../state";
import { Action } from "../action";

export const createMiddleware = (): Middleware<{}, State> => () => {
  return next => (action: Action) => {
    if (action.type === "COMPILE_COMPLETED") {
      notifier.notify({
        title: action.error ? "Build failed" : "Build successful",
        message: path.relative(process.cwd(), action.dir),
      });
    }
    if (action.type === "TEST_COMPLETED") {
      notifier.notify({
        title: action.error ? "Test failed" : "Test successful",
        message: path.relative(process.cwd(), action.dir),
      });
    }
    return next(action);
  };
};

import { Middleware } from "redux";
import { State } from "../state";
import { Action, setSize } from "../action";

export const createMiddleware = (
  tty: typeof process.stdout
): Middleware<{}, State> => store => {
  process.stdout.on("resize", () => {
    store.dispatch(
      setSize({
        width: tty.columns!,
        height: tty.rows!
      })
    );
  });

  return next => (action: Action) => {
    return next(action);
  };
};

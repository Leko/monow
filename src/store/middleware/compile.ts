import { Middleware } from "redux";
import { State } from "../state";
import {
  Action,
  startCompile,
  completeCompile,
  enqueueCompile
} from "../action";
import { Compiler } from "../../compiler";

export const createMiddleware = (
  compiler: Compiler
): Middleware<{}, State> => store => next => (action: Action) => {
  switch (action.type) {
    case "COMPILE_STARTED": {
      const { busy } = store.getState()[action.dir];
      if (busy) {
        store.dispatch(enqueueCompile(action.dir));
        return;
      }

      compiler
        .compile(action.dir)
        .then(() => store.dispatch(completeCompile(action.dir, null)))
        .catch(error => store.dispatch(completeCompile(action.dir, error)));
      return next(action);
    }

    case "COMPILE_COMPLETED": {
      const { queued } = store.getState()[action.dir];
      if (queued) {
        const nextAction = next(action);
        store.dispatch(startCompile(action.dir));
        return nextAction;
      }
    }
  }

  return next(action);
};

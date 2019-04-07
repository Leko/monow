import fs from "fs";
import { Middleware } from "redux";
import { State } from "../state";
import { Action } from "../action";
import { getPackageMap } from "../../store/selectors";

export const createMiddleware = (): Middleware<{}, State> => store => next => (
  action: Action
) => {
  switch (action.type) {
    case "TEST_COMPLETED":
    case "COMPILE_COMPLETED": {
      const nextAction = next(action);
      const { logPath, error } = getPackageMap(store.getState())[action.dir];
      fs.writeFileSync(logPath, error ? error.message : "");

      return nextAction;
    }
  }

  return next(action);
};

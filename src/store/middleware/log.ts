import fs from "fs";
import { Middleware } from "redux";
import { State } from "../state";
import { Action } from "../action";
import { getPackageMap } from "../../store/selectors";

export const createMiddleware = (): Middleware<{}, State> => store => next => (
  action: Action
) => {
  switch (action.type) {
    case "COMPILE_STARTED": {
      const { logPath } = getPackageMap(store.getState())[action.dir];
      fs.truncateSync(logPath);
      break;
    }

    case "COMPILE_COMPLETED": {
      const { logPath, error } = getPackageMap(store.getState())[action.dir];
      if (error) {
        fs.writeFileSync(logPath, error.message, "utf8");
      }
      break;
    }
  }

  return next(action);
};

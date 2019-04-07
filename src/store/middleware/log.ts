import fs from "fs";
import { Middleware } from "redux";
import { State } from "../state";
import { Action } from "../action";

export const createMiddleware = (): Middleware<{}, State> => store => next => (
  action: Action
) => {
  switch (action.type) {
    case "COMPILE_STARTED": {
      const { logPath } = store.getState()[action.dir];
      fs.truncateSync(logPath);
      break;
    }

    case "COMPILE_COMPLETED": {
      const { logPath, error } = store.getState()[action.dir];
      if (error) {
        fs.writeFileSync(logPath, error.message, "utf8");
      }
      break;
    }
  }

  return next(action);
};

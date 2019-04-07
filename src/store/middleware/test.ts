import { Middleware } from "redux";
import { State } from "../state";
import { Action, runTest, completeTest, enqueueTest } from "../action";
import { Tester } from "../../tester";
import { getPackageMap } from "../../store/selectors";

export const createMiddleware = (
  tester: Tester
): Middleware<{}, State> => store => next => (action: Action) => {
  switch (action.type) {
    case "COMPILE_COMPLETED": {
      const nextAction = next(action);
      const { testQueued } = getPackageMap(store.getState())[action.dir];
      if (testQueued) {
        store.dispatch(runTest(action.dir));
      }
      return nextAction;
    }

    case "TEST_STARTED": {
      const { testBusy, buildBusy } = getPackageMap(store.getState())[
        action.dir
      ];
      if (testBusy || buildBusy) {
        store.dispatch(enqueueTest(action.dir));
        return;
      }

      tester
        .test(action.dir)
        .then(() => store.dispatch(completeTest(action.dir, null)))
        .catch(error => store.dispatch(completeTest(action.dir, error)));
      return next(action);
    }

    case "TEST_COMPLETED": {
      const { testQueued } = getPackageMap(store.getState())[action.dir];
      if (testQueued) {
        const nextAction = next(action);
        store.dispatch(runTest(action.dir));
        return nextAction;
      }
      break;
    }
  }

  return next(action);
};

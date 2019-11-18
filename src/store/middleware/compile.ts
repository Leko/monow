import { Middleware } from "redux";
import { State } from "../state";
import {
  Action,
  startCompile,
  completeCompile,
  enqueueCompile,
  toggleSelected,
  runTest
} from "../action";
import { Compiler } from "../../compiler";
import { getPackageMap } from "../../store/selectors";

export const createMiddleware = (
  compiler: Compiler,
  {
    runTests
  }: {
    runTests: boolean;
  }
): Middleware<{}, State> => store => next => (action: Action) => {
  switch (action.type) {
    case "COMPILE_STARTED": {
      const { buildBusy, selected } = getPackageMap(store.getState())[action.dir];
      if (selected) {
        store.dispatch(toggleSelected(action.dir));
      }
      if (buildBusy) {
        store.dispatch(enqueueCompile(action.dir));
        return;
      }

      compiler
        .compile(action.dir)
        .then(() => {
          store.dispatch(completeCompile(action.dir, null));
          if (!runTests) {
            return;
          }
          const { package: pkg } = getPackageMap(store.getState())[action.dir];
          const dependents = Array.from(
            pkg.localDependents.values(),
            pkg => pkg.location
          );
          for (let dependent of dependents) {
            store.dispatch(runTest(dependent));
          }
        })
        .catch(error => store.dispatch(completeCompile(action.dir, error)));
      return next(action);
    }

    case "COMPILE_COMPLETED": {
      const { buildQueued } = getPackageMap(store.getState())[action.dir];
      if (buildQueued) {
        const nextAction = next(action);
        store.dispatch(startCompile(action.dir));
        return nextAction;
      }
    }
  }

  return next(action);
};

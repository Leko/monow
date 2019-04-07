import { produce, Draft } from "immer";
import { State } from "./state";
import { Action } from "./action";

const initialState: State = {
  size: {
    width: -1,
    height: -1
  },
  packages: {}
};

function reduce(draft: Draft<State>, action: Action) {
  switch (action.type) {
    case "ADD_PACKAGE":
      draft.packages[action.pkg.location] = {
        package: action.pkg,
        logPath: action.logPath,
        ready: false,
        buildBusy: false,
        buildQueued: false,
        testBusy: false,
        testQueued: false,
        error: null
      };
      break;
    case "MAKE_READY":
      draft.packages[action.dir].ready = true;
      break;
    case "COMPILE_STARTED":
      draft.packages[action.dir].buildBusy = true;
      draft.packages[action.dir].buildQueued = false;
      draft.packages[action.dir].error = null;
      break;
    case "COMPILE_COMPLETED":
      draft.packages[action.dir].buildBusy = false;
      draft.packages[action.dir].error = action.error;
      break;
    case "COMPILE_QUEUED":
      draft.packages[action.dir].buildQueued = true;
      break;
    case "TEST_STARTED":
      draft.packages[action.dir].testBusy = true;
      draft.packages[action.dir].testQueued = false;
      draft.packages[action.dir].error = null;
      break;
    case "TEST_COMPLETED":
      draft.packages[action.dir].testBusy = false;
      draft.packages[action.dir].error = action.error;
      break;
    case "TEST_QUEUED":
      draft.packages[action.dir].testQueued = true;
      break;
    case "RESIZED": {
      draft.size.width = action.width;
      draft.size.height = action.height;
      break;
    }
  }
  return draft;
}

export function reducer(state: State = initialState, action: Action): State {
  return produce(state, draft => reduce(draft, action));
}

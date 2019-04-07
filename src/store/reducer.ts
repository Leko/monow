import { produce, Draft } from "immer";
import { State, SubState } from "./state";
import { Action } from "./action";

const initialState: State = {
  size: {
    width: -1,
    height: -1
  },
  packages: {}
};

function mergePackageState(
  state: State,
  key: string,
  overrides: Partial<SubState>
): State {
  return {
    ...state,
    packages: {
      ...state.packages,
      [key]: {
        ...state.packages[key],
        ...overrides
      }
    }
  };
}

function reduce(draft: Draft<State>, action: Action) {
  switch (action.type) {
    case "ADD_PACKAGE":
      draft.packages[action.pkg.location] = {
        package: action.pkg,
        logPath: action.logPath,
        busy: false,
        ready: false,
        queued: false,
        error: null
      };
      break;
    case "MAKE_READY":
      draft.packages[action.dir].ready = true;
      break;
    case "GET_BUSY":
      draft.packages[action.dir].busy = true;
      break;
    case "COMPILE_STARTED":
      draft.packages[action.dir].busy = true;
      draft.packages[action.dir].queued = false;
      draft.packages[action.dir].error = null;
      break;
    case "COMPILE_COMPLETED":
      draft.packages[action.dir].busy = false;
      draft.packages[action.dir].error = action.error;
      break;
    case "COMPILE_QUEUED":
      draft.packages[action.dir].queued = true;
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

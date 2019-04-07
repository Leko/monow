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
      [key]: {
        ...state.packages[key],
        ...overrides
      }
    }
  };
}

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "ADD_PACKAGE":
      return mergePackageState(state, action.pkg.location, {
        package: action.pkg,
        logPath: action.logPath,
        busy: false,
        ready: false,
        queued: false,
        error: null
      });
    case "MAKE_READY":
      return mergePackageState(state, action.dir, {
        ready: true
      });
    case "GET_BUSY":
      return mergePackageState(state, action.dir, {
        busy: true
      });
    case "COMPILE_STARTED":
      return mergePackageState(state, action.dir, {
        busy: true,
        queued: false,
        error: null
      });
    case "COMPILE_COMPLETED":
      return mergePackageState(state, action.dir, {
        busy: false,
        error: action.error
      });
    case "COMPILE_QUEUED":
      return mergePackageState(state, action.dir, {
        queued: true
      });
    case "RESIZED": {
      const { width, height } = action;
      return { ...state, size: { width, height } };
    }
    default:
      return state;
  }
}

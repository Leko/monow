import { State } from "./state";
import { Action } from "./action";

export function reducer(state: State = {}, action: Action): State {
  switch (action.type) {
    case "ADD_PACKAGE":
      return {
        ...state,
        [action.dir]: {
          package: action.pkg,
          busy: false,
          ready: false,
          queued: false,
          error: null
        }
      };
    case "MAKE_READY":
      return {
        ...state,
        [action.dir]: {
          ...state[action.dir],
          ready: true
        }
      };
    case "GET_BUSY":
      return {
        ...state,
        [action.dir]: {
          ...state[action.dir],
          busy: true
        }
      };
    case "FREE":
      return {
        ...state,
        [action.dir]: {
          ...state[action.dir],
          busy: false
        }
      };
    case "COMPILE_STARTED":
      return {
        ...state,
        [action.dir]: {
          ...state[action.dir],
          busy: true,
          queued: false,
          error: null
        }
      };
    case "COMPILE_COMPLETED":
      return {
        ...state,
        [action.dir]: {
          ...state[action.dir],
          busy: false,
          error: action.error
        }
      };
    default:
      return state;
  }
}

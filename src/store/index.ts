import { createStore as createReduxStore } from "redux";
import { reducer } from "./reducer";
import { State } from "./state";
import { Action } from "./action";

export function createStore(initialState: State) {
  return createReduxStore<State, Action, {}, {}>(reducer, initialState);
}

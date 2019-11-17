import { Middleware } from "redux";
import { State } from "../state";
import * as actions from "../action";
import { Action } from "../action";
import { getPackages } from "../../store/selectors";

export const createMiddleware = (): Middleware<{}, State> => store => next => (
  action: Action
) => {
  const state = store.getState()
  const packages = getPackages(state)
  const currentPosition = state.cursor.position
  const isMinPosition = state.cursor.position === 0
  const isMaxPosition = state.cursor.position === packages.length - 1

  switch (action.type) {
    case "ON_KEYPRESS": {
      const seqence = action.key.sequence
      // on up-key
      if(!isMinPosition && action.key.sequence === '\u001b[A') store.dispatch(actions.moveUpCursor())
      // on down-key
      if(!isMaxPosition && action.key.sequence === '\u001b[B') store.dispatch(actions.moveDownCursor())
      // on return-key
      if(seqence === '\r') {
        const pkg = packages[currentPosition].package
        store.dispatch(actions.startCompile(pkg.location))
      }
    }
  }
  return next(action);
};

import { Middleware } from "redux";
import { State } from "../state";
import * as actions from "../action";
import { Action } from "../action";
import { getPackages, getSelectedPackages } from "../../store/selectors";

export const createMiddleware = (): Middleware<{}, State> => store => next => (
  action: Action
) => {
  switch (action.type) {
    case "ON_KEYPRESS": {
      const state = store.getState();
      const packages = getPackages(state);
      const currentPosition = state.cursor.position;
      const focusPkg = packages[currentPosition].package;
      const isMinPosition = state.cursor.position === 0;
      const isMaxPosition = state.cursor.position === packages.length - 1;
      const seqence = action.key.sequence;

      // on up-key
      if (!isMinPosition && action.key.sequence === "\u001b[A") {
        store.dispatch(actions.moveUpCursor());
      }
      // on down-key
      if (!isMaxPosition && action.key.sequence === "\u001b[B") {
        store.dispatch(actions.moveDownCursor());
      }
      // on return-key
      if (seqence === "\r") {
        getSelectedPackages(state).forEach(({ package: selectedPkg }) =>
          store.dispatch(actions.startCompile(selectedPkg.location))
        );
      }
      // on space-key
      if (seqence === " ") {
        store.dispatch(actions.toggleSelected(focusPkg.location));
      }
    }
  }
  return next(action);
};

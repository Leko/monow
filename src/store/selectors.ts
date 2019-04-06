import sortBy from "lodash/sortBy";
import { State } from "./state";

export const getPackages = (state: State) =>
  sortBy(Object.values(state), subState => subState.package.name);

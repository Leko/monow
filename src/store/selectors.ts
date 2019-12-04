import sortBy from "lodash.sortby";
import { State } from "./state";

export const getWidth = (state: State) => state.size.width;

export const getHeight = (state: State) => state.size.height;

export const getPackageMap = (state: State) => state.packages;

export const getPackages = (state: State) =>
  sortBy(
    Object.values(getPackageMap(state)),
    subState => subState.package.name
  );

export const getSelectedPackages = (state: State) =>
  getPackages(state).filter(pkg => !!pkg.selected);

export const getCursor = (state: State) => state.cursor.position;

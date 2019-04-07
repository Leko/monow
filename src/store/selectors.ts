import sortBy from "lodash/sortBy";
import { State } from "./state";

export const getWidth = (state: State) => state.size.width;

export const getHeight = (state: State) => state.size.height;

export const getPackageMap = (state: State) => state.packages;

export const getPackages = (state: State) =>
  sortBy(
    Object.values(getPackageMap(state)),
    subState => subState.package.name
  );

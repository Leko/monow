import chalk, { Chalk } from "chalk";
import { SubState } from "./store/state";

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Color = Omit<FunctionPropertyNames<Chalk>, "constructor">;

export const getIndicatorColor = ({ ready, busy }: SubState): Color =>
  ready ? (busy ? "yellow" : "green") : "dim";

export const getStatusColor = ({ busy, queued }: SubState): Color | null =>
  busy ? (queued ? "yellow" : "dim") : null;

type Props = {
  packages: SubState[];
};

export function render(props: Props): string {
  const { packages } = props;
  const lines = packages.map(subState => {
    const indicatorColor = getIndicatorColor(subState);
    const statusColor = getStatusColor(subState);
    // @ts-ignore cannot be used as an index type
    const indicator = chalk[indicatorColor]("●");
    const status = statusColor
      ? chalk
          // @ts-ignore cannot be used as an index type
          [statusColor](subState.package.name)
      : subState.package.name;

    return `${indicator} ${status}`;
  });

  return lines.join("\n");
}

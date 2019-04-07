import { EOL } from "os";
import { Store } from "redux";
import logUpdate from "log-update";
import stringWidth from "string-width";
import chalk from "chalk";
import { SubState, State } from "./store/state";
import { Action } from "./store/action";
import { getPackages, getWidth, getHeight } from "./store/selectors";

type Props = {
  width: number;
  height: number;
  packages: SubState[];
};

function renderIndicator({
  indicator,
  ready,
  busy,
  error
}: SubState & { indicator: string }): string {
  if (error) {
    return chalk.red(indicator);
  }
  if (!ready) {
    return chalk.dim(indicator);
  }
  if (busy) {
    return chalk.yellow(indicator);
  }
  return chalk.green(indicator);
}

function renderStatus({ error, busy, queued, package: pkg }: SubState): string {
  if (error) {
    return chalk.red(pkg.name);
  }
  if (busy) {
    if (queued) {
      return `${pkg.name} (queued)`;
    }
    return chalk.dim(pkg.name);
  }
  return pkg.name;
}

function renderLogPath({ error, logPath }: SubState): string {
  return error ? `(saved to ${logPath})` : "";
}

function renderError({ error }: SubState): string {
  return error ? error.message || "" : "";
}

function renderDivider({
  title,
  width,
  char = "-",
  padChar = " ",
  padding = 1,
  numOfHeadChars = 3
}: {
  title: string;
  width: number;
  char?: string;
  padding?: number;
  padChar?: string;
  numOfHeadChars?: number;
}): string {
  const restWidth = width - stringWidth(title) - padding * 2;
  const headChars = numOfHeadChars;
  const tailChars = restWidth - numOfHeadChars;
  return (
    char.repeat(headChars) + padChar + title + padChar + char.repeat(tailChars)
  );
}

function renderErrorSummary({
  lines,
  width,
  ...subState
}: SubState & { width: number; lines: number }): string {
  const { package: pkg } = subState;
  const separator = renderDivider({ title: `Error of ${pkg.name}`, width });
  const log = head(renderError(subState), lines - 1);
  return separator + EOL + log;
}

function head(str: string, n: number): string {
  return str
    .split(EOL)
    .slice(0, n)
    .join(EOL);
}

export function render(props: Props): string {
  const { width, height, packages } = props;

  const lines = packages
    .map(subState => ({
      indicator: renderIndicator({ ...subState, indicator: "●" }),
      status: renderStatus(subState),
      logPath: renderLogPath(subState)
    }))
    .map(({ indicator, status, logPath }) => {
      return `${indicator} ${status} ${logPath}`;
    });

  const restLines = height - lines.length;
  const erroredPackages = packages.filter(({ error }) => !!error);
  const linesPerError = Math.floor(restLines / erroredPackages.length);
  const errorSummaries = erroredPackages.map(subState =>
    renderErrorSummary({ width, lines: linesPerError, ...subState })
  );

  return lines.concat(errorSummaries).join(EOL);
}

export const createRenderer = (store: Store<State, Action>) => () => {
  const state = store.getState();

  logUpdate(
    render({
      width: getWidth(state),
      height: getHeight(state),
      packages: getPackages(state)
    })
  );
};

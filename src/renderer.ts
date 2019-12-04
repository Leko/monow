import { EOL } from "os";
import { Store } from "redux";
import logUpdate from "log-update";
import terminalLink from "terminal-link";
import stringWidth from "string-width";
import chalk from "chalk";
import { headWordWrap } from "./lib/ansi";
import { SubState, State } from "./store/state";
import { Action } from "./store/action";
import { getPackages, getWidth, getHeight, getCursor } from "./store/selectors";

type Props = {
  width: number;
  height: number;
  cursor: number;
  packages: SubState[];
};

function renderWelcomeMessages(): string[] {
  const description = chalk.gray(
    `⬢ Now watching the files, saving any file will rebuild the package.`
  );
  const question =
    chalk.green(`? `) +
    chalk.gray.italic(`interactive rebuild? `) +
    chalk.gray.italic.underline(`(select=spacekey, run=return)`);
  const breakline = ""
  return [description, question, breakline]
}

function renderCursor({
  cursor,
  index,
  indicator,
  ready,
  buildBusy,
  testBusy,
  error
}: SubState & {
  indicator: string;
  cursor: number;
  index: number;
}): string {
  if (cursor !== index) {
    return " ";
  }
  if (error) {
    return chalk.red(indicator);
  }
  if (!ready) {
    return chalk.dim(indicator);
  }
  if (buildBusy || testBusy) {
    return chalk.yellow(indicator);
  }
  return chalk.green(indicator);
}

function renderIndicator({
  indicator,
  ready,
  buildBusy,
  testBusy,
  error,
  selected
}: SubState & { indicator: string }): string {
  if (selected) {
    return chalk.yellow(indicator);
  }
  if (error) {
    return chalk.red(indicator);
  }
  if (!ready) {
    return chalk.dim(indicator);
  }
  if (buildBusy || testBusy) {
    return chalk.yellow(indicator);
  }
  return chalk.green(indicator);
}

function renderStatus({
  error,
  buildBusy,
  testBusy,
  buildQueued,
  testQueued,
  package: pkg
}: SubState): string {
  if (error) {
    return chalk.red(pkg.name);
  }
  if (buildBusy || testBusy) {
    if (buildQueued || testQueued) {
      return `${pkg.name} (queued)`;
    }
    return chalk.dim(pkg.name);
  }
  return pkg.name;
}

function renderLogPath({ error, logPath }: SubState): string {
  const link = terminalLink.isSupported
    ? terminalLink(logPath, `file://${logPath}`)
    : logPath;
  return error ? `(saved to ${link})` : "";
}

function renderError({ error }: SubState): string {
  return error ? error.message.trim() || "" : "";
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
  const separator = renderDivider({ title: `Error: ${pkg.name}`, width });
  const log = headWordWrap(renderError(subState), width, lines - 3);

  return EOL + separator + EOL + chalk.red(log);
}

export function render(props: Props): string {
  const { width, height, cursor, packages } = props;

  const lines = packages
    .map((subState, index) => ({
      cursor: renderCursor({ ...subState, indicator: "❯", cursor, index }),
      indicator: renderIndicator({
        ...subState,
        indicator: subState.selected ? "■" : "●"
      }),
      status: renderStatus(subState),
      logPath: renderLogPath(subState)
    }))
    .map(({ cursor, indicator, status, logPath }) => {
      return `${cursor}${indicator} ${status} ${logPath}`;
    });

  const welcome = renderWelcomeMessages()
  const restLines = height - (welcome.length + lines.length);
  const erroredPackages = packages.filter(({ error }) => !!error);
  const linesPerError = Math.floor(restLines / erroredPackages.length);
  const errorSummaries = erroredPackages.map(subState =>
    renderErrorSummary({ width, lines: linesPerError, ...subState })
  );

  return [...welcome,...lines,...errorSummaries].join(EOL);
}

export const createRenderer = (store: Store<State, Action>) => () => {
  const state = store.getState();

  logUpdate(
    render({
      width: getWidth(state),
      height: getHeight(state),
      cursor: getCursor(state),
      packages: getPackages(state)
    })
  );
};

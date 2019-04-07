import { EOL } from "os";
import wrapANSI from "wrap-ansi";

export function head(str: string, n: number): string {
  return str
    .split(EOL)
    .slice(0, n)
    .join(EOL);
}

export function headWordWrap(str: string, width: number, height: number) {
  return head(wrapANSI(str, width, { hard: true, trim: false }), height);
}

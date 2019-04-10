import assert from "assert";
import { head } from "./ansi";

describe("head", () => {
  it("returns string that specified number of lines", () => {
    const expected = "a\n".repeat(4).trim();
    const actual = head("a\n".repeat(5), 4);
    assert.strictEqual(actual, expected);
  });
});

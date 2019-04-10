import assert from "assert";
import { head, wordWrap } from "./ansi";

describe("head", () => {
  it("returns string that specified number of lines", () => {
    const expected = "a\n".repeat(4).trim();
    const actual = head("a\n".repeat(5), 4);
    assert.strictEqual(actual, expected);
  });
});

describe("wordWrap", () => {
  it("returns string that wrapped at specified width", () => {
    const expected = "a".repeat(5) + "\na";
    const actual = wordWrap("a".repeat(6), 5);
    assert.strictEqual(actual, expected);
  });
});

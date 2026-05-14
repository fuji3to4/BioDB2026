import assert from "node:assert/strict";
import test from "node:test";

import { cn } from "./utils.ts";

test("cn merges class names and ignores falsy values", () => {
  assert.equal(
    cn("rounded", undefined, "border", false && "hidden", "rounded"),
    "border rounded",
  );
});

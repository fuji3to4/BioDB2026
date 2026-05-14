import assert from "node:assert/strict";
import test from "node:test";

import {
  EXAMPLE_SEARCH_PATH,
  EXAMPLE_PROTEINS_PATH,
  getExamplePdbDetailPath,
} from "./routes.ts";

test("example route helpers expose the moved search and proteins paths", () => {
  assert.equal(EXAMPLE_SEARCH_PATH, "/example");
  assert.equal(EXAMPLE_PROTEINS_PATH, "/example/proteins");
});

test("getExamplePdbDetailPath nests pdb detail routes under /example", () => {
  assert.equal(getExamplePdbDetailPath("1GUU"), "/example/pdb/1GUU");
});
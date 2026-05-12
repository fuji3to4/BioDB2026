import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeSearchFilters,
  parseResolutionInput,
} from "./search-filters.ts";

test("normalizeSearchFilters falls back to wildcard-friendly empty strings", () => {
  assert.deepEqual(normalizeSearchFilters({}), {
    id: "",
    name: "",
    className: "",
    organism: "",
    resolution: null,
  });
});

test("normalizeSearchFilters trims text fields and keeps className stable", () => {
  assert.deepEqual(
    normalizeSearchFilters({
      id: " 1abc ",
      name: " kinase ",
      class: " Enzyme ",
      org: " human ",
      res: " 2.5 ",
    }),
    {
      id: "1abc",
      name: "kinase",
      className: "Enzyme",
      organism: "human",
      resolution: 2.5,
    }
  );
});

test("parseResolutionInput rejects invalid numeric values", () => {
  assert.throws(() => parseResolutionInput("-1"), /Resolution must be a positive number/);
  assert.throws(() => parseResolutionInput("abc"), /Resolution must be a positive number/);
});

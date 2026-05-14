import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSearchFilters } from "./search-filters.ts";

test("normalizeSearchFilters trims text filters including method", () => {
  assert.deepEqual(
    normalizeSearchFilters({
      id: " 1abc ",
      method: " X-RAY DIFFRACTION ",
      name: " Hemoglobin ",
      class: " Enzyme ",
      org: " Human ",
      res: " 2.4 ",
    }),
    {
      id: "1abc",
      method: "X-RAY DIFFRACTION",
      name: "Hemoglobin",
      className: "Enzyme",
      organism: "Human",
      resolution: 2.4,
    },
  );
});

test("normalizeSearchFilters keeps blank method empty", () => {
  assert.equal(
    normalizeSearchFilters({ id: "", method: "   ", name: "", class: "", org: "", res: "" }).method,
    "",
  );
});

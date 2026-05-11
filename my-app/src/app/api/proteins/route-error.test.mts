import assert from "node:assert/strict";
import test from "node:test";

import { buildProteinsErrorResponse } from "./route-error.ts";

const DEMO_NOT_READY_MESSAGE =
  "Protein data is unavailable because demo.sql has not been loaded yet. Load SQL/demo.sql and retry /api/proteins.";

const INTERNAL_ERROR_MESSAGE =
  "Failed to query proteins due to an internal server error.";

test("returns demo.sql guidance when the demo database is missing", () => {
  const response = buildProteinsErrorResponse({
    code: "3D000",
    message: 'database "demo" does not exist',
  });

  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    error: DEMO_NOT_READY_MESSAGE,
  });
});

test("returns demo.sql guidance when the Protein table is missing", () => {
  const response = buildProteinsErrorResponse({
    code: "42P01",
    message: 'relation "protein" does not exist',
  });

  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    error: DEMO_NOT_READY_MESSAGE,
  });
});

test("returns a generic safe error for unexpected query failures", () => {
  const response = buildProteinsErrorResponse(new Error("socket hang up"));

  assert.equal(response.status, 500);
  assert.deepEqual(response.body, {
    error: INTERNAL_ERROR_MESSAGE,
  });
});

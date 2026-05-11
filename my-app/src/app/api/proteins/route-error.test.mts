import assert from "node:assert/strict";
import test from "node:test";

import { buildProteinsErrorResponse } from "./route-error.ts";

test("returns demo.sql guidance when the demo database is missing", () => {
  const response = buildProteinsErrorResponse({
    code: "3D000",
    message: 'database "demo" does not exist',
  });

  assert.equal(response.status, 503);
  assert.match(response.body.error, /demo\.sql/i);
  assert.match(response.body.details ?? "", /does not exist/i);
});

test("returns demo.sql guidance when the Protein table is missing", () => {
  const response = buildProteinsErrorResponse({
    code: "42P01",
    message: 'relation "protein" does not exist',
  });

  assert.equal(response.status, 503);
  assert.match(response.body.error, /demo\.sql/i);
  assert.match(response.body.details ?? "", /relation/i);
});

test("returns a generic error for unexpected query failures", () => {
  const response = buildProteinsErrorResponse(new Error("socket hang up"));

  assert.equal(response.status, 500);
  assert.equal(response.body.error, "Failed to query proteins.");
  assert.equal(response.body.details, "socket hang up");
});

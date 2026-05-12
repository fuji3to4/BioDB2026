import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCreateProteinQuery,
  buildDeleteProteinQuery,
  buildIncrementFavQuery,
  buildProteinListQuery,
} from "./proteins.ts";

test("buildProteinListQuery selects protein rows in id order", () => {
  assert.match(buildProteinListQuery().text, /select \* from protein/i);
});

test("buildCreateProteinQuery inserts name organism len and default fav", () => {
  const query = buildCreateProteinQuery({
    name: "Myoglobin",
    organism: "Human",
    length: 154,
  });

  assert.match(query.text, /insert into protein\(name, organism, len, fav\)/i);
  assert.deepEqual(query.values, ["Myoglobin", "Human", 154]);
});

test("buildIncrementFavQuery and buildDeleteProteinQuery target proteinid", () => {
  assert.deepEqual(buildIncrementFavQuery(7).values, [7]);
  assert.deepEqual(buildDeleteProteinQuery(7).values, [7]);
});

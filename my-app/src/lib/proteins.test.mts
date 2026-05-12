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

test("buildIncrementFavQuery targets proteinid", () => {
  assert.match(
    buildIncrementFavQuery(7).text,
    /update protein set fav = fav \+ 1 where proteinid = \$1/i,
  );
  assert.deepEqual(buildIncrementFavQuery(7).values, [7]);
});

test("buildDeleteProteinQuery targets proteinid", () => {
  assert.match(buildDeleteProteinQuery(7).text, /delete from protein where proteinid = \$1/i);
  assert.deepEqual(buildDeleteProteinQuery(7).values, [7]);
});

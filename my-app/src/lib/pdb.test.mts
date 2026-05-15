import assert from "node:assert/strict";
import test, { afterEach, mock } from "node:test";
import type { SQL } from "drizzle-orm";

import { db } from "./db.ts";
import { fetchPdbDetail, fetchPdbSearchResults, formatResolutionAngstrom } from "./pdb.ts";

function render(statement: SQL) {
  return statement.toQuery({
    casing: {} as never,
    escapeName: (value) => `"${value}"`,
    escapeParam: (index) => `$${index + 1}`,
    escapeString: (value) => `'${value.replaceAll("'", "''")}'`,
  });
}

afterEach(() => {
  mock.restoreAll();
});

test("fetchPdbSearchResults sends method and optional resolution through raw drizzle sql", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await fetchPdbSearchResults({
    id: "1abc",
    method: "X-RAY",
    name: "",
    className: "Enzyme",
    organism: "",
    resolution: 2.2,
  });

  assert.equal(execute.mock.calls.length, 1);

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(rendered.sql, /pdb\.pdbid like '%' \|\| \$1 \|\| '%'/i);
  assert.match(rendered.sql, /pdb\.method like '%' \|\| \$2 \|\| '%'/i);
  assert.match(rendered.sql, /pdb\.resolution <= \$6/i);
  assert.deepEqual(rendered.params, ["1abc", "X-RAY", "", "Enzyme", "", 2.2]);
});

test("fetchPdbDetail uses exact-match pdbid lookup and returns the first row", async () => {
  const execute = mock.method(db, "execute", async () => ({
    rows: [{ pdbid: "1GUU", method: "X-RAY" }],
  }));

  const detail = await fetchPdbDetail("1GUU");

  assert.deepEqual(detail, { pdbid: "1GUU", method: "X-RAY" });

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(rendered.sql, /where \(pdb\.pdbid = \$1\)/i);
  assert.doesNotMatch(rendered.sql, /like '%' \|\|/i);
  assert.deepEqual(rendered.params, ["1GUU"]);
});

test("formatResolutionAngstrom formats correctly", () => {
  assert.equal(formatResolutionAngstrom(2.3456), "2.35 Å");
});

test("formatResolutionAngstrom handles null and undefined", () => {
  assert.equal(formatResolutionAngstrom(null), "");
  assert.equal(formatResolutionAngstrom(undefined), "");
});

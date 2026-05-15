import assert from "node:assert/strict";
import test, { afterEach, mock } from "node:test";
import type { SQL } from "drizzle-orm";

import { hasExternalPdbUrl } from "./external-pdb-url.ts";
import { db } from "./db.ts";
import {
  fetchPdbDetail,
  fetchPdbSearchResults,
  formatResolutionAngstrom,
} from "./pdb.ts";

function render(statement: SQL) {
  // toQuery is an internal Drizzle helper, but it keeps these SQL-shape assertions simple.
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

test("fetchPdbSearchResults omits the resolution clause when resolution is null", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await fetchPdbSearchResults({
    id: "",
    method: "NMR",
    name: "",
    className: "",
    organism: "",
    resolution: null,
  });

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.doesNotMatch(rendered.sql, /resolution <=/i);
  assert.deepEqual(rendered.params, ["", "NMR", "", "", ""]);
});

test("fetchPdbDetail uses exact-match pdbid lookup and returns the first row", async () => {
  const execute = mock.method(db, "execute", async () => ({
    rows: [{ pdbid: "1GUU", method: "X-RAY" }],
  }));

  const detail = await fetchPdbDetail("1GUU");

  assert.deepEqual(detail, {
    pdbid: "1GUU",
    method: "X-RAY",
    chain: "",
    positions: "",
    deposited: "",
    url: "",
    len: "",
  });

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(rendered.sql, /where \(pdb\.pdbid = \$1\)/i);
  assert.doesNotMatch(rendered.sql, /like '%' \|\|/i);
  assert.deepEqual(rendered.params, ["1GUU"]);
});

test("fetchPdbDetail normalizes nullable display fields to empty strings", async () => {
  mock.method(db, "execute", async () => ({
    rows: [
      {
        pdbid: "1GUU",
        method: "X-RAY",
        resolution: null,
        chain: null,
        positions: null,
        deposited: null,
        class: "Enzyme",
        url: null,
        name: "Hemoglobin",
        organism: "Human",
        len: null,
      },
    ],
  }));

  const detail = await fetchPdbDetail("1GUU");

  assert.deepEqual(detail, {
    pdbid: "1GUU",
    method: "X-RAY",
    resolution: null,
    chain: "",
    positions: "",
    deposited: "",
    class: "Enzyme",
    url: "",
    name: "Hemoglobin",
    organism: "Human",
    len: "",
  });
});

test("formatResolutionAngstrom formats correctly", () => {
  assert.equal(formatResolutionAngstrom(2.3456), "2.35 Å");
});

test("formatResolutionAngstrom handles null and undefined", () => {
  assert.equal(formatResolutionAngstrom(null), "");
  assert.equal(formatResolutionAngstrom(undefined), "");
});

test("hasExternalPdbUrl rejects blank urls", () => {
  assert.equal(hasExternalPdbUrl(""), false);
  assert.equal(hasExternalPdbUrl("   "), false);
  assert.equal(hasExternalPdbUrl("https://example.invalid/1abc"), true);
});

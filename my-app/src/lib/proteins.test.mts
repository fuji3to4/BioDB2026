import assert from "node:assert/strict";
import test, { afterEach, mock } from "node:test";
import type { SQL } from "drizzle-orm";

import { db } from "./db.ts";
import { createProtein, deleteProtein, fetchProteins, incrementProteinFav } from "./proteins.ts";

function render(statement: SQL) {
  return statement.toQuery({
    casing: {} as never,
    escapeName: (value) => `"${value}"`,
    escapeParam: (index) => `$${index + 1}`,
    escapeString: (value) => `'${value.replaceAll("'", "''")}'`,
  });
}

function normalizeSql(sqlText: string) {
  return sqlText.replaceAll(/\s+/g, " ").trim();
}

afterEach(() => {
  mock.restoreAll();
});

test("fetchProteins selects rows in id order with no params", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await fetchProteins();

  assert.equal(execute.mock.calls.length, 1);

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(normalizeSql(rendered.sql), /select proteinid, name, organism, len, fav from protein order by proteinid/i);
  assert.deepEqual(rendered.params, []);
});

test("createProtein inserts name organism len with default fav", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await createProtein({
    name: "Myoglobin",
    organism: "Human",
    length: 154,
  });

  assert.equal(execute.mock.calls.length, 1);

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(normalizeSql(rendered.sql), /insert into protein\(name, organism, len, fav\) values \(\$1, \$2, \$3, 0\)/i);
  assert.deepEqual(rendered.params, ["Myoglobin", "Human", 154]);
});

test("incrementProteinFav targets proteinid = $1", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await incrementProteinFav(7);

  assert.equal(execute.mock.calls.length, 1);

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(normalizeSql(rendered.sql), /update protein set fav = fav \+ 1 where proteinid = \$1/i);
  assert.deepEqual(rendered.params, [7]);
});

test("deleteProtein targets proteinid = $1", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await deleteProtein(7);

  assert.equal(execute.mock.calls.length, 1);

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(normalizeSql(rendered.sql), /delete from protein where proteinid = \$1/i);
  assert.deepEqual(rendered.params, [7]);
});

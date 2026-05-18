import assert from "node:assert/strict";
import test, { mock } from "node:test";

const globalForDb = globalThis as typeof globalThis & {
  biodbDb?: unknown;
};

test("db module can be imported before DATABASE_URL is set", async () => {
  const original = process.env.DATABASE_URL;
  const originalDb = globalForDb.biodbDb;
  delete process.env.DATABASE_URL;
  delete globalForDb.biodbDb;

  try {
    const { db } = await import(`./db.ts?case=${Date.now()}`);
    assert.equal(typeof db.execute, "function");
    assert.throws(() => db.execute(), {
      message: "DATABASE_URL is not set",
    });
  } finally {
    if (original === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = original;
    if (originalDb === undefined) delete globalForDb.biodbDb;
    else globalForDb.biodbDb = originalDb;
  }
});

test("db module only exposes execute for app code", async () => {
  const originalDb = globalForDb.biodbDb;
  delete globalForDb.biodbDb;

  const fakeDb = {
    execute: async () => ({ rows: [] }),
    answer: 42,
  };

  try {
    globalForDb.biodbDb = fakeDb as unknown;
    const { db } = await import(`./db.ts?case=${Date.now()}`);
    assert.equal(typeof db.execute, "function");
    assert.equal((db as { answer?: unknown }).answer, undefined);
  } finally {
    if (originalDb === undefined) delete globalForDb.biodbDb;
    else globalForDb.biodbDb = originalDb;
  }
});

test("db execute honors mock.method overrides", async () => {
  const original = process.env.DATABASE_URL;
  const originalDb = globalForDb.biodbDb;
  delete process.env.DATABASE_URL;
  delete globalForDb.biodbDb;

  const sentinel = { rows: [{ ok: true }] };

  try {
    const { db } = await import(`./db.ts?case=${Date.now()}`);
    const execute = mock.method(
      db,
      "execute",
      async (...args: unknown[]) => {
        assert.deepEqual(args, ["select 1"]);
        return sentinel;
      },
    );

    const result = await db.execute("select 1" as never);

    assert.equal(result, sentinel);
    assert.equal(execute.mock.calls.length, 1);
  } finally {
    if (original === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = original;
    if (originalDb === undefined) delete globalForDb.biodbDb;
    else globalForDb.biodbDb = originalDb;
  }
});

test("db module does not expose the legacy pool export", async () => {
  const mod = await import(`./db.ts?case=${Date.now()}`);
  assert.equal("pool" in mod, false);
});

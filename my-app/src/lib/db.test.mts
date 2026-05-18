import assert from "node:assert/strict";
import test, { mock } from "node:test";

const globalForDb = globalThis as typeof globalThis & {
  biodbDb?: unknown;
  biodbPool?: unknown;
};

test("db module can be imported before DATABASE_URL is set", async () => {
  const original = process.env.DATABASE_URL;
  const originalDb = globalForDb.biodbDb;
  const originalPool = globalForDb.biodbPool;
  delete process.env.DATABASE_URL;
  delete globalForDb.biodbDb;
  delete globalForDb.biodbPool;

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
    if (originalPool === undefined) delete globalForDb.biodbPool;
    else globalForDb.biodbPool = originalPool;
  }
});

test("db proxy getters use the instance receiver", async () => {
  const originalDb = globalForDb.biodbDb;
  const originalPool = globalForDb.biodbPool;
  delete globalForDb.biodbDb;
  delete globalForDb.biodbPool;

  const fakeDb = {
    value: 42,
    get answer() {
      assert.equal(this, fakeDb);
      return this.value;
    },
  };

  try {
    globalForDb.biodbDb = fakeDb;
    const { db } = await import(`./db.ts?case=${Date.now()}`);
    assert.equal(db.answer, 42);
  } finally {
    if (originalDb === undefined) delete globalForDb.biodbDb;
    else globalForDb.biodbDb = originalDb;
    if (originalPool === undefined) delete globalForDb.biodbPool;
    else globalForDb.biodbPool = originalPool;
  }
});

test("db execute honors proxy target overrides from mock.method", async () => {
  const original = process.env.DATABASE_URL;
  const originalDb = globalForDb.biodbDb;
  const originalPool = globalForDb.biodbPool;
  delete process.env.DATABASE_URL;
  delete globalForDb.biodbDb;
  delete globalForDb.biodbPool;

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
    if (originalPool === undefined) delete globalForDb.biodbPool;
    else globalForDb.biodbPool = originalPool;
  }
});

test("db module does not expose the legacy pool export", async () => {
  const mod = await import(`./db.ts?case=${Date.now()}`);
  assert.equal("pool" in mod, false);
});

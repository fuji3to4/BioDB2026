import assert from "node:assert/strict";
import test from "node:test";

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

import assert from "node:assert/strict";
import test from "node:test";

test("db module can be imported before DATABASE_URL is set", async () => {
  const original = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const { db } = await import(`./db.ts?case=${Date.now()}`);
    assert.equal(typeof db.execute, "function");
    assert.throws(() => db.execute(), {
      message: "DATABASE_URL is not set",
    });
  } finally {
    if (original === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = original;
  }
});

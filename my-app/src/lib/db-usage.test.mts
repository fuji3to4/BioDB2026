import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const targetFiles = [
  resolve(srcDir, "lib", "pdb.ts"),
  resolve(srcDir, "lib", "proteins.ts"),
  resolve(srcDir, "app", "search-pdb-simple", "page.tsx"),
];

const forbiddenSnippets = ["new Pool(", "pool.query(", 'from "pg"'];
const requiredSnippet = "db.execute(sql`";

test("database access uses shared drizzle db", async () => {
  await Promise.all(
    targetFiles.map(async (filePath) => {
      const content = await readFile(filePath, "utf8");
      for (const snippet of forbiddenSnippets) {
        assert.ok(
          !content.includes(snippet),
          `${filePath} should not include ${snippet}`
        );
      }
      assert.ok(
        content.includes(requiredSnippet),
        `${filePath} should include ${requiredSnippet}`
      );
    })
  );
});

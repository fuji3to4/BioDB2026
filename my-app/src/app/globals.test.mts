import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("globals.css wires Tailwind so utility-based UI components can style", () => {
  const css = readFileSync(resolve("src", "app", "globals.css"), "utf8");

  assert.match(css, /@import\s+"tailwindcss";/);
});

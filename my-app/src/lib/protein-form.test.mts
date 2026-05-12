import assert from "node:assert/strict";
import test from "node:test";

import { validateProteinInput } from "./protein-form.ts";

test("validateProteinInput returns trimmed payload for valid input", () => {
  const formData = new FormData();
  formData.set("name", "  Myoglobin ");
  formData.set("org", " Human ");
  formData.set("len", " 154 ");

  assert.deepEqual(validateProteinInput(formData), {
    name: "Myoglobin",
    organism: "Human",
    length: 154,
  });
});

test("validateProteinInput rejects blank values", () => {
  const formData = new FormData();
  formData.set("name", "");
  formData.set("org", "Human");
  formData.set("len", "154");

  assert.throws(() => validateProteinInput(formData), /Protein name is required/);
});

test("validateProteinInput rejects non-positive length", () => {
  const formData = new FormData();
  formData.set("name", "Myoglobin");
  formData.set("org", "Human");
  formData.set("len", "0");

  assert.throws(() => validateProteinInput(formData), /Length must be a positive integer/);
});

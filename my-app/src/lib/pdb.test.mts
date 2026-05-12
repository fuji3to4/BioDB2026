import assert from "node:assert/strict";
import test from "node:test";

import { buildPdbSearchQuery, buildPdbDetailQuery } from "./pdb.ts";

test("buildPdbSearchQuery adds a resolution predicate only when provided", () => {
  const withResolution = buildPdbSearchQuery({
    id: "1abc",
    name: "",
    className: "Enzyme",
    organism: "",
    resolution: 2.2,
  });

  assert.match(withResolution.text, /pdb\.resolution <= \$5/);
  assert.deepEqual(withResolution.values, ["%1abc%", "%%", "%Enzyme%", "%%", 2.2]);

  const withoutResolution = buildPdbSearchQuery({
    id: "",
    name: "",
    className: "",
    organism: "",
    resolution: null,
  });

  assert.doesNotMatch(withoutResolution.text, /resolution <=/);
  assert.deepEqual(withoutResolution.values, ["%%", "%%", "%%", "%%"]);
});

test("buildPdbDetailQuery filters by pdbid", () => {
  const detail = buildPdbDetailQuery("1GUU");
  assert.match(detail.text, /where \(pdb\.pdbid = \$1\)/i);
  assert.deepEqual(detail.values, ["1GUU"]);
});

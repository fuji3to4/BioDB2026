import assert from "node:assert/strict";
import test from "node:test";

import { buildPdbSearchQuery, buildPdbDetailQuery, formatResolutionAngstrom} from "./pdb.ts";

test("buildPdbSearchQuery filters by method before applying resolution", () => {
  const query = buildPdbSearchQuery({
    id: "1abc",
    method: "X-RAY",
    name: "",
    className: "Enzyme",
    organism: "",
    resolution: 2.2,
  });

  assert.match(query.text, /pdb\.method like \$2/);
  assert.match(query.text, /pdb\.resolution <= \$6/);
  assert.deepEqual(query.values, ["%1abc%", "%X-RAY%", "%%", "%Enzyme%", "%%", 2.2]);
});

test("buildPdbSearchQuery keeps method in the values list when resolution is empty", () => {
  const query = buildPdbSearchQuery({
    id: "",
    method: "NMR",
    name: "",
    className: "",
    organism: "",
    resolution: null,
  });

  assert.doesNotMatch(query.text, /resolution <=/);
  assert.deepEqual(query.values, ["%%", "%NMR%", "%%", "%%", "%%"]);
});

test("buildPdbDetailQuery uses exact-match pdbid lookup", () => {
  const detail = buildPdbDetailQuery("1GUU");
  assert.match(detail.text, /where \(pdb\.pdbid = \$1\)/i);
  assert.doesNotMatch(detail.text, /like/i);
  assert.deepEqual(detail.values, ["1GUU"]);
});

test("formatResolutionAngstrom formats correctly", () => {
  assert.equal(formatResolutionAngstrom(2.3456), "2.35 Å");
});

test("formatResolutionAngstrom handles null and undefined", () => {
  assert.equal(formatResolutionAngstrom(null), "");
  assert.equal(formatResolutionAngstrom(undefined), "");
});

import assert from "node:assert/strict";
import test from "node:test";

import { buildPdbSearchQuery, buildPdbDetailQuery, formatResolutionAngstrom} from "./pdb.ts";

test("buildPdbSearchQuery adds method and resolution predicates when provided", () => {
  const withResolution = buildPdbSearchQuery({
    id: "1abc",
    method: "X-ray",
    name: "",
    className: "Enzyme",
    organism: "",
    resolution: 2.2,
  });

  assert.match(withResolution.text, /pdb\.method like \$5/);
  assert.match(withResolution.text, /pdb\.resolution <= \$6/);
  assert.deepEqual(withResolution.values, ["%1abc%", "%%", "%Enzyme%", "%%", "%X-ray%", 2.2]);

  const withoutResolution = buildPdbSearchQuery({
    id: "",
    method: "",
    name: "",
    className: "",
    organism: "",
    resolution: null,
  });

  assert.doesNotMatch(withoutResolution.text, /resolution <=/);
  assert.deepEqual(withoutResolution.values, ["%%", "%%", "%%", "%%", "%%"]);
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

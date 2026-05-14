import assert from "node:assert/strict";
import test from "node:test";

import {
  EMPTY_FILTERS,
  createInitialSpaState,
  clearDetailSelection,
  finishDetailError,
  finishDetailSuccess,
  finishSearchSuccess,
  finishSearchError,
  startDetailLoad,
  startSearch,
} from "./client-state.ts";

test("startSearch stores next filters and clears stale search errors", () => {
  const state = createInitialSpaState();
  const nextFilters = { ...EMPTY_FILTERS, id: "1abc", method: "NMR" };

  const nextState = startSearch(
    {
      ...state,
      searchError: "stale error",
    },
    nextFilters,
  );

  assert.equal(nextState.isSearching, true);
  assert.equal(nextState.searchError, null);
  assert.deepEqual(nextState.filters, nextFilters);
});

test("finishSearchSuccess resets selected detail state when rows change", () => {
  const state = {
    ...createInitialSpaState(),
    selectedPdbId: "1abc",
    selectedDetail: {
      pdbid: "1abc",
      method: "X-RAY DIFFRACTION",
      resolution: 2.2,
      class: "Enzyme",
      name: "Hemoglobin",
      organism: "Human",
      chain: "A",
      positions: "1-100",
      deposited: "2024-01-01",
      url: "https://example.invalid/1abc",
      len: 100,
    },
  };

  const nextState = finishSearchSuccess(state, [
    {
      pdbid: "2xyz",
      method: "NMR",
      resolution: null,
      class: "Transport",
      name: "Example Protein",
      organism: "Mouse",
    },
  ]);

  assert.equal(nextState.isSearching, false);
  assert.deepEqual(nextState.results, [
    {
      pdbid: "2xyz",
      method: "NMR",
      resolution: null,
      class: "Transport",
      name: "Example Protein",
      organism: "Mouse",
    },
  ]);
  assert.equal(nextState.selectedPdbId, null);
  assert.equal(nextState.selectedDetail, null);
  assert.equal(nextState.detailError, null);
});

test("startDetailLoad marks the selected pdb as loading", () => {
  const nextState = startDetailLoad(createInitialSpaState(), "1abc");

  assert.equal(nextState.selectedPdbId, "1abc");
  assert.equal(nextState.isDetailLoading, true);
  assert.equal(nextState.detailError, null);
});

test("finishDetailSuccess stores the selected detail", () => {
  const detail = {
    pdbid: "1abc",
    method: "X-RAY DIFFRACTION",
    resolution: 2.2,
    class: "Enzyme",
    name: "Hemoglobin",
    organism: "Human",
    chain: "A",
    positions: "1-100",
    deposited: "2024-01-01",
    url: "https://example.invalid/1abc",
    len: 100,
  };

  const nextState = finishDetailSuccess(startDetailLoad(createInitialSpaState(), "1abc"), detail);

  assert.equal(nextState.isDetailLoading, false);
  assert.deepEqual(nextState.selectedDetail, detail);
  assert.equal(nextState.detailError, null);
});

test("finishDetailError clears selected detail and records the error", () => {
  const nextState = finishDetailError(
    startDetailLoad(createInitialSpaState(), "1abc"),
    "PDB entry not found",
  );

  assert.equal(nextState.isDetailLoading, false);
  assert.equal(nextState.selectedDetail, null);
  assert.equal(nextState.detailError, "PDB entry not found");
});

test("clearDetailSelection closes the detail popover state", () => {
  const state = {
    ...createInitialSpaState(),
    selectedPdbId: "1abc",
    selectedDetail: {
      pdbid: "1abc",
      method: "X-RAY DIFFRACTION",
      resolution: 2.2,
      class: "Enzyme",
      name: "Hemoglobin",
      organism: "Human",
      chain: "A",
      positions: "1-100",
      deposited: "2024-01-01",
      url: "https://example.invalid/1abc",
      len: 100,
    },
    isDetailLoading: true,
    detailError: "stale error",
  };

  const nextState = clearDetailSelection(state);

  assert.equal(nextState.selectedPdbId, null);
  assert.equal(nextState.selectedDetail, null);
  assert.equal(nextState.isDetailLoading, false);
  assert.equal(nextState.detailError, null);
});

test("finishSearchError clears searching and stores message", () => {
  const state = {
    ...createInitialSpaState(),
    isSearching: true,
    searchError: null,
    results: [
      {
        pdbid: "1abc",
        method: "X-RAY DIFFRACTION",
        resolution: 1.5,
        class: "Enzyme",
        name: "Hemo",
        organism: "Human",
      },
    ],
    selectedPdbId: "1abc",
    selectedDetail: {
      pdbid: "1abc",
      method: "X-RAY DIFFRACTION",
      resolution: 1.5,
      class: "Enzyme",
      name: "Hemo",
      organism: "Human",
      chain: "A",
      positions: "1-100",
      deposited: "2024-01-01",
      url: "https://example.invalid/1abc",
      len: 100,
    },
    isDetailLoading: false,
    detailError: "old detail error",
  };

  const nextState = finishSearchError(state, "network failure");

  assert.equal(nextState.isSearching, false);
  assert.equal(nextState.searchError, "network failure");
  // preserve unrelated fields
  assert.deepEqual(nextState.results, state.results);
  assert.equal(nextState.selectedPdbId, state.selectedPdbId);
  assert.deepEqual(nextState.selectedDetail, state.selectedDetail);
  assert.equal(nextState.isDetailLoading, state.isDetailLoading);
  assert.equal(nextState.detailError, state.detailError);
});

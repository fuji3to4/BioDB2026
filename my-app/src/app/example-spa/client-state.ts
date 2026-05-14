import type {
  ExampleSpaState,
  SpaPdbDetail,
  SpaSearchForm,
  SpaSearchRow,
} from "./types.ts";

export const EMPTY_FILTERS: SpaSearchForm = {
  id: "",
  method: "",
  name: "",
  class: "",
  org: "",
  res: "",
};

export function createInitialSpaState(): ExampleSpaState {
  return {
    filters: { ...EMPTY_FILTERS },
    results: [],
    selectedPdbId: null,
    selectedDetail: null,
    isSearching: false,
    isDetailLoading: false,
    searchError: null,
    detailError: null,
  };
}

export function startSearch(state: ExampleSpaState, nextFilters: SpaSearchForm): ExampleSpaState {
  return {
    ...state,
    filters: { ...nextFilters },
    isSearching: true,
    searchError: null,
  };
}

export function finishSearchSuccess(
  state: ExampleSpaState,
  rows: SpaSearchRow[],
): ExampleSpaState {
  return {
    ...state,
    results: [...rows],
    isSearching: false,
    searchError: null,
    selectedPdbId: null,
    selectedDetail: null,
    isDetailLoading: false,
    detailError: null,
  };
}

export function finishSearchError(state: ExampleSpaState, message: string): ExampleSpaState {
  return {
    ...state,
    isSearching: false,
    searchError: message,
  };
}

export function startDetailLoad(state: ExampleSpaState, pdbid: string): ExampleSpaState {
  return {
    ...state,
    selectedPdbId: pdbid,
    selectedDetail: null,
    isDetailLoading: true,
    detailError: null,
  };
}

export function finishDetailSuccess(
  state: ExampleSpaState,
  detail: SpaPdbDetail,
): ExampleSpaState {
  return {
    ...state,
    selectedPdbId: detail.pdbid,
    selectedDetail: detail,
    isDetailLoading: false,
    detailError: null,
  };
}

export function finishDetailError(state: ExampleSpaState, message: string): ExampleSpaState {
  return {
    ...state,
    selectedDetail: null,
    isDetailLoading: false,
    detailError: message,
  };
}

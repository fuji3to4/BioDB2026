export type SpaSearchForm = {
  id: string;
  method: string;
  name: string;
  class: string;
  org: string;
  res: string;
};

export type SpaSearchRow = {
  pdbid: string;
  method: string;
  resolution: number | string | null;
  class: string;
  name: string;
  organism: string;
};

export type SpaPdbDetail = {
  pdbid: string;
  method: string;
  resolution: number | string | null;
  chain: string;
  positions: string;
  deposited: string;
  class: string;
  url: string;
  name: string;
  organism: string;
  len: number | string;
};

export type ExampleSpaState = {
  filters: SpaSearchForm;
  results: SpaSearchRow[];
  selectedPdbId: string | null;
  selectedDetail: SpaPdbDetail | null;
  isSearching: boolean;
  isDetailLoading: boolean;
  searchError: string | null;
  detailError: string | null;
};

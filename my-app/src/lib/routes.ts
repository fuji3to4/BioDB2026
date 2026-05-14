export const EXAMPLE_SEARCH_PATH = "/example";
export const EXAMPLE_PROTEINS_PATH = "/example/proteins";

export function getExamplePdbDetailPath(pdbid: string) {
  return `${EXAMPLE_SEARCH_PATH}/pdb/${pdbid}`;
}
export type SearchFilters = {
  id: string;
  name: string;
  className: string;
  organism: string;
  resolution: number | null;
};

type RawFilters = {
  id?: string;
  name?: string;
  class?: string;
  org?: string;
  res?: string;
};

export function parseResolutionInput(value: string | undefined): number | null {
  if (!value || value.trim() === "") {
    return null;
  }

  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Resolution must be a positive number");
  }

  return parsed;
}

export function normalizeSearchFilters(raw: RawFilters): SearchFilters {
  return {
    id: raw.id?.trim() ?? "",
    name: raw.name?.trim() ?? "",
    className: raw.class?.trim() ?? "",
    organism: raw.org?.trim() ?? "",
    resolution: parseResolutionInput(raw.res),
  };
}

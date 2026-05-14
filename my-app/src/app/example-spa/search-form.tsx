"use client";

import { Input } from "@/components/ui/input.tsx";

import type { SpaSearchForm } from "./types.ts";

type SearchFormProps = {
  filters: SpaSearchForm;
  onChange: (nextFilters: SpaSearchForm) => void;
};

function updateFilter<K extends keyof SpaSearchForm>(
  filters: SpaSearchForm,
  onChange: (nextFilters: SpaSearchForm) => void,
  key: K,
  value: string,
) {
  onChange({ ...filters, [key]: value });
}

export function SearchForm({ filters, onChange }: SearchFormProps) {
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
      <label className="grid gap-2">
        <span className="text-sm font-medium">PDB ID</span>
        <Input
          value={filters.id}
          onChange={(event) => updateFilter(filters, onChange, "id", event.target.value)}
          placeholder="1abc"
          aria-label="PDB ID"
          autoComplete="off"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Method</span>
        <Input
          value={filters.method}
          onChange={(event) => updateFilter(filters, onChange, "method", event.target.value)}
          placeholder="X-RAY DIFFRACTION"
          aria-label="Method"
          autoComplete="off"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Protein name</span>
        <Input
          value={filters.name}
          onChange={(event) => updateFilter(filters, onChange, "name", event.target.value)}
          placeholder="Hemoglobin"
          aria-label="Protein name"
          autoComplete="off"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Class</span>
        <Input
          value={filters.class}
          onChange={(event) => updateFilter(filters, onChange, "class", event.target.value)}
          placeholder="Enzyme"
          aria-label="Class"
          autoComplete="off"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Organism</span>
        <Input
          value={filters.org}
          onChange={(event) => updateFilter(filters, onChange, "org", event.target.value)}
          placeholder="Human"
          aria-label="Organism"
          autoComplete="off"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Resolution</span>
        <Input
          value={filters.res}
          onChange={(event) => updateFilter(filters, onChange, "res", event.target.value)}
          placeholder="2.5"
          aria-label="Resolution"
          autoComplete="off"
        />
      </label>
    </form>
  );
}

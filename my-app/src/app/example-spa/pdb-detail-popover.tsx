"use client";

import Image from "next/image";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

import type { ExampleSpaState, SpaPdbDetail } from "./types.ts";

function formatResolutionAngstrom(resolution: number | string | null | undefined) {
  if (resolution === null || resolution === undefined) return "—";
  const value = Number(resolution);
  return Number.isFinite(value) ? `${value.toFixed(2)} Å` : "—";
}

type PdbDetailPopoverProps = {
  pdbid: string;
  state: ExampleSpaState;
  onOpenDetail: (pdbid: string) => void;
  onCloseDetail: () => void;
};

export function PdbDetailPopover({
  pdbid,
  state,
  onOpenDetail,
  onCloseDetail,
}: PdbDetailPopoverProps) {
  const isOpen = state.selectedPdbId === pdbid;
  const detail = isOpen ? state.selectedDetail : null;
  const isLoading = isOpen && state.isDetailLoading;
  const error = isOpen ? state.detailError : null;

  return (
    <Popover
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          onOpenDetail(pdbid);
          return;
        }

        onCloseDetail();
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="font-medium text-blue-600 underline-offset-4 hover:underline"
        >
          {pdbid}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[min(90vw,48rem)]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">PDB entry</p>
            <h3 className="text-lg font-semibold">{pdbid}</h3>
          </div>

          {isLoading ? <DetailSkeleton /> : null}

          {error ? (
            <Alert>
              <AlertTitle>Detail failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {detail ? <DetailContent detail={detail} /> : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      <Skeleton className="h-56 w-full rounded-md" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

function DetailContent({ detail }: { detail: SpaPdbDetail }) {
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      <div className="overflow-hidden rounded-md border bg-slate-50">
        <Image
          src={`/pic/${detail.pdbid.toLowerCase()}.jpeg`}
          alt={`${detail.pdbid} structure`}
          width={500}
          height={500}
          className="h-auto w-full object-cover"
        />
      </div>

      <dl className="grid gap-2 text-sm">
        <DetailRow label="Method" value={detail.method} />
        <DetailRow label="Resolution" value={formatResolutionAngstrom(detail.resolution)} />
        <DetailRow label="Chain" value={detail.chain} />
        <DetailRow label="Positions" value={detail.positions} />
        <DetailRow label="Deposited" value={detail.deposited} />
        <DetailRow label="Class" value={detail.class} />
        <DetailRow label="Protein name" value={detail.name} />
        <DetailRow label="Organism" value={detail.organism} />
        <DetailRow label="Length" value={`${detail.len} AA`} />
        <div className="pt-2">
          <dt className="font-medium text-slate-500">External PDB link</dt>
          <dd>
            <a href={detail.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Open reference
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

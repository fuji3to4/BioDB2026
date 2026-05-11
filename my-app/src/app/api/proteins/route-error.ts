type ProteinErrorResponse = {
  status: number;
  body: {
    error: string;
    details?: string;
  };
};

type PgErrorLike = {
  code?: string;
  message?: string;
};

const DEMO_NOT_READY_CODES = new Set(["3D000", "42P01"]);
const DEMO_NOT_READY_MESSAGE =
  "Protein data is unavailable because demo.sql has not been loaded yet. Load SQL/demo.sql and retry /api/proteins.";

function isPgErrorLike(error: unknown): error is PgErrorLike {
  return typeof error === "object" && error !== null;
}

export function buildProteinsErrorResponse(error: unknown): ProteinErrorResponse {
  if (isPgErrorLike(error) && DEMO_NOT_READY_CODES.has(error.code ?? "")) {
    return {
      status: 503,
      body: {
        error: DEMO_NOT_READY_MESSAGE,
        details: error.message,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: "Failed to query proteins.",
      details: error instanceof Error ? error.message : "Unknown error",
    },
  };
}

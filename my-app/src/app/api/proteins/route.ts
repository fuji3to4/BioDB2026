import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { buildProteinsErrorResponse } from "./route-error";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT proteinID, name, organism, len, fav FROM Protein ORDER BY proteinID LIMIT 10"
    );

    return NextResponse.json({
      count: result.rows.length,
      proteins: result.rows,
    });
  } catch (error) {
    const response = buildProteinsErrorResponse(error);

    console.error("Failed to query /api/proteins", error);

    return NextResponse.json(response.body, { status: response.status });
  }
}

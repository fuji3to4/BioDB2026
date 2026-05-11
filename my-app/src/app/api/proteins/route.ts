import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    "SELECT proteinID, name, organism, len, fav FROM Protein ORDER BY proteinID LIMIT 10"
  );

  return NextResponse.json({
    count: result.rows.length,
    proteins: result.rows,
  });
}

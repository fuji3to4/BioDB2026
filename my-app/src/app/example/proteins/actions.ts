"use server";

import { revalidatePath } from "next/cache";
import { validateProteinInput } from "@/lib/protein-form";
import { EXAMPLE_PROTEINS_PATH } from "@/lib/routes";
import {
  createProtein,
  deleteProtein,
  incrementProteinFav,
} from "@/lib/proteins";

export async function createProteinAction(_: { error: string | null }, formData: FormData) {
  try {
    const input = validateProteinInput(formData);
    await createProtein(input);
    revalidatePath(EXAMPLE_PROTEINS_PATH);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create protein" };
  }
}

export async function incrementProteinFavAction(proteinId: number) {
  await incrementProteinFav(proteinId);
  revalidatePath(EXAMPLE_PROTEINS_PATH);
}

export async function deleteProteinAction(proteinId: number) {
  await deleteProtein(proteinId);
  revalidatePath(EXAMPLE_PROTEINS_PATH);
}
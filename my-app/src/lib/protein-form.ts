export type ProteinInput = {
  name: string;
  organism: string;
  length: number;
};

function readRequiredText(formData: FormData, key: string, label: string): string {
  const value = formData.get(key);
  const text = typeof value === "string" ? value.trim() : "";

  if (!text) {
    throw new Error(`${label} is required`);
  }

  return text;
}

export function validateProteinInput(formData: FormData): ProteinInput {
  const name = readRequiredText(formData, "name", "Protein name");
  const organism = readRequiredText(formData, "org", "Organism");
  const lengthValue = readRequiredText(formData, "len", "Length");
  const length = Number(lengthValue);

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Length must be a positive integer");
  }

  return { name, organism, length };
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProteinAction } from "./actions";

const initialState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return <button type="submit">{pending ? "Creating..." : "Create protein"}</button>;
}

export function ProteinCreateForm() {
  const [state, formAction] = useActionState(createProteinAction, initialState);

  return (
    <form action={formAction} className="protein-form">
      <div className="protein-form-grid">
        <label>
          <span>Protein name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Organism</span>
          <input name="org" required />
        </label>
        <label>
          <span>Length</span>
          <input name="len" type="number" min="1" step="1" required />
        </label>
      </div>

      {state.error ? <p className="form-error">{state.error}</p> : null}

      <div className="form-actions">
        <SubmitButton />
      </div>
    </form>
  );
}

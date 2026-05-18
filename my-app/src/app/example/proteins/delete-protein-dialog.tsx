"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteProteinDialogProps {
  proteinId: number;
  deleteAction: (proteinId: number, formData?: FormData) => Promise<void>;
}

export function DeleteProteinDialog({
  proteinId,
  deleteAction,
}: DeleteProteinDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className="danger-button">
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
          <AlertDialogDescription>Delete this protein?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteAction(proteinId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";

type ConfirmDeleteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  confirmMessage?: string;
};

export function ConfirmDeleteButton({
  confirmMessage = "Delete this protein?",
  onClick,
  ...props
}: ConfirmDeleteButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  }

  return <button type="submit" onClick={handleClick} {...props} />;
}

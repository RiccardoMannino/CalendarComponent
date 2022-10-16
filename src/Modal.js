import React from "react";
import "./input.css";

export default function CustomModal({
  title = "Title",
  open,
  onClose,
  onCancel,
  cancelText,
  onSubmit,
  submitText,
  onDelete,
  deleteText,
  children,
}) {
  return (
    open && (
      <div open={open} onClose={onClose}>
        <div onClose={onClose}>
          {title}
          {children}

          {onCancel && (
            <button onClick={onCancel}>{cancelText || "Annulla"}</button>
          )}
          {onDelete && (
            <button onClick={onDelete}>{deleteText || "Delete"}</button>
          )}
          {onSubmit && (
            <button onClick={onSubmit}>{submitText || "Submit"}</button>
          )}
        </div>
      </div>
    )
  );
}

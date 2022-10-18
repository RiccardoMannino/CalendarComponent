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
      <div className="glass-component btn modale" open={open} onClose={onClose}>
        <div onClose={onClose}>
          {title}
          <div>{children}</div>

          {onCancel && (
            <button className="btn-sm mt-4 p-1" onClick={onCancel}>
              {cancelText || "Annulla"}
            </button>
          )}
          {onDelete && (
            <button className="btn-sm mt-4 ml-2 p-1" onClick={onDelete}>
              {deleteText || "Delete"}
            </button>
          )}
          {onSubmit && (
            <button className="btn-sm mt-4 ml-2 p-1" onClick={onSubmit}>
              {submitText || "Submit"}
            </button>
          )}
        </div>
      </div>
    )
  );
}

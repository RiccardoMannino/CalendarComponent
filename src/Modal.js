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
  className,
  children,
}) {
  return (
    open && (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: "1000",
        }}
        open={open}
        onClose={onClose}
      >
        <div onClose={onClose}>
          {title}
          <div className="bg-red-600">{children}</div>

          {onCancel && (
            <button className={className} onClick={onCancel}>
              {cancelText || "Annulla"}
            </button>
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

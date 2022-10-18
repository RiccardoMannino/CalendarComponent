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
      <div
      className="glass-component btn modale"
        open={open}
        onClose={onClose}
      >
        <div 
        onClose={onClose}>
          {title}
          <div>{children}</div>

          {onCancel && (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onCancel}>{cancelText || "Annulla"}</button>
          )}
          {onDelete && (
            <button className="bg" onClick={onDelete}>{deleteText || "Delete"}</button>
          )}
          {onSubmit && (
            <button className="bg" onClick={onSubmit}>{submitText || "Submit"}</button>
          )}
        </div>
      </div>
    )
  );
}

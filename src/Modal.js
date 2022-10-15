import React from "react";
import { Dialog } from "@headlessui/react";
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
    <Dialog open={open} onClose={onClose}>
      <Dialog.Description onClose={onClose}>{title}</Dialog.Description>
      {children}
      <div>
        {onCancel && (
          <button onClick={onCancel}>{cancelText || "Cancel"}</button>
        )}
        {onDelete && (
          <button onClick={onDelete}>{deleteText || "Delete"}</button>
        )}
        {onSubmit && (
          <button onClick={onSubmit}>{submitText || "Submit"}</button>
        )}
      </div>
    </Dialog>
  );
}

"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm action",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
        zIndex: 1100,
      }}
    >
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg p-3 text-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
          }}
        >
          <div className="modal-body">
            <h5 className="fw-bold mb-3">{title}</h5>
            <p className="text-muted small mb-4">{message}</p>

            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-dark shadow-sm py-2"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
              <button
                className="btn btn-light shadow-sm py-2"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

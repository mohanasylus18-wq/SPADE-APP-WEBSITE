import React, { useEffect } from "react";
import { Icon } from "./Icon";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "error";
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="spade-toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <Icon name="check-circle" size={18} className="text-emerald-500" />;
      case "error":
        return <Icon name="alert-triangle" size={18} className="text-rose-500" />;
      case "info":
      default:
        return <Icon name="info" size={18} className="text-[#3867F6]" />;
    }
  };

  return (
    <div className={`spade-toast spade-toast-${toast.type} animate-slide-in`}>
      <div className="spade-toast-icon">{getIcon()}</div>
      <div className="spade-toast-content">
        <h4 className="spade-toast-title">{toast.title}</h4>
        {toast.description && <p className="spade-toast-desc">{toast.description}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="spade-toast-close"
        aria-label="Close notification"
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
};

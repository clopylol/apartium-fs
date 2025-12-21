import type { FC, ReactNode } from "react";
import { X } from "lucide-react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleIcon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  zIndex?: number;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

export const FormModal: FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  titleIcon,
  children,
  footer,
  maxWidth = "lg",
  zIndex = 50,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-ds-background-light/80 dark:bg-ds-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ zIndex }}
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50">
          <h2 className="text-lg font-bold text-ds-in-indigo-light dark:text-ds-in-indigo-dark flex items-center gap-2">
            {titleIcon && <span className="text-ds-in-indigo-light dark:text-ds-in-indigo-dark">{titleIcon}</span>}
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-secondary-light dark:hover:text-ds-secondary-dark transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};


import type { FC, ReactNode } from "react";
import { X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showCloseButton?: boolean;
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

export const BaseModal: FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
  showCloseButton = true,
  zIndex = 50,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-ds-background-dark/80 dark:bg-ds-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ zIndex }}
      onClick={onClose}
    >
      <div
        className={`bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl w-full ${maxWidthClasses[maxWidth]} shadow-2xl overflow-hidden relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-ds-background-light dark:bg-ds-background-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};


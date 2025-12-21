import type { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2, HelpCircle, Info } from "lucide-react";
import { BaseModal } from "../base-modal";

export type ConfirmationVariant = "success" | "danger" | "warning" | "info" | "default";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  variant?: ConfirmationVariant;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

interface VariantStyles {
  borderColor: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  buttonBg: string;
  buttonHover: string;
  buttonShadow: string;
  Icon: typeof CheckCircle2;
}

const getVariantStyles = (variant: ConfirmationVariant): VariantStyles => {
  switch (variant) {
    case "success":
      return {
        borderColor: "border-ds-in-success-500/30",
        iconBg: "bg-ds-in-success-500/10",
        iconBorder: "border-ds-in-success-500/30",
        iconColor: "text-ds-in-success-500",
        buttonBg: "bg-ds-in-success-600",
        buttonHover: "hover:bg-ds-in-success-500",
        buttonShadow: "shadow-ds-in-success-900/30",
        Icon: CheckCircle2,
      };
    case "danger":
      return {
        borderColor: "border-ds-in-destructive-500/30",
        iconBg: "bg-ds-in-destructive-500/10",
        iconBorder: "border-ds-in-destructive-500/30",
        iconColor: "text-ds-in-destructive-500",
        buttonBg: "bg-ds-in-destructive-600",
        buttonHover: "hover:bg-ds-in-destructive-500",
        buttonShadow: "shadow-ds-in-destructive-900/30",
        Icon: AlertTriangle,
      };
    case "warning":
      return {
        borderColor: "border-ds-in-warning-500/30",
        iconBg: "bg-ds-in-warning-500/10",
        iconBorder: "border-ds-in-warning-500/30",
        iconColor: "text-ds-in-warning-500",
        buttonBg: "bg-ds-in-warning-600",
        buttonHover: "hover:bg-ds-in-warning-500",
        buttonShadow: "shadow-ds-in-warning-900/30",
        Icon: AlertTriangle,
      };
    case "info":
      return {
        borderColor: "border-ds-in-sky-500/30",
        iconBg: "bg-ds-in-sky-500/10",
        iconBorder: "border-ds-in-sky-500/30",
        iconColor: "text-ds-in-sky-500",
        buttonBg: "bg-ds-in-sky-600",
        buttonHover: "hover:bg-ds-in-sky-500",
        buttonShadow: "shadow-ds-in-sky-900/30",
        Icon: Info,
      };
    default:
      return {
        borderColor: "border-ds-border-light dark:border-ds-border-dark",
        iconBg: "bg-ds-muted-light/10 dark:bg-ds-muted-dark/10",
        iconBorder: "border-ds-muted-light/30 dark:border-ds-muted-dark/30",
        iconColor: "text-ds-muted-light dark:text-ds-muted-dark",
        buttonBg: "bg-ds-action",
        buttonHover: "hover:bg-ds-action-hover",
        buttonShadow: "shadow-ds-action/30",
        Icon: HelpCircle,
      };
  }
};

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = "default",
  confirmText,
  cancelText,
  icon,
  maxWidth = "md",
}) => {
  const { t } = useTranslation();
  const styles = getVariantStyles(variant);
  const Icon = styles.Icon;

  const defaultConfirmText = confirmText || t("common.buttons.confirm");
  const defaultCancelText = cancelText || t("common.buttons.cancel");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={maxWidth}
      showCloseButton={false}
      zIndex={60}
    >
      <div className={`border ${styles.borderColor} rounded-2xl overflow-hidden`}>
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon */}
          {icon ? (
            <div className="mb-6">{icon}</div>
          ) : (
            <div
              className={`w-20 h-20 rounded-full ${styles.iconBg} border-2 ${styles.iconBorder} flex items-center justify-center mb-6`}
            >
              <Icon className={`w-10 h-10 ${styles.iconColor}`} strokeWidth={2} />
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-3">
            {title}
          </h2>

          {/* Message */}
          <div className="text-ds-secondary-light dark:text-ds-secondary-dark mb-8 leading-relaxed">
            {message}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark rounded-xl font-semibold transition-colors"
            >
              {defaultCancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold shadow-lg transition-colors ${styles.buttonBg} ${styles.buttonHover} ${styles.buttonShadow}`}
            >
              {defaultConfirmText}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};


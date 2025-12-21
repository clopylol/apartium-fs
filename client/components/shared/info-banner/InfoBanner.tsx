import type { FC, ReactNode } from "react";

interface InfoBannerProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: "info" | "warning" | "success" | "error";
}

const variantStyles = {
  info: "bg-ds-in-sky-900/10 border-ds-in-sky-900/20 text-ds-in-sky-200 text-ds-in-sky-400",
  warning: "bg-ds-in-warning-900/10 border-ds-in-warning-900/20 text-ds-in-warning-200 text-ds-in-warning-400",
  success: "bg-ds-in-success-900/10 border-ds-in-success-900/20 text-ds-in-success-200 text-ds-in-success-400",
  error: "bg-ds-in-destructive-900/10 border-ds-in-destructive-900/20 text-ds-in-destructive-200 text-ds-in-destructive-400",
};

const iconVariantStyles = {
  info: "text-ds-in-sky-400",
  warning: "text-ds-in-warning-400",
  success: "text-ds-in-success-400",
  error: "text-ds-in-destructive-400",
};

export const InfoBanner: FC<InfoBannerProps> = ({
  icon,
  title,
  description,
  variant = "info",
}) => {
  const bgClass = variantStyles[variant];
  const iconClass = iconVariantStyles[variant];

  return (
    <div className={`${bgClass} border rounded-xl p-4 flex items-center gap-3`}>
      <div className={`${iconClass} shrink-0 scale-125`}>{icon}</div>
      <div>
        <h4 className={`font-heading font-bold text-sm`}>{title}</h4>
        <p className={`font-sans text-xs mt-1 opacity-60`}>{description}</p>
      </div>
    </div>
  );
};


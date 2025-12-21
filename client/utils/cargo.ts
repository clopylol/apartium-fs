/**
 * Kargo firmasına göre renk class'ları döndüren utility function
 * @param carrier - Kargo firması adı
 * @returns Tailwind CSS class string'i
 */
export const getCarrierColor = (carrier: string): string => {
  if (carrier.includes("Yurtiçi")) return "bg-ds-in-sky-500/10 text-ds-in-sky-400 border-ds-in-sky-500/20";
  if (carrier.includes("Aras")) return "bg-ds-in-teal-500/10 text-ds-in-teal-400 border-ds-in-teal-500/20";
  if (carrier.includes("MNG")) return "bg-ds-in-orange-500/10 text-ds-in-orange-400 border-ds-in-orange-500/20";
  if (carrier.includes("Trendyol")) return "bg-ds-in-orange-600/10 text-ds-in-orange-500 border-ds-in-orange-600/20";
  return "bg-ds-background-light dark:bg-ds-background-dark text-ds-muted-light dark:text-ds-muted-dark border-ds-border-light dark:border-ds-border-dark";
};


import type { Site } from "@/types/residents.types";

interface SiteSelectorProps {
  sites: Site[];
  activeSiteId: string | null;
  onSiteChange: (siteId: string) => void;
}

/**
 * SiteSelector Component
 * 
 * Site (Apartman) seçimi için dropdown
 * Header'da kullanılır
 */
export function SiteSelector({ sites, activeSiteId, onSiteChange }: SiteSelectorProps) {
  if (sites.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-ds-card-light dark:bg-ds-card-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark">
        <span className="text-sm text-ds-muted-light dark:text-ds-muted-dark">
          Site yükleniyor...
        </span>
      </div>
    );
  }

  // Tek site varsa dropdown gösterme
  if (sites.length === 1) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-ds-card-light dark:bg-ds-card-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark">
        <svg
          className="w-5 h-5 text-ds-primary-light dark:text-ds-primary-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="text-sm font-medium text-ds-secondary-light dark:text-ds-secondary-dark">
          {sites[0].name}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={activeSiteId || ""}
        onChange={(e) => onSiteChange(e.target.value)}
        className="appearance-none flex items-center gap-2 pl-10 pr-10 py-2 bg-ds-card-light dark:bg-ds-card-dark text-ds-secondary-light dark:text-ds-secondary-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark hover:border-ds-primary-light dark:hover:border-ds-primary-dark transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ds-primary-light dark:focus:ring-ds-primary-dark text-sm font-medium"
      >
        <option value="" disabled>
          Site Seçin
        </option>
        {sites.map((site) => (
          <option key={site.id} value={site.id}>
            {site.name}
          </option>
        ))}
      </select>

      {/* Dropdown Icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-ds-muted-light dark:text-ds-muted-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Building Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-ds-primary-light dark:text-ds-primary-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
    </div>
  );
}


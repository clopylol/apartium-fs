import type { FC } from "react";
import { User, Bell, Smartphone, ArrowDownCircle } from "lucide-react";
import type { ExpectedCargo } from "@/types/cargo.types";
import { ExpectedCargoSkeleton } from "../../skeletons";
import { InfoBanner } from "@/components/shared/info-banner";
import { Button } from "@/components/shared/button";
import { getCarrierColor } from "@/utils/cargo";

interface ExpectedCargoCardsProps {
  items: ExpectedCargo[];
  isLoading: boolean;
  onQuickAccept: (item: ExpectedCargo) => void;
}

export const ExpectedCargoCards: FC<ExpectedCargoCardsProps> = ({ items, isLoading, onQuickAccept }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <InfoBanner
        icon={<Smartphone className="w-5 h-5" />}
        title="Mobil Uygulama Bildirimleri"
        description='Bu liste, sakinlerin mobil uygulama üzerinden "Kargom Gelecek" bildirimi yaptığı paketleri içerir.'
        variant="info"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <ExpectedCargoSkeleton />
            <ExpectedCargoSkeleton />
            <ExpectedCargoSkeleton />
          </>
        ) : (
          <>
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-5 hover:border-ds-in-sky-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-ds-background-light dark:bg-ds-background-dark flex items-center justify-center text-ds-muted-light dark:text-ds-muted-dark border border-ds-border-light dark:border-ds-border-dark">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-sm">{item.residentName}</h3>
                        <span className="text-xs font-bold bg-ds-in-indigo-500/10 text-ds-in-indigo-400 px-2 py-0.5 rounded border border-ds-in-indigo-500/20">
                          Daire {item.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="p-3 bg-ds-background-light dark:bg-ds-background-dark rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-ds-muted-light dark:text-ds-muted-dark">Kargo Firması</span>
                        <span className={`font-bold px-1.5 py-0.5 rounded border ${getCarrierColor(item.carrier)}`}>{item.carrier}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-ds-muted-light dark:text-ds-muted-dark">Takip No</span>
                        <span className="text-ds-secondary-light dark:text-ds-secondary-dark font-mono tracking-wider bg-ds-card-light dark:bg-ds-card-dark px-1 rounded">
                          {item.trackingNo}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-ds-muted-light dark:text-ds-muted-dark">Beklenen Tarih</span>
                        <span className="text-ds-secondary-light dark:text-ds-secondary-dark">{item.expectedDate}</span>
                      </div>
                    </div>

                    {item.note && (
                      <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark italic bg-ds-background-light dark:bg-ds-background-dark p-2 rounded-lg border border-ds-border-light dark:border-ds-border-dark">
                        "{item.note}"
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-ds-border-light dark:border-ds-border-dark">
                    <span className="text-[10px] text-ds-muted-light dark:text-ds-muted-dark flex items-center gap-1">
                      <Bell className="w-3 h-3" /> {item.createdAt}
                    </span>
                    <Button
                      onClick={() => onQuickAccept(item)}
                      size="sm"
                      leftIcon={<ArrowDownCircle className="w-3.5 h-3.5" />}
                      className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20"
                    >
                      Giriş Yap
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-ds-muted-light dark:text-ds-muted-dark border-2 border-dashed border-ds-border-light dark:border-ds-border-dark rounded-2xl bg-ds-card-light dark:bg-ds-card-dark">
                <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Beklenen kargo bildirimi yok.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


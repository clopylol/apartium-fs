import type { FC } from "react";
import { Megaphone, Plus } from "lucide-react";

interface AnnouncementsEmptyStateProps {
    onAddNew: () => void;
}

export const AnnouncementsEmptyState: FC<AnnouncementsEmptyStateProps> = ({ onAddNew }) => {
    return (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-ds-card-light dark:bg-ds-card-dark rounded-full flex items-center justify-center mb-6 ring-1 ring-ds-border-light dark:ring-ds-border-dark shadow-inner">
                <Megaphone className="w-10 h-10 text-ds-muted-light dark:text-ds-muted-dark opacity-50" />
            </div>
            <h3 className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-xl mb-2">
                Henüz Duyuru Eklenmemiş
            </h3>
            <p className="text-ds-muted-light dark:text-ds-muted-dark mb-8 leading-relaxed text-center">
                Sakinleri bilgilendirmek için yeni bir duyuru oluşturun. Planlanmış bakım çalışmaları,
                toplantılar veya genel bilgilendirmeler paylaşabilirsiniz.
            </p>
            <button
                onClick={onAddNew}
                className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-ds-in-sky-900/20 transition-all hover:scale-105 flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                İlk Duyuruyu Oluştur
            </button>
        </div>
    );
};

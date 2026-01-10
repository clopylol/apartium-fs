import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddFacilityCardProps {
    onClick: () => void;
}

export const AddFacilityCard = ({ onClick }: AddFacilityCardProps) => {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            className="rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-4 min-h-[300px] hover:bg-slate-900/40 hover:border-slate-700 transition-all group"
        >
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-slate-500 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-slate-400 group-hover:text-white transition-colors">
                    {t('bookings.facilities.addFacility', 'Tesis Ekle')}
                </h3>
                <p className="text-sm text-slate-600">
                    {t('bookings.facilities.addFacilityDescription', 'Yeni bir sosyal tesis ekleyin')}
                </p>
            </div>
        </button>
    );
};

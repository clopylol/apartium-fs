import type { FC } from "react";
import { Edit2, Megaphone, Globe, Calendar, AlertTriangle } from "lucide-react";
import { FormModal } from "@/components/shared/modals";
import { InfoBanner } from "@/components/shared/info-banner";
import type { Announcement } from "@/types/Announcement.types";
import { formatDateForInput } from "@/utils/date";

interface AnnouncementFormModalProps {
    isOpen: boolean;
    isEditing: boolean;
    announcement: Partial<Announcement>;
    onClose: () => void;
    onSave: () => void;
    onChange: (announcement: Partial<Announcement>) => void;
    isLoading?: boolean;
}

export const AnnouncementFormModal: FC<AnnouncementFormModalProps> = ({
    isOpen,
    isEditing,
    announcement,
    onClose,
    onSave,
    onChange,
    isLoading = false,
}) => {
    const footer = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 font-bold text-sm transition-colors border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                İptal
            </button>
            <button
                onClick={onSave}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Oluştur')}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Oluştur'}
            titleIcon={isEditing ? <Edit2 className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
            footer={footer}
            maxWidth="lg"
            zIndex={50}
        >
            <div className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Duyuru Başlığı</label>
                    <input
                        type="text"
                        value={announcement.title}
                        onChange={(e) => onChange({ ...announcement, title: e.target.value })}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                        placeholder="Örn: Su Kesintisi Hakkında"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">İçerik</label>
                    <textarea
                        value={announcement.content}
                        onChange={(e) => onChange({ ...announcement, content: e.target.value })}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors h-32 resize-none"
                        placeholder="Duyuru detaylarını buraya yazınız..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Öncelik</label>
                        <select
                            value={announcement.priority}
                            onChange={(e) => onChange({ ...announcement, priority: e.target.value as Announcement['priority'] })}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                        >
                            <option value="High">Yüksek (Acil)</option>
                            <option value="Medium">Orta</option>
                            <option value="Low">Düşük</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Durum</label>
                        <select
                            value={announcement.status}
                            onChange={(e) => onChange({ ...announcement, status: e.target.value as Announcement['status'] })}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                        >
                            <option value="Published">Hemen Yayınla</option>
                            <option value="Scheduled">Planla</option>
                            <option value="Draft">Taslak Olarak Kaydet</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Hedef Kitle</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <select
                                value={announcement.visibility}
                                onChange={(e) => onChange({ ...announcement, visibility: e.target.value as Announcement['visibility'] })}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                            >
                                <option value="All Residents">Tüm Sakinler</option>
                                <option value="Building A">A Blok Sakinleri</option>
                                <option value="Building B">B Blok Sakinleri</option>
                                <option value="Building C">C Blok Sakinleri</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Yayın Tarihi</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="date"
                                value={formatDateForInput(announcement.publishDate)}
                                onChange={(e) => onChange({ ...announcement, publishDate: e.target.value })}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors [color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>

                <InfoBanner
                    icon={<AlertTriangle className="w-5 h-5" />}
                    title="Bildirim Uyarısı"
                    description='"Hemen Yayınla" seçeneği işaretlendiğinde, duyuru anında tüm hedef kitleye mobil bildirim olarak gönderilecektir.'
                    variant="warning"
                />
            </div>
        </FormModal>
    );
};

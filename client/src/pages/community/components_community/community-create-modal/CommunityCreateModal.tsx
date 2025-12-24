// 1. External & React
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// 2. Hooks
import { useSites } from '@/hooks/residents/site/useSites';
import { useBuildings } from '@/hooks/residents/api/useResidentsData';

// 3. Components
import { Button } from '@/components/shared/button';
import { ToggleSwitch } from '@/components/shared/inputs';
import { FormModal } from '@/components/shared/modals';

// 4. Icons
import { Plus, Building2 } from 'lucide-react';

interface CreateModalProps {
    isOpen: boolean;
    createType: 'request' | 'poll';
    newItem: {
        title: string;
        description: string;
        type: string;
        startDate: string;
        endDate: string;
        siteId?: string;
        buildingId?: string;
    };
    onClose: () => void;
    onTypeChange: (type: 'request' | 'poll') => void;
    onItemChange: (field: string, value: string) => void;
    onSubmit: () => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({
    isOpen,
    createType,
    newItem,
    onClose,
    onTypeChange,
    onItemChange,
    onSubmit
}) => {
    const { t } = useTranslation();

    // Fetch sites and buildings
    const { sites, isLoading: isLoadingSites } = useSites();
    const { data: buildingsData, isLoading: isLoadingBuildings } = useBuildings();
    const allBuildings = buildingsData?.buildings || [];

    // Selected site and building state
    const [selectedSiteId, setSelectedSiteId] = useState<string>("");
    const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");

    // Filter buildings by selected site
    const availableBuildings = useMemo(() => {
        if (!selectedSiteId) return [];
        return allBuildings.filter((b: any) => b.siteId === selectedSiteId);
    }, [allBuildings, selectedSiteId]);

    // Initialize selected site when modal opens
    useEffect(() => {
        if (isOpen && sites.length > 0) {
            const firstSiteId = sites[0].id;
            if (!selectedSiteId || selectedSiteId !== firstSiteId) {
                setSelectedSiteId(firstSiteId);
                setSelectedBuildingId("");
            }
        }
    }, [isOpen, sites, selectedSiteId]);

    // Update newItem when site/building changes
    useEffect(() => {
        if (!isOpen) return;
        if (!selectedSiteId || selectedSiteId === "") return;

        if (selectedBuildingId && selectedBuildingId !== "") {
            onItemChange('buildingId', selectedBuildingId);
            onItemChange('siteId', '');
        } else {
            onItemChange('siteId', selectedSiteId);
            onItemChange('buildingId', '');
        }
    }, [selectedBuildingId, selectedSiteId, isOpen]);

    const footer = (
        <div className="flex gap-3">
            <Button
                onClick={onClose}
                variant="secondary"
                fullWidth
            >
                {t('community.createModal.buttons.cancel')}
            </Button>
            <Button
                onClick={onSubmit}
                variant="primary"
                fullWidth
                className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-500/20"
            >
                {createType === 'poll' ? t('community.createModal.buttons.start') : t('community.createModal.buttons.create')}
            </Button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={createType === 'poll' ? t('community.createModal.title.poll') : t('community.createModal.title.request')}
            titleIcon={<Plus className="w-5 h-5" />}
            footer={footer}
            maxWidth="lg"
            zIndex={50}
        >
            <div className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('community.createModal.labels.type')}</label>
                    <ToggleSwitch
                        options={[
                            { value: 'request', label: t('community.createModal.types.request') },
                            { value: 'poll', label: t('community.createModal.types.poll') },
                        ]}
                        value={createType}
                        onChange={(type) => {
                            onTypeChange(type);
                            onItemChange('type', type === 'request' ? 'request' : 'poll');
                        }}
                    />
                </div>

                {createType === 'request' && (
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('community.createModal.labels.category')}</label>
                        <select
                            value={newItem.type}
                            onChange={(e) => onItemChange('type', e.target.value)}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                        >
                            <option value="wish">{t('community.createModal.categories.wish')}</option>
                            <option value="suggestion">{t('community.createModal.categories.suggestion')}</option>
                        </select>
                    </div>
                )}

                {/* Site and Building Selection */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                            <Building2 className="w-3 h-3" />
                            Site / Blok Seçimi
                        </label>
                        <select
                            value={selectedSiteId}
                            onChange={(e) => {
                                setSelectedSiteId(e.target.value);
                                setSelectedBuildingId("");
                            }}
                            disabled={isLoadingSites}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                        >
                            {isLoadingSites ? (
                                <option>Yükleniyor...</option>
                            ) : (
                                sites.map((site: any) => (
                                    <option key={site.id} value={site.id}>
                                        {site.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {selectedSiteId && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Blok Seçimi (Opsiyonel - Tüm Bloklar için boş bırakın)
                            </label>
                            <select
                                value={selectedBuildingId}
                                onChange={(e) => setSelectedBuildingId(e.target.value)}
                                disabled={isLoadingBuildings || !selectedSiteId}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                            >
                                <option value="">Tüm Bloklar</option>
                                {availableBuildings.map((building: any) => (
                                    <option key={building.id} value={building.id}>
                                        {building.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('community.createModal.labels.title')}</label>
                    <input
                        type="text"
                        value={newItem.title}
                        onChange={(e) => onItemChange('title', e.target.value)}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                        placeholder={createType === 'poll' ? t('community.createModal.placeholders.pollTitle') : t('community.createModal.placeholders.requestTitle')}
                    />
                </div>

                {createType === 'poll' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('community.createModal.labels.startDate')}</label>
                            <input
                                type="date"
                                value={newItem.startDate}
                                onChange={(e) => onItemChange('startDate', e.target.value)}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('community.createModal.labels.endDate')}</label>
                            <input
                                type="date"
                                value={newItem.endDate}
                                onChange={(e) => onItemChange('endDate', e.target.value)}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors [color-scheme:dark]"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('community.createModal.labels.description')}</label>
                    <textarea
                        value={newItem.description}
                        onChange={(e) => onItemChange('description', e.target.value)}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors h-32 resize-none"
                        placeholder={t('community.createModal.placeholders.description')}
                    />
                </div>
            </div>
        </FormModal>
    );
};


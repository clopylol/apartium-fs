import { useState } from 'react';
import { Plus, Download, Edit2, Trash2, Settings, Heart, MessageSquare, BarChart2, Smartphone, Clock, CheckCircle, CarFront, User, Bell, ArrowDownCircle, Calendar, Search as SearchIcon, LogOut, Megaphone, Filter } from 'lucide-react';
import { Button, IconButton, ButtonGroup } from '@/components/shared/button';
import { SearchInput } from '@/components/shared/inputs/search-input';
import { Dropdown } from '@/components/shared/inputs/dropdown';
import { FilterChip } from '@/components/shared/inputs/filter-chip';
import { ChipGroup } from '@/components/shared/inputs/chip-group';
import { MultiFilter } from '@/components/shared/inputs/multi-filter';
import type { FilterConfig, ActiveFilter } from '@/components/shared/inputs/multi-filter';
import { TabToggle } from '@/components/shared/navigation/tab-toggle';
import { InfoBanner } from '@/components/shared/info-banner';
import { CargoStatusBadge, CourierStatusBadge, MaintenanceStatusBadge, MaintenancePriorityBadge } from '@/components/shared/status-badge';
import { Pagination } from '@/components/shared/pagination';
import { ConfirmationModal } from '@/components/shared/modals';
import { getCarrierColor } from '@/utils/cargo';

export function DesignSystemPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectValue, setSelectValue] = useState('Option 1');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeToggle, setActiveToggle] = useState<'residents' | 'parking'>('residents');
    const [activeChip, setActiveChip] = useState('all');
    
    // MultiFilter state
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    
    // ConfirmationModal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmVariant, setConfirmVariant] = useState<'success' | 'danger' | 'warning' | 'info' | 'default'>('default');

    const tabItems = [
        { id: 'overview', label: 'Overview', icon: <BarChart2 className="w-4 h-4" /> },
        { id: 'components', label: 'Components', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, badge: 3 },
    ];

    const handleLoadingDemo = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="p-8 space-y-12">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-ds-primary-light dark:text-ds-primary-dark">
                    Design System
                </h1>
                <p className="text-ds-secondary-light dark:text-ds-secondary-dark">
                    Ortak button component'lerinin tüm varyantları ve kullanım örnekleri
                </p>
            </div>

            {/* Button Variants */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Button Variants
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        5 farklı button variant'ı: primary, secondary, outline, ghost, destructive
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Primary */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Primary</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Ana aksiyon buttonları</p>
                        </div>
                        <Button variant="primary">Primary Button</Button>
                        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                            With Icon
                        </Button>
                        <Button variant="primary" disabled>Disabled</Button>
                    </div>

                    {/* Secondary */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Secondary</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">İkincil buttonlar</p>
                        </div>
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                            With Icon
                        </Button>
                        <Button variant="secondary" disabled>Disabled</Button>
                    </div>

                    {/* Outline */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Outline</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Kenarlıklı buttonlar</p>
                        </div>
                        <Button variant="outline">Outline Button</Button>
                        <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                            With Icon
                        </Button>
                        <Button variant="outline" disabled>Disabled</Button>
                    </div>

                    {/* Ghost */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Ghost</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Minimal buttonlar</p>
                        </div>
                        <Button variant="ghost">Ghost Button</Button>
                        <Button variant="ghost" leftIcon={<Heart className="w-4 h-4" />}>
                            With Icon
                        </Button>
                        <Button variant="ghost" disabled>Disabled</Button>
                    </div>

                    {/* Destructive */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Destructive</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Tehlikeli işlemler</p>
                        </div>
                        <Button variant="destructive">Delete</Button>
                        <Button variant="destructive" leftIcon={<Trash2 className="w-4 h-4" />}>
                            With Icon
                        </Button>
                        <Button variant="destructive" disabled>Disabled</Button>
                    </div>
                </div>
            </section>

            {/* Button Sizes */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Button Sizes
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        3 farklı boyut: sm, md (default), lg
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-8 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
                    <div className="flex items-center gap-4 flex-wrap">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium (Default)</Button>
                        <Button size="lg">Large</Button>
                    </div>
                </div>
            </section>

            {/* Button States */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Button States
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Loading ve disabled states
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-8 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
                    <div className="flex items-center gap-4 flex-wrap">
                        <Button onClick={handleLoadingDemo} isLoading={isLoading}>
                            {isLoading ? 'Loading...' : 'Click to Load'}
                        </Button>
                        <Button disabled>Disabled Button</Button>
                        <Button fullWidth>Full Width Button</Button>
                    </div>
                </div>
            </section>

            {/* Custom Styling Examples */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Custom Styling
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Custom renk ve stil gerektiren özel button'lar (Poll Yes/No gibi)
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-8 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-6">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">Poll Vote Buttons</h3>
                        <div className="flex gap-3">
                            <Button
                                size="sm"
                                fullWidth
                                className="bg-ds-in-success-900/20 hover:bg-ds-in-success-900/40 border border-ds-in-success-900/50 text-ds-in-success-400 shadow-none"
                            >
                                YES
                            </Button>
                            <Button
                                size="sm"
                                fullWidth
                                className="bg-ds-in-destructive-900/20 hover:bg-ds-in-destructive-900/40 border border-ds-in-destructive-900/50 text-ds-in-destructive-400 shadow-none"
                            >
                                NO
                            </Button>
                        </div>
                        <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark mt-3">
                            💡 Custom renkler için <code className="bg-ds-background-light dark:bg-ds-background-dark px-1 rounded">shadow-none</code> kullanın
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">Warning/Info Buttons</h3>
                        <div className="flex gap-3 flex-wrap">
                            <Button
                                size="sm"
                                className="bg-ds-in-warning-600/10 text-ds-in-warning-500 hover:bg-ds-in-warning-600/20 border border-ds-in-warning-600/20 shadow-none"
                            >
                                End Poll
                            </Button>
                            <Button
                                size="sm"
                                className="bg-ds-in-indigo-600 hover:bg-ds-in-indigo-500 shadow-lg shadow-ds-in-indigo-900/20"
                            >
                                Convert to Poll
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disabled States for All Variants */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Disabled States
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Tüm variant'ların disabled halleri
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-8 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
                    <div className="flex items-center gap-4 flex-wrap">
                        <Button variant="primary" disabled>Primary Disabled</Button>
                        <Button variant="secondary" disabled>Secondary Disabled</Button>
                        <Button variant="outline" disabled>Outline Disabled</Button>
                        <Button variant="ghost" disabled>Ghost Disabled</Button>
                        <Button variant="destructive" disabled>Destructive Disabled</Button>
                    </div>
                </div>
            </section>

            {/* Button Combinations */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Button Combinations
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Gerçek kullanım senaryolarından kombinasyonlar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Modal Footer */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Modal Footer</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Cancel + Save pattern</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" fullWidth>Cancel</Button>
                            <Button variant="primary" fullWidth>Save Changes</Button>
                        </div>
                    </div>

                    {/* Table Row Actions */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Table Row Actions</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Edit + Delete pattern</p>
                        </div>
                        <div className="flex gap-2">
                            <IconButton icon={<Edit2 className="w-4 h-4" />} ariaLabel="Edit" />
                            <IconButton icon={<Trash2 className="w-4 h-4" />} ariaLabel="Delete" variant="destructive" />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Form Actions</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Reset + Submit pattern</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline">Reset</Button>
                            <Button variant="primary">Submit</Button>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Header Actions</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Multiple action buttons</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">Create</Button>
                            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />} size="sm">Export</Button>
                            <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />} size="sm">Settings</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pagination Component */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Pagination Component
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Sayfalama için hazır component (çok yerde kullanılacak)
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-8 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-6">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">Basic Pagination</h3>
                        <Pagination
                            totalItems={100}
                            itemsPerPage={10}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>

                    <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-lg">
                        <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                            {`import { Pagination } from '@/components/shared/pagination';

<Pagination
  totalItems={100}
  itemsPerPage={10}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Best Practices */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Best Practices
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Button kullanımı için öneriler ve kurallar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* When to use which variant */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-3">
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark">Variant Kullanımı</h3>
                        <ul className="space-y-2 text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                            <li className="flex items-start gap-2">
                                <span className="text-ds-in-sky-500">•</span>
                                <span><strong>Primary:</strong> Ana aksiyon (Save, Submit, Create)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-ds-in-sky-500">•</span>
                                <span><strong>Secondary:</strong> İkincil aksiyon (Cancel, Export)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-ds-in-sky-500">•</span>
                                <span><strong>Outline:</strong> Daha az önemli aksiyonlar</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-ds-in-sky-500">•</span>
                                <span><strong>Ghost:</strong> Minimal görünüm gereken yerler</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-ds-in-destructive-500">•</span>
                                <span><strong>Destructive:</strong> Silme, iptal gibi tehlikeli işlemler</span>
                            </li>
                        </ul>
                    </div>

                    {/* Shadow Usage */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-3">
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark">Shadow Kullanımı</h3>
                        <ul className="space-y-2 text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Primary button'lar otomatik shadow alır</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-500">⚠</span>
                                <span>Custom renk kullanıyorsan <code className="bg-ds-background-light dark:bg-ds-background-dark px-1 rounded">shadow-none</code> ekle</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Özel shadow için className'de belirt</span>
                            </li>
                        </ul>
                    </div>

                    {/* Accessibility */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-3">
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark">Erişilebilirlik</h3>
                        <ul className="space-y-2 text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>IconButton'larda mutlaka <code className="bg-ds-background-light dark:bg-ds-background-dark px-1 rounded">ariaLabel</code> kullan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Disabled button'lar otomatik cursor-not-allowed alır</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Focus ring otomatik eklenir (keyboard navigation)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Custom Styling Rules */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-3">
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark">Custom Styling Kuralları</h3>
                        <ul className="space-y-2 text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500">✗</span>
                                <span>Sabit renk kodları kullanma (#hex, rgb)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Sadece <code className="bg-ds-background-light dark:bg-ds-background-dark px-1 rounded">ds-*</code> token'ları kullan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>className ile override edebilirsin</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-500">⚠</span>
                                <span>Light/dark mode'u unutma!</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Icon Buttons */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Icon Buttons
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Sadece icon içeren buttonlar (edit, delete, more actions vb.)
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Default</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Standart icon buttonlar</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconButton icon={<Edit2 className="w-4 h-4" />} ariaLabel="Edit" />
                            <IconButton icon={<Settings className="w-4 h-4" />} ariaLabel="Settings" />
                            <IconButton icon={<Heart className="w-4 h-4" />} ariaLabel="Like" />
                            <IconButton icon={<Download className="w-4 h-4" />} ariaLabel="Download" />
                        </div>
                        <div className="flex items-center gap-2">
                            <IconButton icon={<Edit2 className="w-4 h-4" />} ariaLabel="Edit" size="sm" />
                            <IconButton icon={<Edit2 className="w-4 h-4" />} ariaLabel="Edit" size="md" />
                            <IconButton icon={<Edit2 className="w-4 h-4" />} ariaLabel="Edit" size="lg" />
                        </div>
                    </div>

                    {/* Destructive */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Destructive</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Silme işlemleri için</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconButton icon={<Trash2 className="w-4 h-4" />} ariaLabel="Delete" variant="destructive" />
                            <IconButton icon={<Trash2 className="w-4 h-4" />} ariaLabel="Delete" variant="destructive" size="sm" />
                            <IconButton icon={<Trash2 className="w-4 h-4" />} ariaLabel="Delete" variant="destructive" size="lg" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Chip Group */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Chip Group
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Separator'lı minimal chip grupları (Tümü, Bekleyen, Teslim vb.)
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-8 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-6">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">Basic Example</h3>
                        <ChipGroup
                            items={[
                                { id: 'all', label: 'Tümü' },
                                { id: 'pending', label: 'Bekleyen' },
                                { id: 'delivered', label: 'Teslim' },
                            ]}
                            activeId={activeChip}
                            onChange={setActiveChip}
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">With More Items</h3>
                        <ChipGroup
                            items={[
                                { id: 'all', label: 'Tümü' },
                                { id: 'pending', label: 'Bekleyen' },
                                { id: 'active', label: 'Aktif' },
                                { id: 'delivered', label: 'Teslim' },
                                { id: 'completed', label: 'Tamamlandı' },
                            ]}
                            activeId="active"
                            onChange={() => { }}
                        />
                    </div>
                </div>
            </section>

            {/* Button Groups */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Button Groups
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Tab-style button grupları (CommunityHeader, JanitorHeader vb.)
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-8 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-6">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">Basic Example</h3>
                        <ButtonGroup
                            items={tabItems}
                            activeId={activeTab}
                            onChange={setActiveTab}
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">With Icons</h3>
                        <ButtonGroup
                            items={[
                                { id: 'requests', label: 'Requests', icon: <MessageSquare className="w-4 h-4" /> },
                                { id: 'polls', label: 'Polls', icon: <BarChart2 className="w-4 h-4" /> },
                            ]}
                            activeId="requests"
                            onChange={() => { }}
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">With Badge</h3>
                        <ButtonGroup
                            items={[
                                { id: 'staff', label: 'Staff', icon: <Settings className="w-4 h-4" /> },
                                { id: 'requests', label: 'Requests', icon: <MessageSquare className="w-4 h-4" />, badge: 5 },
                            ]}
                            activeId="staff"
                            onChange={() => { }}
                        />
                    </div>
                </div>
            </section>

            {/* Inputs & Navigation */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Inputs & Navigation
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Form elemanları ve navigasyon bileşenleri
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Search Input */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Search Input</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Arama alanı</p>
                        </div>
                        <SearchInput
                            value={searchValue}
                            onChange={setSearchValue}
                            placeholder="Search residents..."
                        />
                    </div>

                    {/* Dropdown (with Icon) */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Dropdown</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Icon destekli seçim menüsü</p>
                        </div>
                        <Dropdown
                            options={['Option 1', 'Option 2', 'Option 3']}
                            value={selectValue}
                            onChange={setSelectValue}
                            icon={Calendar}
                        />
                    </div>

                    {/* Tab Toggle */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Tab Toggle</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Görünüm değiştirici</p>
                        </div>
                        <TabToggle
                            items={[
                                { id: 'residents', label: 'Residents', icon: <SearchIcon className="w-4 h-4" /> },
                                { id: 'parking', label: 'Parking', icon: <CheckCircle className="w-4 h-4" /> },
                            ]}
                            activeTab={activeToggle}
                            onChange={(id) => setActiveToggle(id)}
                        />
                    </div>

                    {/* Status Filters (Guest Style) */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4 col-span-1 md:col-span-2">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Status Filters (Guest Style)</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Durum filtreleri - Yeni tasarım (All, Pending, Active, Completed)</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* Filter Container */}
                            <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 px-1 -mx-1 sm:mx-0 sm:px-0 custom-scrollbar">
                                <FilterChip
                                    label="All"
                                    isActive={activeFilter === 'All'}
                                    onClick={() => setActiveFilter('All')}
                                    className="px-4 py-2.5 text-sm rounded-xl"
                                />
                                <FilterChip
                                    label="Pending"
                                    isActive={activeFilter === 'Pending'}
                                    onClick={() => setActiveFilter('Pending')}
                                    variant="warning"
                                    icon={<Clock className="w-4 h-4" />}
                                    className="px-4 py-2.5 text-sm rounded-xl"
                                />
                                <FilterChip
                                    label="Active"
                                    isActive={activeFilter === 'Active'}
                                    onClick={() => setActiveFilter('Active')}
                                    variant="info"
                                    icon={<CarFront className="w-4 h-4" />}
                                    className="px-4 py-2.5 text-sm rounded-xl"
                                />
                                <FilterChip
                                    label="Completed"
                                    isActive={activeFilter === 'Completed'}
                                    onClick={() => setActiveFilter('Completed')}
                                    variant="destructive"
                                    icon={<LogOut className="w-4 h-4" />}
                                    className="px-4 py-2.5 text-sm rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Multi Filter Component */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Multi Filter Component
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Aktif filtrelerin chip olarak gösterildiği ve dropdown'larla yeni filtre eklenebilen çoklu filter yapısı
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">
                            MultiFilter Component
                        </h3>
                        <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">
                            Aktif filtreler üstte chip olarak gösterilir, dropdown'larla yeni filtreler eklenebilir
                        </p>
                    </div>
                    <div className="space-y-4">
                        <MultiFilter
                            filters={[
                                {
                                    key: 'status',
                                    label: 'Durum',
                                    options: [
                                        { value: 'All', label: 'Tüm Durumlar' },
                                        { value: 'New', label: 'Yeni' },
                                        { value: 'In Progress', label: 'İşleniyor' },
                                        { value: 'Completed', label: 'Tamamlandı' },
                                    ],
                                    value: statusFilter,
                                    onChange: setStatusFilter,
                                    variant: 'info',
                                },
                                {
                                    key: 'priority',
                                    label: 'Öncelik',
                                    options: [
                                        { value: 'All', label: 'Tüm Öncelikler' },
                                        { value: 'Low', label: 'Düşük' },
                                        { value: 'Medium', label: 'Orta' },
                                        { value: 'High', label: 'Yüksek' },
                                        { value: 'Urgent', label: 'Acil' },
                                    ],
                                    value: priorityFilter,
                                    onChange: setPriorityFilter,
                                    variant: 'destructive',
                                },
                                {
                                    key: 'category',
                                    label: 'Kategori',
                                    options: [
                                        { value: 'All', label: 'Tüm Kategoriler' },
                                        { value: 'Tesisat', label: 'Tesisat' },
                                        { value: 'Elektrik', label: 'Elektrik' },
                                        { value: 'Isıtma/Soğutma', label: 'Isıtma/Soğutma' },
                                        { value: 'Genel', label: 'Genel' },
                                    ],
                                    value: categoryFilter,
                                    onChange: setCategoryFilter,
                                },
                            ]}
                            activeFilters={[
                                ...(statusFilter !== 'All' ? [{
                                    key: 'status',
                                    label: 'Durum',
                                    value: statusFilter === 'New' ? 'Yeni' : statusFilter === 'In Progress' ? 'İşleniyor' : 'Tamamlandı',
                                    onRemove: () => setStatusFilter('All'),
                                    variant: 'info' as const,
                                }] : []),
                                ...(priorityFilter !== 'All' ? [{
                                    key: 'priority',
                                    label: 'Öncelik',
                                    value: priorityFilter === 'Urgent' ? 'Acil' : priorityFilter === 'High' ? 'Yüksek' : priorityFilter === 'Medium' ? 'Orta' : 'Düşük',
                                    onRemove: () => setPriorityFilter('All'),
                                    variant: 'destructive' as const,
                                }] : []),
                                ...(categoryFilter !== 'All' ? [{
                                    key: 'category',
                                    label: 'Kategori',
                                    value: categoryFilter,
                                    onRemove: () => setCategoryFilter('All'),
                                }] : []),
                            ]}
                        />
                        <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-lg">
                            <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                                {`import { MultiFilter, ActiveFilterTag } from '@/components/shared/inputs/multi-filter';
import type { FilterConfig, ActiveFilter } from '@/components/shared/inputs/multi-filter';

const [statusFilter, setStatusFilter] = useState('All');
const [priorityFilter, setPriorityFilter] = useState('All');
const [categoryFilter, setCategoryFilter] = useState('All');

const filters: FilterConfig[] = [
  {
    key: 'status',
    label: 'Durum',
    options: [
      { value: 'All', label: 'Tüm Durumlar' },
      { value: 'New', label: 'Yeni' },
      { value: 'In Progress', label: 'İşleniyor' },
      { value: 'Completed', label: 'Tamamlandı' },
    ],
    value: statusFilter,
    onChange: setStatusFilter,
    variant: 'info',
  },
  // ... diğer filtreler
];

const activeFilters: ActiveFilter[] = [
  ...(statusFilter !== 'All' ? [{
    key: 'status',
    label: 'Durum',
    value: 'Yeni',
    onRemove: () => setStatusFilter('All'),
    variant: 'info',
  }] : []),
  // ... diğer aktif filtreler
];

<MultiFilter
  filters={filters}
  activeFilters={activeFilters}
/>`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Usage Examples */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Usage Examples
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Gerçek kullanım senaryoları
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-8 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-6">
                    {/* Header Actions */}
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">Header Actions</h3>
                        <div className="flex items-center gap-3 flex-wrap">
                            <Button leftIcon={<Plus className="w-4 h-4" />}>
                                Create New
                            </Button>
                            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                                Export
                            </Button>
                            <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Table Actions */}
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">Table Row Actions</h3>
                        <div className="flex items-center gap-2">
                            <IconButton icon={<Edit2 className="w-4 h-4" />} ariaLabel="Edit" />
                            <IconButton icon={<Trash2 className="w-4 h-4" />} ariaLabel="Delete" variant="destructive" />
                            <IconButton icon={<Settings className="w-4 h-4" />} ariaLabel="Settings" />
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-4">Modal Footer</h3>
                        <div className="flex gap-3">
                            <Button variant="secondary" fullWidth>
                                Cancel
                            </Button>
                            <Button fullWidth>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Examples */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Code Examples
                    </h2>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
                    <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                        {`// Import
import { Button, IconButton, ButtonGroup } from '@/components/button';

// Basic Button
<Button variant="primary">Click Me</Button>

// Button with Icon
<Button leftIcon={<Plus />}>Add New</Button>

// Icon Button
<IconButton icon={<Edit2 />} ariaLabel="Edit" />

// Button Group
<ButtonGroup
  items={[
    { id: 'tab1', label: 'Tab 1', icon: <Icon /> },
    { id: 'tab2', label: 'Tab 2', badge: 5 }
  ]}
  activeId="tab1"
  onChange={(id) => setActiveTab(id)}
/>`}
                    </pre>
                </div>
            </section>

            {/* Info Banner / Alert Box */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Info Banner / Alert Box
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Bilgilendirme, uyarı ve bildirim banner'ları için kullanılan component
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">
                            InfoBanner Component
                        </h3>
                        <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">
                            Farklı variant'larla bilgilendirme banner'ları
                        </p>
                    </div>
                    <div className="space-y-3">
                        <InfoBanner
                            icon={<Smartphone className="w-5 h-5" />}
                            title="Mobil Uygulama Bildirimleri"
                            description='Bu liste, sakinlerin mobil uygulama üzerinden "Kargom Gelecek" bildirimi yaptığı paketleri içerir.'
                            variant="info"
                        />
                        <InfoBanner
                            icon={<Clock className="w-5 h-5" />}
                            title="Uyarı"
                            description="Bu bir uyarı mesajıdır."
                            variant="warning"
                        />
                        <InfoBanner
                            icon={<CheckCircle className="w-5 h-5" />}
                            title="Başarılı"
                            description="İşlem başarıyla tamamlandı."
                            variant="success"
                        />
                    </div>
                    <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-lg">
                        <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                            {`import { InfoBanner } from '@/components/shared/info-banner';

<InfoBanner
  icon={<Smartphone className="w-5 h-5" />}
  title="Başlık"
  description="Açıklama metni"
  variant="info" // info | warning | success | error
/>`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Status Badges */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Status Badges
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Table ve card'larda kullanılan inline status badge component'leri
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">
                            StatusBadge Component
                        </h3>
                        <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">
                            Cargo ve Courier için özel status badge'ler
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark mb-2">Cargo Status Badges:</p>
                            <div className="flex flex-wrap gap-2">
                                <CargoStatusBadge status="received" />
                                <CargoStatusBadge status="delivered" deliveredDate="15 Ocak 2024" />
                                <CargoStatusBadge status="returned" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark mb-2">Courier Status Badges:</p>
                            <div className="flex flex-wrap gap-2">
                                <CourierStatusBadge status="pending" />
                                <CourierStatusBadge status="inside" />
                                <CourierStatusBadge status="completed" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark mb-2">Custom Courier Labels:</p>
                            <div className="flex flex-wrap gap-2">
                                <CourierStatusBadge 
                                    status="pending" 
                                    customLabels={{ pending: "App Bildirimi" }}
                                />
                                <CourierStatusBadge 
                                    status="inside" 
                                    customLabels={{ inside: "İçeride" }}
                                />
                                <CourierStatusBadge 
                                    status="completed" 
                                    customLabels={{ completed: "Çıkış Yaptı" }}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark mb-2">Maintenance Status Badges:</p>
                            <div className="flex flex-wrap gap-2">
                                <MaintenanceStatusBadge status="New" />
                                <MaintenanceStatusBadge status="In Progress" />
                                <MaintenanceStatusBadge status="Completed" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark mb-2">Maintenance Priority Badges:</p>
                            <div className="flex flex-wrap gap-2">
                                <MaintenancePriorityBadge priority="Low" />
                                <MaintenancePriorityBadge priority="Medium" />
                                <MaintenancePriorityBadge priority="High" />
                                <MaintenancePriorityBadge priority="Urgent" />
                            </div>
                        </div>
                        <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-lg">
                            <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                                {`import { CargoStatusBadge, CourierStatusBadge, MaintenanceStatusBadge, MaintenancePriorityBadge } from '@/components/shared/status-badge';

// Cargo Status Badge
<CargoStatusBadge status="received" />
<CargoStatusBadge status="delivered" deliveredDate="15 Ocak 2024" />
<CargoStatusBadge status="returned" />

// Courier Status Badge
<CourierStatusBadge status="pending" />
<CourierStatusBadge 
  status="inside" 
  customLabels={{ inside: "İçeride" }}
/>

// Maintenance Status Badge
<MaintenanceStatusBadge status="New" />
<MaintenanceStatusBadge status="In Progress" />
<MaintenanceStatusBadge status="Completed" />

// Maintenance Priority Badge
<MaintenancePriorityBadge priority="Low" />
<MaintenancePriorityBadge priority="Medium" />
<MaintenancePriorityBadge priority="High" />
<MaintenancePriorityBadge priority="Urgent" />`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* getCarrierColor Utility */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        getCarrierColor Utility
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Kargo firmasına göre renk döndüren utility function
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">
                            getCarrierColor Function
                        </h3>
                        <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">
                            Kargo firması adına göre Tailwind CSS class string'i döndürür
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <span className={`font-bold px-2 py-1 rounded border ${getCarrierColor("Yurtiçi Kargo")}`}>
                                Yurtiçi Kargo
                            </span>
                            <span className={`font-bold px-2 py-1 rounded border ${getCarrierColor("Aras Kargo")}`}>
                                Aras Kargo
                            </span>
                            <span className={`font-bold px-2 py-1 rounded border ${getCarrierColor("MNG Kargo")}`}>
                                MNG Kargo
                            </span>
                            <span className={`font-bold px-2 py-1 rounded border ${getCarrierColor("Trendyol Express")}`}>
                                Trendyol Express
                            </span>
                        </div>
                        <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-lg">
                            <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                                {`import { getCarrierColor } from '@/utils/cargo';

// Kullanım
<span className={\`font-bold px-2 py-1 rounded border \${getCarrierColor(carrier)}\`}>
  {carrier}
</span>

// Function tanımı
const getCarrierColor = (carrier: string): string => {
  if (carrier.includes("Yurtiçi")) 
    return "bg-ds-in-sky-500/10 text-ds-in-sky-400 border-ds-in-sky-500/20";
  if (carrier.includes("Aras")) 
    return "bg-ds-in-teal-500/10 text-ds-in-teal-400 border-ds-in-teal-500/20";
  if (carrier.includes("MNG")) 
    return "bg-ds-in-orange-500/10 text-ds-in-orange-400 border-ds-in-orange-500/20";
  if (carrier.includes("Trendyol")) 
    return "bg-ds-in-orange-600/10 text-ds-in-orange-500 border-ds-in-orange-600/20";
  return "bg-ds-background-light dark:bg-ds-background-dark text-ds-muted-light dark:text-ds-muted-dark border-ds-border-light dark:border-ds-border-dark";
};`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Confirmation Modal */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Confirmation Modal
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Onay gerektiren işlemler için modal component'i
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">
                            ConfirmationModal Component
                        </h3>
                        <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">
                            Farklı variant'larla onay modal'ları
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex gap-3 flex-wrap">
                            <Button onClick={() => { setConfirmVariant('success'); setShowConfirmModal(true); }}>
                                Success Modal
                            </Button>
                            <Button variant="destructive" onClick={() => { setConfirmVariant('danger'); setShowConfirmModal(true); }}>
                                Danger Modal
                            </Button>
                            <Button variant="secondary" onClick={() => { setConfirmVariant('warning'); setShowConfirmModal(true); }}>
                                Warning Modal
                            </Button>
                            <Button variant="outline" onClick={() => { setConfirmVariant('info'); setShowConfirmModal(true); }}>
                                Info Modal
                            </Button>
                        </div>
                        <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-lg">
                            <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                                {`import { ConfirmationModal } from '@/components/shared/modals';

<ConfirmationModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleConfirm}
  title="Başlık"
  message="Onay mesajı"
  variant="success" // success | danger | warning | info | default
  icon={<CheckCircle className="w-8 h-8" />}
/>`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Empty States */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Empty States
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Veri olmadığında gösterilen boş durum pattern'leri
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Empty State with Action */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">Empty State with Action</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">İlk veri ekleme için</p>
                        </div>
                        <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-500">
                            <div className="w-20 h-20 bg-ds-card-light dark:bg-ds-card-dark rounded-full flex items-center justify-center mb-6 ring-1 ring-ds-border-light dark:ring-ds-border-dark shadow-inner">
                                <Megaphone className="w-10 h-10 text-ds-muted-light dark:text-ds-muted-dark opacity-50" />
                            </div>
                            <h3 className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-xl mb-2">
                                Henüz Duyuru Eklenmemiş
                            </h3>
                            <p className="text-ds-muted-light dark:text-ds-muted-dark mb-8 leading-relaxed text-center">
                                Sakinleri bilgilendirmek için yeni bir duyuru oluşturun.
                            </p>
                            <Button leftIcon={<Plus className="w-4 h-4" />}>
                                İlk Duyuruyu Oluştur
                            </Button>
                        </div>
                    </div>

                    {/* No Results Empty State */}
                    <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                        <div>
                            <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">No Results Empty State</h3>
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">Filtre sonucu bulunamadığında</p>
                        </div>
                        <div className="flex flex-col items-center animate-in fade-in duration-300">
                            <Filter className="w-12 h-12 mx-auto mb-3 text-ds-muted-light dark:text-ds-muted-dark opacity-20" />
                            <p className="text-lg font-medium text-ds-muted-light dark:text-ds-muted-dark mb-4">
                                Aradığınız kriterlere uygun sonuç bulunamadı.
                            </p>
                            <button className="text-ds-in-sky-400 hover:text-ds-in-sky-300 underline font-medium transition-colors">
                                Filtreleri Temizle
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skeleton / Loading States */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Skeleton / Loading States
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Veri yüklenirken gösterilen skeleton component'leri
                    </p>
                </div>

                <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">
                            Table Row Skeleton
                        </h3>
                        <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">
                            Tablo satırları için skeleton pattern
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-ds-border-light dark:border-ds-border-dark">
                                    <th className="p-4 text-left text-xs font-semibold text-ds-muted-light dark:text-ds-muted-dark">ID</th>
                                    <th className="p-4 text-left text-xs font-semibold text-ds-muted-light dark:text-ds-muted-dark">Başlık</th>
                                    <th className="p-4 text-left text-xs font-semibold text-ds-muted-light dark:text-ds-muted-dark">Kullanıcı</th>
                                    <th className="p-4 text-left text-xs font-semibold text-ds-muted-light dark:text-ds-muted-dark">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3].map((i) => (
                                    <tr key={i} className="border-b border-ds-border-light dark:border-ds-border-dark animate-pulse">
                                        <td className="p-4">
                                            <div className="h-4 w-12 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
                                        </td>
                                        <td className="p-4">
                                            <div className="h-5 w-48 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-ds-muted-light dark:bg-ds-muted-dark shrink-0" />
                                                <div className="space-y-1">
                                                    <div className="h-4 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
                                                    <div className="h-3 w-16 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="h-6 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded-full" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-lg">
                        <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                            {`// Skeleton Pattern
<tr className="border-b border-ds-border-light dark:border-ds-border-dark animate-pulse">
  <td className="p-4">
    <div className="h-4 w-12 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
  </td>
  <td className="p-4">
    <div className="h-5 w-48 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
  </td>
</tr>

// Kullanım: animate-pulse ve bg-ds-muted-* renkleri kullan`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Cargo-Specific Components */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                        Cargo-Specific Components
                    </h2>
                    <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                        Kargo sayfasında kullanılan özgün component'ler
                    </p>
                </div>

                {/* 3. ExpectedCargoCards Card Layout */}
                <div className="bg-ds-card-light dark:bg-ds-card-dark p-6 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
                    <div>
                        <h3 className="font-semibold text-ds-primary-light dark:text-ds-primary-dark mb-1">
                            ExpectedCargoCards Card Layout
                        </h3>
                        <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">
                            Beklenen kargo bildirimleri için özel card tasarımı (grid layout)
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Sample Card */}
                        <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-5 hover:border-ds-in-sky-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-ds-background-light dark:bg-ds-background-dark flex items-center justify-center text-ds-muted-light dark:text-ds-muted-dark border border-ds-border-light dark:border-ds-border-dark">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-sm">Ahmet Yılmaz</h3>
                                        <span className="text-xs font-bold bg-ds-in-indigo-500/10 text-ds-in-indigo-400 px-2 py-0.5 rounded border border-ds-in-indigo-500/20">
                                            Daire 12A
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="p-3 bg-ds-background-light dark:bg-ds-background-dark rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-ds-muted-light dark:text-ds-muted-dark">Kargo Firması</span>
                                        <span className="font-bold px-1.5 py-0.5 rounded border bg-ds-in-sky-500/10 text-ds-in-sky-400 border-ds-in-sky-500/20">Yurtiçi Kargo</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-ds-muted-light dark:text-ds-muted-dark">Takip No</span>
                                        <span className="text-ds-secondary-light dark:text-ds-secondary-dark font-mono tracking-wider bg-ds-card-light dark:bg-ds-card-dark px-1 rounded">
                                            TR123456789
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-ds-muted-light dark:text-ds-muted-dark">Beklenen Tarih</span>
                                        <span className="text-ds-secondary-light dark:text-ds-secondary-dark">15 Ocak 2024</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-ds-border-light dark:border-ds-border-dark">
                                <span className="text-[10px] text-ds-muted-light dark:text-ds-muted-dark flex items-center gap-1">
                                    <Bell className="w-3 h-3" /> 2 saat önce
                                </span>
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-ds-in-sky-600 hover:bg-ds-in-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-ds-in-sky-900/20">
                                    <ArrowDownCircle className="w-3.5 h-3.5" /> Giriş Yap
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-lg">
                        <pre className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark overflow-x-auto">
                            {`<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-5 hover:border-ds-in-sky-500/30 transition-all">
      {/* Card content */}
    </div>
  ))}
</div>`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Confirmation Modal Instance */}
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    setShowConfirmModal(false);
                    // Handle confirm action
                }}
                title={
                    confirmVariant === 'success' ? 'İşlem Başarılı' :
                    confirmVariant === 'danger' ? 'Silme İşlemi' :
                    confirmVariant === 'warning' ? 'Uyarı' :
                    confirmVariant === 'info' ? 'Bilgilendirme' :
                    'Onay Gerekli'
                }
                message={
                    confirmVariant === 'success' ? 'İşlem başarıyla tamamlandı.' :
                    confirmVariant === 'danger' ? 'Bu işlemi geri alamazsınız. Emin misiniz?' :
                    confirmVariant === 'warning' ? 'Bu işlem önemli bir değişiklik yapacak.' :
                    confirmVariant === 'info' ? 'Bu işlem hakkında bilgi.' :
                    'Bu işlemi onaylıyor musunuz?'
                }
                variant={confirmVariant}
                icon={
                    confirmVariant === 'success' ? <CheckCircle className="w-8 h-8 text-ds-in-success-500" /> :
                    confirmVariant === 'danger' ? <Trash2 className="w-8 h-8 text-ds-in-destructive-500" /> :
                    confirmVariant === 'warning' ? <Bell className="w-8 h-8 text-ds-in-warning-500" /> :
                    confirmVariant === 'info' ? <Smartphone className="w-8 h-8 text-ds-in-sky-500" /> :
                    undefined
                }
            />
        </div>
    );
}

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, TrendingDown, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    PaymentsHeader,
    IncomeStats,
    ExpenseStats,
    PaymentTable,
    PaymentFilters,
    BulkActionBar,
    ExpenseGroup,
    AddExpenseButton,
    ConfirmationModal,
    DuesGeneratorModal,
    AddExpenseModal,
    ExpenseConfirmationModal,
    ExpenseGroupSkeleton,
    PaymentsEmptyState,
    ExpensesEmptyState,
    PaymentsErrorState
} from './components_payments';
import { MONTHS, CURRENT_YEAR, EXPENSE_CATEGORIES } from '@/constants/payments';
import { usePayments, useExpenses, usePaymentFilters, usePaymentModals, usePaymentsState } from '@/hooks/payments';
import { TabToggle } from '@/components/shared/navigation/tab-toggle';
import { SearchInput } from '@/components/shared/inputs/search-input';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';

const isDateInPast = (month: string, year: string) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const targetYear = parseInt(year);
    const targetMonth = MONTHS.indexOf(month);

    if (targetYear < currentYear) return true;
    if (targetYear === currentYear && targetMonth < currentMonth) return true;
    return false;
};

export const PaymentsPage = () => {
    const { t } = useTranslation();

    // --- State ---
    const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
    const [selectedMonth, setSelectedMonth] = useState<string>(MONTHS[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState<string>(CURRENT_YEAR.toString());
    const [showExpenseDeleteModal, setShowExpenseDeleteModal] = useState<boolean>(false);
    const [targetExpense, setTargetExpense] = useState<{ id: string; title: string; amount: number } | null>(null);
    const ITEMS_PER_PAGE = 20;

    // --- Site and Building State ---
    const paymentsState = usePaymentsState();

    // --- Custom Hooks ---
    // Payment filters state (for UI)
    const {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        sortOrder,
        toggleSort,
        currentPage,
        setCurrentPage,
        effectiveSearchTerm,
    } = usePaymentFilters([], ITEMS_PER_PAGE);

    // Handle site change - reset building when site changes
    const handleSiteChange = (siteId: string) => {
        paymentsState.setActiveSiteId(siteId);
        paymentsState.setActiveBuildingId(null); // Reset building when site changes
    };

    // Payments hook with server-side filtering
    const {
        payments,
        isLoading: paymentsLoading,
        error: paymentsError,
        selectedIds,
        setSelectedIds,
        updatePaymentsAmount,
        togglePaymentStatus,
        refetch: refetchPayments,
        total: paymentsTotal,
        stats: incomeStats
    } = usePayments(
        selectedMonth,
        selectedYear,
        currentPage,
        ITEMS_PER_PAGE,
        {
            search: effectiveSearchTerm,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            buildingId: paymentsState.activeBuildingId || undefined,
            siteId: paymentsState.activeBuildingId ? undefined : (paymentsState.activeSiteId || undefined)
        }
    );

    // Expenses hook with server-side filtering
    const {
        expenses,
        isLoading: expensesLoading,
        error: expensesError,
        addExpense,
        updateExpense,
        deleteExpense,
        refetch: refetchExpenses,
        stats: expenseStats
    } = useExpenses(
        selectedMonth,
        selectedYear,
        1,
        1000, // Get all expenses for now
        {
            search: effectiveSearchTerm,
            buildingId: paymentsState.activeBuildingId || undefined,
            siteId: paymentsState.activeBuildingId ? undefined : (paymentsState.activeSiteId || undefined)
        }
    );

    // Server-side pagination and filtering
    const paginatedPayments = payments; // Server already returns paginated data
    const filteredPayments = payments; // Server already returns filtered data
    
    // Selectable payments (unpaid only) - client-side filter for selection
    const selectablePayments = payments.filter(p => p.status === 'unpaid');

    const {
        showDuesModal,
        openDuesModal,
        closeDuesModal,
        showAddExpenseModal,
        openAddExpenseModal,
        closeAddExpenseModal,
        showConfirmModal,
        actionType,
        targetPayment,
        openConfirmModal,
        closeConfirmModal
    } = usePaymentModals(payments);

    // --- Derived Data ---
    const isLoading = activeTab === 'income' ? paymentsLoading : expensesLoading;
    const error = activeTab === 'income' ? paymentsError : expensesError;

    // Expenses are already filtered server-side, no need for client-side filtering
    const filteredExpenses = expenses;

    const isSelectedPeriodPast = isDateInPast(selectedMonth, selectedYear);

    // --- Date Navigation Handlers ---
    const handlePreviousMonth = () => {
        const currentMonthIndex = MONTHS.indexOf(selectedMonth);
        if (currentMonthIndex === 0) {
            // Ocak'tan önce, bir önceki yıla geç
            const prevYear = parseInt(selectedYear) - 1;
            if (prevYear >= 2020) { // Min yıl kontrolü
                setSelectedYear(prevYear.toString());
                setSelectedMonth(MONTHS[11]); // Aralık
            }
        } else {
            setSelectedMonth(MONTHS[currentMonthIndex - 1]);
        }
    };

    const handleNextMonth = () => {
        const currentMonthIndex = MONTHS.indexOf(selectedMonth);
        if (currentMonthIndex === 11) {
            // Aralık'tan sonra, bir sonraki yıla geç
            const nextYear = parseInt(selectedYear) + 1;
            if (nextYear <= 2030) { // Max yıl kontrolü
                setSelectedYear(nextYear.toString());
                setSelectedMonth(MONTHS[0]); // Ocak
            }
        } else {
            setSelectedMonth(MONTHS[currentMonthIndex + 1]);
        }
    };

    // Check if navigation buttons should be disabled
    const canGoPrevious = useMemo(() => {
        const currentYear = parseInt(selectedYear);
        const currentMonthIndex = MONTHS.indexOf(selectedMonth);
        return !(currentYear === 2020 && currentMonthIndex === 0);
    }, [selectedMonth, selectedYear]);

    const canGoNext = useMemo(() => {
        const currentYear = parseInt(selectedYear);
        const currentMonthIndex = MONTHS.indexOf(selectedMonth);
        return !(currentYear === 2030 && currentMonthIndex === 11);
    }, [selectedMonth, selectedYear]);

    // --- Amount Calculation ---
    const currentPeriodAmount = useMemo(() => {
        if (payments.length > 0) {
            // İlk payment'ın amount'unu al (tüm payment'lar aynı amount'a sahip olmalı)
            const firstAmount = payments[0]?.amount;
            if (firstAmount && firstAmount > 0) {
                return typeof firstAmount === 'string' ? parseFloat(firstAmount) : firstAmount;
            }
        }
        return null; // Belirlenmemiş
    }, [payments]);

    // --- Handlers ---
    const toggleSelectAll = () => {
        const allSelectableIds = selectablePayments.map(p => p.id);
        const isAllSelected = allSelectableIds.length > 0 && allSelectableIds.every(id => selectedIds.includes(id));

        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allSelectableIds);
        }
    };

    const toggleSelectRow = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleTogglePayment = (id: string, currentStatus: 'paid' | 'unpaid') => {
        openConfirmModal(id, currentStatus === 'paid' ? 'cancel' : 'pay');
    };

    const processTransaction = () => {
        if (targetPayment) {
            togglePaymentStatus(
                targetPayment.id,
                actionType === 'pay' ? 'paid' : 'unpaid',
                selectedMonth,
                selectedYear
            );
            closeConfirmModal();
        }
    };

    const handleSendReminder = (id: string) => {
        alert(t('payments.messages.reminderSent', { id }));
    };

    const handleBulkRemind = () => {
        alert(t('payments.messages.bulkReminderQueued', { count: selectedIds.length }));
        setSelectedIds([]);
    };

    const handleGenerateDues = async (mode: 'single' | 'bulk', amount: number, bulkList?: any[]) => {
        if (mode === 'single') {
            updatePaymentsAmount(amount);
            // Toast notification is handled by usePayments hook
        } else {
            // Bulk mode: Create payment records for each month in bulkList
            if (bulkList && bulkList.length > 0) {
                try {
                    // Call API for each month in bulkList
                    const promises = bulkList.map(item => 
                        api.payments.bulkAmountUpdate(item.month, parseInt(item.year), item.amount)
                    );
                    await Promise.all(promises);
                    
                    // Refetch payments to show updated data
                    refetchPayments();
                    
                    showSuccess(
                        t('payments.messages.duesPlanSaved') || 
                        `${bulkList.length} ay için aidat planı başarıyla kaydedildi`
                    );
                } catch (error: any) {
                    console.error('Bulk dues generation error:', error);
                    showError(
                        error.message || 
                        t('payments.messages.duesPlanSaveFailed') || 
                        'Aidat planı kaydedilirken hata oluştu'
                    );
                }
            } else {
                showError('Aidat listesi boş');
            }
        }
        closeDuesModal();
    };

    const handleAddExpense = (newExpense: Partial<any>) => {
        addExpense(newExpense);
        closeAddExpenseModal();
    };

    const handleDeleteExpense = (id: string) => {
        const expense = expenses.find(e => e.id === id);
        if (expense) {
            setTargetExpense({ id: expense.id, title: expense.title, amount: expense.amount });
            setShowExpenseDeleteModal(true);
        }
    };

    const confirmDeleteExpense = () => {
        if (targetExpense) {
            deleteExpense(targetExpense.id);
            setShowExpenseDeleteModal(false);
            setTargetExpense(null);
        }
    };

    const cancelDeleteExpense = () => {
        setShowExpenseDeleteModal(false);
        setTargetExpense(null);
    };

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, setCurrentPage]);

    // Reset page when site or building changes
    useEffect(() => {
        setCurrentPage(1);
    }, [paymentsState.activeSiteId, paymentsState.activeBuildingId, setCurrentPage]);

    return (
        <div className="flex flex-col h-full bg-ds-background-dark overflow-hidden relative">
            <PaymentsHeader
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
                showDuesButton={activeTab === 'income'}
                onGenerateDues={openDuesModal}
                onExportReport={() => alert(t('payments.messages.reportDownloading'))}
                sites={paymentsState.sites}
                activeSiteId={paymentsState.activeSiteId}
                onSiteChange={handleSiteChange}
                buildings={paymentsState.buildings}
                activeBuildingId={paymentsState.activeBuildingId}
                onBuildingChange={paymentsState.setActiveBuildingId}
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto space-y-8 pb-20">

                    {/* Date & Amount Row */}
                    <div className="flex items-center justify-between gap-6">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-ds-secondary-light dark:text-ds-secondary-dark tracking-tight flex items-center gap-4">
                            {/* Previous Month Button */}
                            <button
                                onClick={handlePreviousMonth}
                                disabled={!canGoPrevious}
                                className={`p-2 rounded-lg transition-colors ${
                                    canGoPrevious
                                        ? 'text-ds-secondary-light dark:text-ds-secondary-dark hover:bg-ds-muted-dark/30 cursor-pointer'
                                        : 'text-ds-muted-light opacity-30 cursor-not-allowed'
                                }`}
                                title={t('payments.navigation.previousMonth') || 'Önceki ay'}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            
                            {selectedMonth} <span className="text-ds-muted-light">{selectedYear}</span>
                            
                            {/* Next Month Button */}
                            <button
                                onClick={handleNextMonth}
                                disabled={!canGoNext}
                                className={`p-2 rounded-lg transition-colors ${
                                    canGoNext
                                        ? 'text-ds-secondary-light dark:text-ds-secondary-dark hover:bg-ds-muted-dark/30 cursor-pointer'
                                        : 'text-ds-muted-light opacity-30 cursor-not-allowed'
                                }`}
                                title={t('payments.navigation.nextMonth') || 'Sonraki ay'}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            
                            {activeTab === 'income' && isSelectedPeriodPast && (
                                <div className="bg-ds-card-dark border border-ds-border-dark rounded-lg px-3 py-1 flex items-center gap-2 animate-in fade-in">
                                    <Lock className="w-5 h-5 text-ds-muted-light" />
                                    <span className="text-xs font-medium text-ds-muted-light uppercase tracking-wide">{t('payments.archive.label')}</span>
                                </div>
                            )}
                        </h2>

                        {/* Amount Display */}
                        {activeTab === 'income' && (
                            currentPeriodAmount !== null ? (
                                <div className="bg-gradient-to-r from-ds-in-indigo-light/30 via-ds-in-indigo-dark/30 to-ds-in-indigo-light/30 dark:from-ds-in-indigo-light/20 dark:via-ds-in-indigo-dark/20 dark:to-ds-in-indigo-light/20 border-2 border-ds-in-indigo-light/50 dark:border-ds-in-indigo-dark/50 rounded-xl px-5 py-3 flex items-center gap-3 shadow-xl shadow-ds-in-indigo-dark/20 dark:shadow-ds-in-indigo-dark/30 backdrop-blur-sm">
                                    <span className="text-xs font-bold text-ds-in-indigo-light/90 dark:text-ds-in-indigo-dark/90 uppercase tracking-wider">
                                        {t('payments.amount.label') || 'Ödeme Tutarı'}:
                                    </span>
                                    <span className="text-2xl font-extrabold text-ds-in-indigo-light dark:text-ds-in-indigo-dark drop-shadow-lg">
                                        ₺{currentPeriodAmount.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={openDuesModal}
                                    className="bg-ds-card-light dark:bg-ds-card-dark border-2 border-dashed border-ds-border-light dark:border-ds-border-dark hover:border-ds-primary-light dark:hover:border-ds-primary-dark rounded-lg px-4 py-2.5 flex items-center gap-3 transition-colors cursor-pointer group"
                                    title={t('payments.amount.clickToSet') || 'Aidat tutarını belirlemek için tıklayın'}
                                >
                                    <span className="text-xs font-semibold text-ds-muted-light dark:text-ds-muted-dark uppercase tracking-wide group-hover:text-ds-primary-light dark:group-hover:text-ds-primary-dark transition-colors">
                                        {t('payments.amount.label') || 'Ödeme Tutarı'}:
                                    </span>
                                    <span className="text-lg font-bold text-ds-muted-light dark:text-ds-muted-dark group-hover:text-ds-primary-light dark:group-hover:text-ds-primary-dark transition-colors">
                                        {t('payments.amount.notSet') || 'Belirlenmemiş'}
                                    </span>
                                    <svg 
                                        className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark group-hover:text-ds-primary-light dark:group-hover:text-ds-primary-dark transition-colors" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            )
                        )}
                    </div>

                    {/* Tab Toggle & Search Row */}
                    <div className="flex items-center justify-between gap-6">
                        {/* Tab Switcher */}
                        <TabToggle
                            items={[
                                { id: 'income', label: t('payments.tabs.income'), icon: <Wallet className="w-4 h-4" /> },
                                { id: 'expenses', label: t('payments.tabs.expenses'), icon: <TrendingDown className="w-4 h-4" /> },
                            ]}
                            activeTab={activeTab}
                            onChange={(id) => setActiveTab(id as any)}
                        />

                        {/* Search Bar */}
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder={activeTab === 'income' ? t('payments.search.income') : t('payments.search.expenses')}
                            className="w-full md:w-72"
                        />
                    </div>


                    {/* VIEW: INCOME */}
                    {activeTab === 'income' && (
                        <>
                            {paymentsError ? (
                                <PaymentsErrorState error={paymentsError} onRetry={refetchPayments} />
                            ) : (
                                <>
                                    <IncomeStats
                                        stats={incomeStats}
                                        isLoading={isLoading}
                                        selectedMonth={selectedMonth}
                                        selectedYear={selectedYear}
                                    />

                                    {!isLoading && payments.length === 0 ? (
                                        <PaymentsEmptyState onGenerateDues={openDuesModal} />
                                    ) : (
                                        <>
                                            <PaymentFilters
                                                activeFilter={statusFilter}
                                                onFilterChange={setStatusFilter}
                                            />

                                            <PaymentTable
                                                payments={paginatedPayments}
                                                selectedIds={selectedIds}
                                                onToggleSelect={toggleSelectRow}
                                                onToggleSelectAll={toggleSelectAll}
                                                onTogglePayment={handleTogglePayment}
                                                onSendReminder={handleSendReminder}
                                                sortOrder={sortOrder}
                                                onToggleSort={toggleSort}
                                                isLoading={isLoading}
                                                selectablePaymentsCount={selectablePayments.length}
                                                totalItems={paymentsTotal}
                                                itemsPerPage={ITEMS_PER_PAGE}
                                                currentPage={currentPage}
                                                onPageChange={setCurrentPage}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* VIEW: EXPENSES */}
                    {activeTab === 'expenses' && (
                        <>
                            {expensesError ? (
                                <PaymentsErrorState error={expensesError} onRetry={refetchExpenses} />
                            ) : (
                                <>
                                    <ExpenseStats
                                        stats={expenseStats}
                                        isLoading={isLoading}
                                        selectedMonth={selectedMonth}
                                        pendingCount={expenses.filter(e => e.status === 'pending').length}
                                    />

                                    <AddExpenseButton onClick={openAddExpenseModal} />

                                    <div className="space-y-6">
                                        {isLoading ? (
                                            <>
                                                <ExpenseGroupSkeleton />
                                                <ExpenseGroupSkeleton />
                                                <ExpenseGroupSkeleton />
                                            </>
                                        ) : expenses.length === 0 ? (
                                            <ExpensesEmptyState onAddExpense={openAddExpenseModal} />
                                        ) : (
                                            <>
                                                {EXPENSE_CATEGORIES.map(category => {
                                                    const categoryExpenses = filteredExpenses.filter(e => e.category === category.id);
                                                    if (categoryExpenses.length === 0) return null;

                                                    return (
                                                        <ExpenseGroup
                                                            key={category.id}
                                                            category={category}
                                                            expenses={categoryExpenses}
                                                            onDelete={handleDeleteExpense}
                                                        />
                                                    );
                                                })}

                                                {filteredExpenses.length === 0 && (
                                                    <div className="text-center py-12 text-ds-muted-light">
                                                        <p>{t('payments.expenses.noExpenses')}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                </div>
            </div>

            <BulkActionBar
                selectedCount={selectedIds.length}
                onSendReminders={handleBulkRemind}
                onCancel={() => setSelectedIds([])}
            />

            <ConfirmationModal
                isOpen={showConfirmModal}
                payment={targetPayment}
                actionType={actionType}
                onConfirm={processTransaction}
                onCancel={closeConfirmModal}
            />

            <DuesGeneratorModal
                isOpen={showDuesModal}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onClose={closeDuesModal}
                onGenerate={handleGenerateDues}
            />

            <AddExpenseModal
                isOpen={showAddExpenseModal}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onClose={closeAddExpenseModal}
                onAdd={handleAddExpense}
            />

            {targetExpense && (
                <ExpenseConfirmationModal
                    isOpen={showExpenseDeleteModal}
                    expense={{
                        id: targetExpense.id,
                        title: targetExpense.title,
                        amount: targetExpense.amount,
                        category: 'utilities',
                        date: '',
                        status: 'pending'
                    }}
                    onConfirm={confirmDeleteExpense}
                    onCancel={cancelDeleteExpense}
                />
            )}
        </div>
    );
};

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, TrendingDown, Lock } from 'lucide-react';
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
import { usePayments, useExpenses, usePaymentFilters, usePaymentModals } from '@/hooks/payments';
import { TabToggle } from '@/components/shared/navigation/tab-toggle';
import { SearchInput } from '@/components/shared/inputs/search-input';

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

    // --- Custom Hooks ---
    const {
        payments,
        isLoading: paymentsLoading,
        error: paymentsError,
        selectedIds,
        setSelectedIds,
        updatePaymentsAmount,
        togglePaymentStatus,
        refetch: refetchPayments
    } = usePayments(selectedMonth, selectedYear);

    const {
        expenses,
        isLoading: expensesLoading,
        error: expensesError,
        addExpense,
        deleteExpense,
        refetch: refetchExpenses
    } = useExpenses(selectedMonth, selectedYear);

    const {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        sortOrder,
        toggleSort,
        currentPage,
        setCurrentPage,
        filteredPayments,
        paginatedPayments,
        selectablePayments,
        incomeStats
    } = usePaymentFilters(payments, ITEMS_PER_PAGE);

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

    const expenseStats = useMemo(() => {
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const paid = expenses.filter(e => e.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
        const pending = total - paid;
        return { total, paid, pending };
    }, [expenses]);

    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [expenses, searchTerm]);

    const isSelectedPeriodPast = isDateInPast(selectedMonth, selectedYear);

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

    const handleGenerateDues = (mode: 'single' | 'bulk', amount: number, bulkList?: any[]) => {
        if (mode === 'single') {
            updatePaymentsAmount(amount);
            alert(t('payments.messages.duesUpdated', { month: selectedMonth, year: selectedYear, amount }));
        } else {
            alert(t('payments.messages.duesPlanSaved'));
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
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto space-y-8 pb-20">

                    {/* Large Date Display & Tab Switcher */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-ds-secondary-light dark:text-ds-secondary-dark tracking-tight mb-4 flex items-center gap-4">
                                {selectedMonth} <span className="text-ds-muted-light">{selectedYear}</span>
                                {activeTab === 'income' && isSelectedPeriodPast && (
                                    <div className="bg-ds-card-dark border border-ds-border-dark rounded-lg px-3 py-1 flex items-center gap-2 animate-in fade-in">
                                        <Lock className="w-5 h-5 text-ds-muted-light" />
                                        <span className="text-xs font-medium text-ds-muted-light uppercase tracking-wide">{t('payments.archive.label')}</span>
                                    </div>
                                )}
                            </h2>

                            {/* Tab Switcher */}
                            <TabToggle
                                items={[
                                    { id: 'income', label: t('payments.tabs.income'), icon: <Wallet className="w-4 h-4" /> },
                                    { id: 'expenses', label: t('payments.tabs.expenses'), icon: <TrendingDown className="w-4 h-4" /> },
                                ]}
                                activeTab={activeTab}
                                onChange={(id) => setActiveTab(id as any)}
                            />
                        </div>

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
                                                totalItems={filteredPayments.length}
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

import { useState, useEffect } from "react";
import { Wallet, DollarSign, TrendingUp, FileText } from "lucide-react";
import type { MonthlyData, ExpenseData, Transaction, TransactionFilter } from "@/types/reports.types";
import { StatCard } from "@/components/stat-card";
import { ReportsHeader } from "./components_reports/header";
import { IncomeExpenseChart, ExpenseDistributionChart } from "./components_reports/charts";
import { TransactionsTable } from "./components_reports/transactions";
import { StatCardSkeleton, ChartSkeleton, DonutChartSkeleton } from "./components_reports/skeletons";

// Mock Data
const MONTHLY_DATA: MonthlyData[] = [
    { name: "Oca", income: 45000, expense: 32000 },
    { name: "Şub", income: 52000, expense: 28000 },
    { name: "Mar", income: 48000, expense: 34000 },
    { name: "Nis", income: 61000, expense: 30000 },
    { name: "May", income: 55000, expense: 38000 },
    { name: "Haz", income: 67000, expense: 32000 },
    { name: "Tem", income: 72000, expense: 35000 },
];

const EXPENSE_DATA: ExpenseData[] = [
    { name: "Personel", value: 35, amount: 64470, color: "#3b82f6" },
    { name: "Bakım & Onarım", value: 25, amount: 46050, color: "#10b981" },
    { name: "Faturalar", value: 20, amount: 36840, color: "#f59e0b" },
    { name: "Vergi & Harç", value: 10, amount: 18420, color: "#ef4444" },
    { name: "Diğer", value: 10, amount: 18420, color: "#8b5cf6" },
];

const TRANSACTIONS: Transaction[] = [
    {
        id: 1,
        desc: "Daire 4B Aidat Ödemesi",
        category: "Gelir",
        subCategory: "Aidat",
        date: "21 Tem 2024",
        amount: "+₺1,500",
        status: "completed",
    },
    {
        id: 2,
        desc: "Asansör Bakım Ücreti",
        category: "Gider",
        subCategory: "Bakım",
        date: "20 Tem 2024",
        amount: "-₺4,200",
        status: "completed",
    },
    {
        id: 3,
        desc: "Bahçıvan Hizmet Bedeli",
        category: "Gider",
        subCategory: "Personel",
        date: "19 Tem 2024",
        amount: "-₺2,800",
        status: "pending",
    },
    {
        id: 4,
        desc: "Daire 12A Kira Ödemesi",
        category: "Gelir",
        subCategory: "Kira",
        date: "18 Tem 2024",
        amount: "+₺18,000",
        status: "completed",
    },
    {
        id: 5,
        desc: "Ortak Alan Elektrik Faturası",
        category: "Gider",
        subCategory: "Faturalar",
        date: "15 Tem 2024",
        amount: "-₺3,450",
        status: "completed",
    },
];

export function ReportsPage() {
    const dateRange = "Bu Yıl";
    const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>("all");
    const [isLoading, setIsLoading] = useState(true);

    // Simulate Data Loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Initialize transactions with 80% chance of data, 20% empty
    const [transactions] = useState(() => {
        return Math.random() > 0.2 ? TRANSACTIONS : [];
    });

    // Filter Transactions
    const filteredTransactions = transactions.filter((t) => {
        if (transactionFilter === "all") return true;
        if (transactionFilter === "income") return t.category === "Gelir";
        if (transactionFilter === "expense") return t.category === "Gider";
        return true;
    });

    return (
        <div className="flex flex-col h-full overflow-hidden bg-ds-background-dark dark:bg-ds-background-dark">
            {/* Header */}
            <ReportsHeader
                dateRange={dateRange}
                transactionFilter={transactionFilter}
                onTransactionFilterChange={setTransactionFilter}
            />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            <>
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                            </>
                        ) : (
                            <>
                                <StatCard
                                    title="Toplam Gelir"
                                    value="₺452,318"
                                    trend="+12.5%"
                                    trendUp={true}
                                    trendText="geçen aya göre"
                                    variant="green"
                                    icon={Wallet}
                                />
                                <StatCard
                                    title="Toplam Gider"
                                    value="₺184,200"
                                    trend="-2.4%"
                                    trendUp={false}
                                    trendText="geçen aya göre"
                                    variant="red"
                                    icon={DollarSign}
                                />
                                <StatCard
                                    title="Kasa Bakiyesi"
                                    value="₺268,118"
                                    trend="%59"
                                    trendUp={true}
                                    trendText="mevcut nakit"
                                    variant="blue"
                                    icon={TrendingUp}
                                />
                                <StatCard
                                    title="Tahsilat Oranı"
                                    value="%94.2"
                                    trend="₺24.5k"
                                    trendUp={true}
                                    trendText="bekleyen ödeme"
                                    variant="orange"
                                    icon={FileText}
                                />
                            </>
                        )}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart (Income vs Expense) */}
                        {isLoading ? (
                            <div className="lg:col-span-2">
                                <ChartSkeleton />
                            </div>
                        ) : (
                            <IncomeExpenseChart data={MONTHLY_DATA} />
                        )}

                        {/* Side Chart (Expense Categories - Donut) */}
                        {isLoading ? <DonutChartSkeleton /> : <ExpenseDistributionChart data={EXPENSE_DATA} />}
                    </div>

                    {/* Transactions Table */}
                    <TransactionsTable transactions={filteredTransactions} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

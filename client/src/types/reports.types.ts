export interface MonthlyData {
    name: string;
    income: number;
    expense: number;
}

export interface ExpenseData {
    name: string;
    value: number;
    amount: number;
    color: string;
}

export interface Transaction {
    id: number;
    desc: string;
    category: "Gelir" | "Gider";
    subCategory: string;
    date: string;
    amount: string;
    status: TransactionStatus;
}

export type TransactionStatus = "completed" | "pending";

export type TransactionFilter = "all" | "income" | "expense";

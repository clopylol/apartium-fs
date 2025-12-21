import type { FC } from "react";
import { FileText } from "lucide-react";
import type { Transaction } from "@/types/reports.types";
import { TransactionRow } from "./TransactionRow";
import { TransactionRowSkeleton } from "../skeletons";

interface TransactionsTableProps {
    transactions: Transaction[];
    isLoading: boolean;
}

export const TransactionsTable: FC<TransactionsTableProps> = ({ transactions, isLoading }) => {
    return (
        <div className="bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-ds-border-dark dark:border-ds-border-dark flex justify-between items-center">
                <h3 className="text-lg font-bold font-heading text-ds-primary-dark dark:text-ds-primary-dark">
                    Son Finansal Hareketler
                </h3>
                <div className="flex gap-2">
                    <span className="text-xs font-medium text-ds-secondary-dark dark:text-ds-secondary-dark px-2 py-1 bg-ds-muted-dark dark:bg-ds-muted-dark rounded">
                        {transactions.length} kayıt
                    </span>
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Tümünü Gör
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-ds-secondary-dark dark:text-ds-secondary-dark bg-ds-background-dark/50 dark:bg-ds-background-dark/50 text-xs uppercase font-semibold tracking-wider">
                            <th className="px-6 py-4">Açıklama</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4 text-right">Tutar</th>
                            <th className="px-6 py-4 text-center">Durum</th>
                            <th className="px-6 py-4 text-center">Belge</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ds-border-dark/50 dark:divide-ds-border-dark/50">
                        {isLoading ? (
                            <>
                                <TransactionRowSkeleton />
                                <TransactionRowSkeleton />
                                <TransactionRowSkeleton />
                                <TransactionRowSkeleton />
                                <TransactionRowSkeleton />
                            </>
                        ) : (
                            <>
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-ds-secondary-dark dark:text-ds-secondary-dark">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="text-sm font-medium">
                                                    Bu filtre için kayıtlı finansal hareket bulunmuyor.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

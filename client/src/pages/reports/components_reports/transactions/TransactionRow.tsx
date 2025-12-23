import type { FC } from "react";
import { ArrowDownRight, ArrowUpRight, Receipt } from "lucide-react";
import type { Transaction } from "@/types/reports.types";

interface TransactionRowProps {
    transaction: Transaction;
}

export const TransactionRow: FC<TransactionRowProps> = ({ transaction }) => {
    const isIncome = transaction.amount.startsWith("+");

    return (
        <tr className="hover:bg-ds-muted-dark/30 dark:hover:bg-ds-muted-dark/30 transition-colors group">
            <td className="px-6 py-4">
                <div className="font-semibold text-white dark:text-white">
                    {transaction.desc}
                </div>
                <div className="text-xs text-ds-secondary-light dark:text-ds-secondary-light mt-0.5">
                    ID: #TRX-{transaction.id}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 dark:bg-slate-800 text-slate-300 dark:text-slate-300 border border-slate-700 dark:border-slate-700 text-xs font-medium">
                    {isIncome ? (
                        <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    {transaction.subCategory}
                </span>
            </td>
            <td className="px-6 py-4 text-ds-secondary-light dark:text-ds-secondary-light font-mono text-xs">
                {transaction.date}
            </td>
            <td
                className={`px-6 py-4 text-right font-bold text-base ${isIncome ? "text-emerald-500" : "text-rose-500"
                    }`}
            >
                {transaction.amount}
            </td>
            <td className="px-6 py-4 text-center">
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${transaction.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                >
                    {transaction.status === "completed" ? "Tamamlandı" : "Bekliyor"}
                </span>
            </td>
            <td className="px-6 py-4 text-center">
                <button
                    className="p-2 text-ds-secondary-dark dark:text-ds-secondary-dark hover:text-ds-primary-dark dark:hover:text-ds-primary-dark hover:bg-ds-border-dark dark:hover:bg-ds-border-dark rounded-lg transition-colors"
                    title="Fatura/Makbuz Görüntüle"
                >
                    <Receipt className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
};

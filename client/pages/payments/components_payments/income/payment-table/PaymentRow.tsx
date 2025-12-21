import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Square, CheckCircle, XCircle, Bell } from 'lucide-react';
import type { PaymentRecord } from '@/types/payments';

interface PaymentRowProps {
    payment: PaymentRecord;
    isSelected: boolean;
    onToggleSelect: () => void;
    onTogglePayment: () => void;
    onSendReminder: () => void;
}

export const PaymentRow: FC<PaymentRowProps> = ({ payment, isSelected, onToggleSelect, onTogglePayment, onSendReminder }) => {
    const { t } = useTranslation();
    const isSelectable = payment.status === 'unpaid';

    return (
        <tr className={`transition-colors group animate-in fade-in duration-300 ${isSelected ? 'bg-ds-in-indigo-dark/10' : 'hover:bg-ds-muted-dark/30'}`}>
            <td className="px-6 py-4 text-center">
                <button
                    onClick={() => isSelectable && onToggleSelect()}
                    disabled={!isSelectable}
                    className={`flex items-center justify-center ${isSelected ? 'text-ds-in-indigo-light' : 'text-ds-muted-light group-hover:text-ds-secondary-light'} ${!isSelectable ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                    {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                </button>
            </td>
            <td className="px-6 py-4">
                <span className="bg-ds-muted-dark text-ds-secondary-light px-2 py-1 rounded-md font-mono text-sm font-bold border border-ds-border-dark">{payment.unit}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <img src={payment.avatar} alt={payment.residentName} className="w-9 h-9 rounded-full border border-ds-border-dark object-cover" />
                    <div>
                        <div className="font-medium text-ds-secondary-light dark:text-ds-secondary-dark">{payment.residentName}</div>
                        <div className="text-xs text-ds-muted-light opacity-60 font-mono tracking-wide">{payment.phone}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4"><span className="text-sm text-ds-muted-light capitalize">{payment.type === 'aidat' ? t('payments.types.dues') : payment.type}</span></td>
            <td className="px-6 py-4"><span className="font-bold text-ds-secondary-light dark:text-ds-secondary-dark">₺{payment.amount.toLocaleString()}</span></td>
            <td className="px-6 py-4">
                {payment.status === 'paid' ? (
                    <div className="flex flex-col">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 w-fit shadow-sm"><CheckCircle className="w-3 h-3" /> {t('payments.table.status.paid')}</span>
                        <span className="text-[10px] text-[#10b981] mt-1 pl-1 font-medium font-mono">{payment.date}</span>
                    </div>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 shadow-sm"><XCircle className="w-3 h-3" /> {t('payments.table.status.unpaid')}</span>
                )}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                    {payment.status === 'unpaid' && (
                        <button
                            onClick={onSendReminder}
                            className="p-1.5 text-ds-muted-light hover:text-ds-warning hover:bg-ds-muted-dark rounded-lg transition-colors"
                            title={t('payments.table.sendReminder')}
                        >
                            <Bell className="w-4 h-4" />
                        </button>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={payment.status === 'paid'} onChange={onTogglePayment} />
                        <div className={`relative w-11 h-6 rounded-full transition-all duration-200 ${payment.status === 'paid' ? 'bg-[#10b981]' : 'bg-[#ef4444]'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-offset-ds-background-dark ${payment.status === 'paid' ? 'peer-focus:ring-[#10b981]' : 'peer-focus:ring-[#ef4444]'}`}>
                            <span className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all duration-200 ${payment.status === 'paid' ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </div>
                    </label>
                </div>
            </td>
        </tr>
    );
};

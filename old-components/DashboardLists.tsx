import React from 'react';
import { RECENT_PAYMENTS, MAINTENANCE_REQUESTS, BOOKINGS, NEW_TENANTS } from '../constants';
import { DollarSign, Wrench, Calendar, UserPlus, ArrowRight, Clock, CheckCircle } from 'lucide-react';

interface ListCardWrapperProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  actionText?: string;
}

const ListCardWrapper: React.FC<ListCardWrapperProps> = ({ title, icon: Icon, children, actionText = "Tümünü Gör" }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[380px] overflow-hidden shadow-lg hover:border-slate-700 transition-colors">
    <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-950/30">
      <div className="flex items-center gap-3">
        {Icon && <div className="p-2 bg-blue-500/10 rounded-lg"><Icon className="w-5 h-5 text-blue-400" /></div>}
        <h3 className="font-bold text-lg text-white">{title}</h3>
      </div>
      <button className="text-xs font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-1 group">
        {actionText}
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
      {children}
    </div>
  </div>
);

export const RecentPaymentsList = () => (
  <ListCardWrapper title="Son Ödemeler" icon={DollarSign}>
    <div className="space-y-1">
      {RECENT_PAYMENTS.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between p-3 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${payment.status === 'paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                {payment.tenant.name}
              </div>
              <div className="text-xs text-slate-500">{payment.tenant.unit}</div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-white">₺{payment.amount.toLocaleString()}</div>
             <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" /> {payment.date}
             </div>
          </div>
        </div>
      ))}
    </div>
  </ListCardWrapper>
);

export const MaintenanceList = () => (
  <ListCardWrapper title="Bakım Talepleri" icon={Wrench}>
    <div className="space-y-1">
      {MAINTENANCE_REQUESTS.map((request) => (
        <div key={request.id} className="flex items-start justify-between p-3 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-800/50">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                request.status === 'new' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 
                request.status === 'in-progress' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            }`}>
              <Wrench className="w-5 h-5" />
            </div>
            <div className="max-w-[180px]">
              <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                 {request.id === 'm1' ? 'Mutfak Sorunu' : request.id === 'm2' ? 'Genel Bakım' : 'Isıtma/Soğutma'}
              </div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                 {request.issue}
              </div>
              <div className="mt-2 flex items-center gap-2">
                 <img src={request.tenant.avatar} alt="" className="w-5 h-5 rounded-full border border-slate-700" />
                 <span className="text-[10px] text-slate-500 font-medium">{request.tenant.name} • {request.tenant.unit}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{request.date}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                request.status === 'new' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                request.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
                {request.status === 'new' ? 'Yeni' : request.status === 'in-progress' ? 'İşleniyor' : 'Bitti'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </ListCardWrapper>
);

export const BookingsList = () => (
  <ListCardWrapper title="Tesis Rezervasyonları" icon={Calendar}>
    <div className="space-y-1">
      {BOOKINGS.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border-2 border-purple-500/20 flex items-center justify-center text-purple-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                {booking.facility}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                 {booking.tenant.name} tarafından
              </div>
            </div>
          </div>
          <div className="text-right">
             <div className="px-2 py-1 bg-slate-800 rounded-md text-xs font-medium text-slate-300 border border-slate-700">
                {booking.time}
             </div>
          </div>
        </div>
      ))}
    </div>
  </ListCardWrapper>
);

export const TenantsList = () => (
  <ListCardWrapper title="Bildirimler" icon={UserPlus}>
     <div className="space-y-1">
      {NEW_TENANTS.map((alert) => (
        <div key={alert.id} className="flex items-center justify-between p-3 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">
                {alert.title}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                 {alert.description}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium bg-slate-800/50 px-2 py-1 rounded">
             {alert.time}
          </div>
        </div>
      ))}
    </div>
  </ListCardWrapper>
);
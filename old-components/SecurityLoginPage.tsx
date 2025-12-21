
import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Eye, EyeOff, FileBadge } from 'lucide-react';

interface SecurityLoginPageProps {
  onLoginSuccess: () => void;
}

const SecurityLoginPage: React.FC<SecurityLoginPageProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    badgeId: '',
    password: ''
  });

  // Mock form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-200 font-sans relative z-50">
      
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0 bg-amber-600/10 mix-blend-overlay z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-20" />
        
        {/* Background Image - Security Context */}
        <img 
          src="https://images.unsplash.com/photo-1555462542-a81968d977e6?auto=format&fit=crop&w=1000&q=80" 
          alt="Security Control Room" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
        />

        {/* Content Overlay */}
        <div className="relative z-30 flex flex-col justify-between p-16 w-full h-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600 rounded-xl shadow-lg shadow-amber-900/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-heading text-white tracking-tight">Apartium Güvenlik</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-bold font-heading text-white leading-tight">
              Güvenli Yaşam,<br/>
              <span className="text-amber-500">7/24 Kontrol.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed border-l-4 border-amber-600 pl-4">
              Bu panel yalnızca yetkili güvenlik personeli içindir. Tüm girişler ve işlemler IP adresi ile kayıt altına alınmaktadır.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-500/80 font-mono bg-amber-950/30 p-3 rounded-lg border border-amber-900/50 w-fit">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            Sistem Durumu: AKTİF - v2.4.0
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
         
         {/* Mobile Logo */}
         <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
            <div className="p-2 bg-amber-600 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Güvenlik Paneli</span>
         </div>

         <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 mb-4">
                 <Lock className="w-3 h-3" /> YETKİLİ PERSONEL GİRİŞİ
               </div>
               <h2 className="text-3xl font-bold font-heading text-white mb-2">
                 Vardiya Girişi
               </h2>
               <p className="text-slate-400">
                 Lütfen sicil numaranız ve şifreniz ile giriş yapın.
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Güvenlik Sicil No</label>
                  <div className="relative group">
                     <FileBadge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                     <input 
                       type="text" 
                       value={formData.badgeId}
                       onChange={(e) => setFormData({...formData, badgeId: e.target.value})}
                       placeholder="Örn: SEC-1024"
                       className="w-full bg-slate-900 border border-slate-800 rounded-xl px-12 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono"
                       required
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Şifre</label>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                     <input 
                       type={showPassword ? "text" : "password"} 
                       value={formData.password}
                       onChange={(e) => setFormData({...formData, password: e.target.value})}
                       placeholder="••••••••"
                       className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-12 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                       required
                     />
                     <button 
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                     >
                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                  </div>
               </div>

               <button 
                 type="submit"
                 disabled={isLoading}
                 className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                    <>
                       Vardiyayı Başlat
                       <ArrowRight className="w-5 h-5" />
                    </>
                 )}
               </button>
            </form>

            <div className="pt-8 border-t border-slate-800 text-center">
               <p className="text-xs text-slate-500">
                  Teknik sorun yaşıyorsanız <span className="text-slate-300 hover:text-white cursor-pointer underline">Sistem Yöneticisi</span> ile iletişime geçin.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SecurityLoginPage;

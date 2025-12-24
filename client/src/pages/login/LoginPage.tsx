// 1. External & React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

// 2. Contexts
import { useAuth } from "@/contexts/auth";

// 6. Utils
import { showError } from "@/utils/toast";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Zaten authenticated ise dashboard'a yönlendir
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login işlemi - useAuth hook'u kullan
        await login(formData.email, formData.password);
        navigate("/dashboard", { replace: true });
      } else {
        // Register işlemi - şimdilik mock
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      setIsLoading(false);
      // Error handling AuthProvider'da yapılıyor
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook"): void => {
    // Mock - ileride entegre edilebilir
    showError(`${provider === "google" ? "Google" : "Facebook"} ile giriş henüz aktif değil`);
  };

  return (
    <div className="min-h-screen w-full flex bg-ds-background-light dark:bg-ds-background-dark text-ds-primary-light dark:text-ds-primary-dark font-sans relative z-50">
      {/* Left Panel - Visual (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-ds-card-dark dark:bg-ds-card-dark">
        <div className="absolute inset-0 bg-ds-action/20 mix-blend-multiply z-10 dark:bg-ds-action/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ds-background-dark via-ds-background-dark/50 to-transparent z-20" />

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
          alt="Modern Apartment"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        {/* Content Overlay */}
        <div className="relative z-30 flex flex-col justify-between p-16 w-full h-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-ds-action dark:bg-ds-action rounded-xl shadow-lg shadow-ds-action/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-heading text-white tracking-tight">
              Apartium
            </span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-bold font-heading text-white leading-tight">
              {isLogin
                ? "Yönetimi Profesyonelleştirin."
                : "Topluluğun Bir Parçası Olun."}
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Apartman ve site yönetim süreçlerini tek bir panelden yönetin.
              Finansal raporlar, aidat takibi ve sakin iletişimi artık çok
              daha kolay.
            </p>

            {/* Feature Pills */}
            <div className="flex gap-3 pt-4">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-ds-success dark:text-ds-success" />{" "}
                Kolay Ödeme
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-ds-success dark:text-ds-success" />{" "}
                7/24 Destek
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            © 2024 Apartium Yönetim Sistemleri A.Ş. Tüm hakları saklıdır.
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <div className="p-2 bg-ds-action dark:bg-ds-action rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-ds-primary-light dark:text-ds-primary-dark">
            Apartium
          </span>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold font-heading text-ds-primary-light dark:text-ds-primary-dark mb-2">
              {isLogin ? "Tekrar Hoşgeldiniz" : "Hesap Oluşturun"}
            </h2>
            <p className="text-ds-secondary-light dark:text-ds-secondary-dark">
              {isLogin
                ? "Lütfen hesabınıza giriş yapmak için bilgilerinizi girin."
                : "Yönetim sistemine katılmak için bilgilerinizi girin."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <label className="text-xs font-bold text-ds-secondary-light dark:text-ds-secondary-dark uppercase tracking-wider ml-1">
                  Ad Soyad
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-secondary-light dark:text-ds-secondary-dark group-focus-within:text-ds-action dark:group-focus-within:text-ds-action transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-12 py-3.5 text-ds-primary-light dark:text-ds-primary-dark placeholder-ds-secondary-light dark:placeholder-ds-secondary-dark focus:outline-none focus:ring-2 focus:ring-ds-action/50 dark:focus:ring-ds-action/50 focus:border-ds-action dark:focus:border-ds-action transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-ds-secondary-light dark:text-ds-secondary-dark uppercase tracking-wider ml-1">
                E-Posta Adresi
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-secondary-light dark:text-ds-secondary-dark group-focus-within:text-ds-action dark:group-focus-within:text-ds-action transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ornek@site.com"
                  className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-12 py-3.5 text-ds-primary-light dark:text-ds-primary-dark placeholder-ds-secondary-light dark:placeholder-ds-secondary-dark focus:outline-none focus:ring-2 focus:ring-ds-action/50 dark:focus:ring-ds-action/50 focus:border-ds-action dark:focus:border-ds-action transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-ds-secondary-light dark:text-ds-secondary-dark uppercase tracking-wider">
                  Şifre
                </label>
                {isLogin && (
                  <a
                    href="#"
                    className="text-xs font-medium text-ds-action dark:text-ds-action hover:text-ds-action-hover dark:hover:text-ds-action-hover transition-colors"
                  >
                    Şifremi Unuttum?
                  </a>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-secondary-light dark:text-ds-secondary-dark group-focus-within:text-ds-action dark:group-focus-within:text-ds-action transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl pl-12 pr-12 py-3.5 text-ds-primary-light dark:text-ds-primary-dark placeholder-ds-secondary-light dark:placeholder-ds-secondary-dark focus:outline-none focus:ring-2 focus:ring-ds-action/50 dark:focus:ring-ds-action/50 focus:border-ds-action dark:focus:border-ds-action transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-secondary-light dark:text-ds-secondary-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ds-action dark:bg-ds-action hover:bg-ds-action-hover dark:hover:bg-ds-action-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-ds-action/20 dark:shadow-ds-action/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Giriş Yap" : "Kayıt Ol"}{" "}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ds-border-light dark:border-ds-border-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-ds-background-light dark:bg-ds-background-dark text-ds-secondary-light dark:text-ds-secondary-dark">
                veya şununla devam et
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl hover:bg-ds-accent-light dark:hover:bg-ds-accent-dark transition-colors group"
            >
              <svg
                className="w-5 h-5 text-ds-primary-light dark:text-ds-primary-dark group-hover:text-ds-action dark:group-hover:text-ds-action"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-ds-primary-light dark:text-ds-primary-dark group-hover:text-ds-action dark:group-hover:text-ds-action">
                Google
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl hover:bg-ds-accent-light dark:hover:bg-ds-accent-dark transition-colors group"
            >
              <svg
                className="w-5 h-5 text-ds-primary-light dark:text-ds-primary-dark group-hover:text-ds-action dark:group-hover:text-ds-action"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              <span className="text-sm font-medium text-ds-primary-light dark:text-ds-primary-dark group-hover:text-ds-action dark:group-hover:text-ds-action">
                Facebook
              </span>
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-ds-secondary-light dark:text-ds-secondary-dark text-sm">
              {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="text-ds-action dark:text-ds-action font-bold hover:text-ds-action-hover dark:hover:text-ds-action-hover transition-colors ml-1"
              >
                {isLogin ? "Kayıt Olun" : "Giriş Yapın"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

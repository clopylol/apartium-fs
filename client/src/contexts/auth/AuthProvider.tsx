// 1. External & React
import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

// 2. Contexts
import { AuthContext, type AuthContextType, type AuthUser } from "./AuthContext";

// 6. Utils
import { api, setOnUnauthorizedCallback } from "@/lib/api";
import { showError, showSuccess } from "@/utils/toast";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Session kontrolü - App başlangıcında
  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const response = await api.auth.me();
      if (response?.user) {
        setUser(response.user as AuthUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Session yok veya geçersiz
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login fonksiyonu
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await api.auth.login(email, password);
        if (response?.user) {
          setUser(response.user as AuthUser);
          showSuccess("Giriş başarılı!");
        } else {
          throw new Error("Giriş başarısız");
        }
      } catch (error) {
        setUser(null);
        const errorMessage =
          error instanceof Error ? error.message : "Giriş başarısız";
        showError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Logout fonksiyonu
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await api.auth.logout();
      setUser(null);
      showSuccess("Çıkış yapıldı");
    } catch (error) {
      // Logout hatası olsa bile state'i temizle
      setUser(null);
      const errorMessage =
        error instanceof Error ? error.message : "Çıkış yapılırken hata oluştu";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // App başlangıcında session kontrolü
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // API client'a logout callback'i set et
  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      logout();
    });
  }, [logout]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


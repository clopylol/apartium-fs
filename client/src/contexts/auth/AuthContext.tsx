// 1. External & React
import { createContext } from "react";
import type { ReactNode } from "react";

// 7. Types
import type { User } from "apartium-shared";

// User tipi - passwordHash hariç
export type AuthUser = Omit<User, "passwordHash">;

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);


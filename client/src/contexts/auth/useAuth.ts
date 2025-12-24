// 1. External & React
import { useContext } from "react";

// 2. Contexts
import { AuthContext, type AuthContextType } from "./AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};


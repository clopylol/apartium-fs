// 1. External & React
import { Router } from "./Router";

// 2. Contexts
import { AuthProvider } from "@/contexts/auth";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;

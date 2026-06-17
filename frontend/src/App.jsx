import { BrowserRouter } from "react-router-dom";
import { AuthProvider }   from "./context/AuthContext";
import { useToast }       from "./hooks/useToast";
import AppRoutes          from "./routes/AppRoutes";
import Toast              from "./components/common/Toast";

export default function App() {
  const [toast, showToast] = useToast();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toast toast={toast} />
        <AppRoutes showToast={showToast} />
      </AuthProvider>
    </BrowserRouter>
  );
}
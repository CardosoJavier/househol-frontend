import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Backlog from "./pages/Backlog.tsx";
import Board from "./pages/Board.tsx";
import SignIn from "./pages/auth/login.tsx";
import App from "./App.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import VerifyEmail from "./pages/auth/verify-email.tsx";
import ProtectedRoute from "./components/navigation/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<App />} />
            <Route path="/board" element={<Board />} />
            <Route path="/backlog" element={<Backlog />} />
          </Route>
          {/* Auth */}
          <Route path="/auth/login" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route
            path="*"
            element={<div className="flex justify-center">Page Not Found</div>}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

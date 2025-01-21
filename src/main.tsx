import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Backlog from "./pages/Backlog.tsx";
import Board from "./pages/Board.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/board" element={<Board />} />
        <Route path="/backlog" element={<Backlog />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

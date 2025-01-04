import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Backlog from "./pages/Backlog.tsx";
import Board from "./pages/Board.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/board" element={<Board />} />
        <Route path="/backlog" element={<Backlog />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

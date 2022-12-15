import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import NotFoundPage from "./pages/404";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/index" element={<Navigate replace to="/" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

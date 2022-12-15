import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages";
import NotFoundPage from "./pages/404";

import { chakraTheme } from "./lib/chakra-ui";
import { queryClient } from "./lib/react-query";

// Urbanist font
import "@fontsource/urbanist/400.css";
import "@fontsource/urbanist/500.css";
import "@fontsource/urbanist/600.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={chakraTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/index" element={<Navigate replace to="/" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

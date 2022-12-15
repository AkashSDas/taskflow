import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";
import { Provider } from "jotai";

import HomePage from "./pages";
import NotFoundPage from "./pages/404";

import { chakraTheme } from "./lib/chakra-ui";
import { queryClient } from "./lib/react-query";
import Layout from "./components/layout";

// Urbanist font
import "@fontsource/urbanist/400.css";
import "@fontsource/urbanist/500.css";
import "@fontsource/urbanist/600.css";

export default function App() {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={chakraTheme}>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />

                <Route path="/index" element={<Navigate replace to="/" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  );
}

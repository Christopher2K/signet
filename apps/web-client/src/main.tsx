import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppLocaleProvider } from "./app-locale";
import { getRouter } from "./router";
import "./strict.css";
import "./styles.css";

const router = getRouter();
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The web application root element is missing.");
}

createRoot(rootElement).render(
  <StrictMode>
    <AppLocaleProvider>
      <QueryClientProvider client={router.options.context.queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppLocaleProvider>
  </StrictMode>,
);

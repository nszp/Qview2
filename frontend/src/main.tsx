import { MantineProvider } from "@mantine/core";
import { MantineEmotionProvider, emotionTransform } from "@mantine/emotion";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { themeOverride } from "./theme";

import "@mantine/core/styles.css";

import { routeTree } from "@/routes.ts";
import { queryClient } from "@/rootRoute.ts";

const root = document.getElementById("root");

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

if (root) {
  createRoot(root).render(
    <StrictMode>
      <MantineProvider
        theme={themeOverride}
        stylesTransform={emotionTransform}
        defaultColorScheme="dark"
      >
        <MantineEmotionProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </MantineEmotionProvider>
      </MantineProvider>
    </StrictMode>,
  );
}

import { MantineProvider } from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { themeOverride } from "./theme";

import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";

import { routeTree } from "@/routes.ts";
import { queryClient } from "@/rootRoute.ts";

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  context: {
    scrollRefs: [],
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <MantineProvider
        theme={themeOverride}
        stylesTransform={emotionTransform}
        defaultColorScheme="auto"
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

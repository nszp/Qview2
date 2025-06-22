import { PostHogProvider } from "posthog-js/react";

import { MantineProvider } from "@mantine/core";
import { MantineEmotionProvider, emotionTransform } from "@mantine/emotion";
import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { themeOverride } from "./theme";

import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";

import { routeTree } from "@/routes.ts";

// Biome is bad (for some reason the order of these imports matters)

import { queryClient } from "@/rootRoute.ts";
import type { PostHogConfig } from "posthog-js";

const options: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: "2025-05-24",
};

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  scrollToTopSelectors: ["main"],
  defaultViewTransition: true,
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
      <PostHogProvider
        apiKey={import.meta.env.VITE_POSTHOG_KEY as string}
        options={options}
      >
        <MantineProvider
          theme={themeOverride}
          stylesTransform={emotionTransform}
          defaultColorScheme="auto"
        >
          <MantineEmotionProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
              {/*<ReactQueryDevtools initialIsOpen={false} />*/}
            </QueryClientProvider>
          </MantineEmotionProvider>
        </MantineProvider>
      </PostHogProvider>
    </StrictMode>,
  );
}

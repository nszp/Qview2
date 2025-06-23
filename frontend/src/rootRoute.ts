import * as Layouts from "@/layouts";
import { Loader } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import { createRootRoute } from "@tanstack/react-router";

export const queryClient = new QueryClient();

export const rootRoute = createRootRoute({
  component: Layouts.Shell,
  head: () => ({
    meta: [
      {
        title: "QView",
      },
    ],
  }),
});

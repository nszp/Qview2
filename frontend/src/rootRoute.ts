import { createRootRoute } from "@tanstack/react-router";
import * as Layouts from "@/layouts";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const rootRoute = createRootRoute({
  component: Layouts.Shell,
});

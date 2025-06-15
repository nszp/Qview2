import { createRootRoute } from "@tanstack/react-router";
import * as Layouts from "@/layouts";

export const rootRoute = createRootRoute({
  component: Layouts.Shell,
});

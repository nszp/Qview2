import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/rootRoute.ts";
import { Text } from "@mantine/core";

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    return <Text>saige very good at writing reactact..</Text>;
  },
});

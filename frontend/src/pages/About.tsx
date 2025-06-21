import { rootRoute } from "@/rootRoute.ts";
import { Button, Text } from "@mantine/core";
import { createRoute } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    const posthog = usePostHog();

    return (
      <>
        <Text>hi</Text>
        <Button id="feedback-button">Send Feedback</Button>
      </>
    );
  },
});

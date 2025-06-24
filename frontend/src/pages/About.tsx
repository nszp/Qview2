import { rootRoute } from "@/rootRoute.ts";
import { Button, Flex, Text } from "@mantine/core";
import { createRoute } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    const posthog = usePostHog();

    return (
      <>
        <Flex
          justify="center"
          align="center"
          mb="md"
          direction="column"
          sx={(_, u) => ({
            [u.smallerThan("sm")]: {
              width: "100%",
            },
          })}
        >
          <Text size="xl">About QView</Text>
          <Text size="md" mb="md" c="gray" ta="center">
            Created and designed by Nathaniel S.
            <br />
            with major contributions from Saige Leah S.
            <br />
            (Quiz Summary Engine, livestream embeds, and layout changes)
          </Text>
          <Button id="feedback-button">Send Feedback</Button>
        </Flex>
      </>
    );
  },
});

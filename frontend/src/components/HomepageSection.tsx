import { Flex, Text } from "@mantine/core";
import type * as React from "react";
import type { Ref } from "react";

export function HomepageSection({
  children,
  name,
  ref,
}: React.PropsWithChildren<{ name?: string; ref?: Ref<HTMLDivElement> }>) {
  return (
    <Flex
      justify="center"
      align="center"
      mb="md"
      direction="column"
      ref={ref}
      sx={(_, u) => ({
        [u.smallerThan("sm")]: {
          width: "100%",
        },
      })}
    >
      {name && (
        <Text size="xl" mb="md">
          {name}
        </Text>
      )}
      {children}
    </Flex>
  );
}

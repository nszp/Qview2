import { Flex, Text } from "@mantine/core";

export function HomepageSection({
  children,
  name,
}: React.PropsWithChildren<{ name?: string }>) {
  return (
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
      {name && (
        <Text size="xl" mb="md">
          {name}
        </Text>
      )}
      {children}
    </Flex>
  );
}

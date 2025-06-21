import type { TickertapeRoundData } from "@/types/data.ts";
import { Card, Text } from "@mantine/core";

export default function TickertapeCard({
  round,
}: { round: TickertapeRoundData }) {
  return (
    <Card withBorder shadow="lg" p="md" radius="md">
      <Text ta="center" fw={500} fz="lg">
        {round.room}
      </Text>
    </Card>
  );
}

import type { ScoresheetTeam } from "@/types/data.ts";
import { Box, Card, Flex, Text } from "@mantine/core";

function CardDivider({ color }: { color: string }) {
  return (
    <Card.Section>
      <Flex direction="row" justify="center" py="sm">
        <Box
          w="50%"
          style={{
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: color,
          }}
        />
      </Flex>
    </Card.Section>
  );
}

export default function ScoresheetTeamCard({
  team,
  color,
}: { team: ScoresheetTeam; color: string }) {
  return (
    <Card
      shadow="lg"
      padding="md"
      withBorder
      ta="center"
      sx={(_, u) => ({
        [u.light]: {
          backgroundColor: `${color}3f`, // #rrggbbaa
        },
        [u.dark]: {
          backgroundColor: `${color}2f`, // #rrggbbaa
        },
      })}
    >
      <Text size="md" fw={700}>
        {team.name}
      </Text>
      <CardDivider color={color} />
      <Flex justify="center" align="center" w="100%" direction="column">
        {team.quizzers.map((quizzer) => (
          <Flex justify="space-between" w="100%" key={quizzer.name} gap="xs">
            <Text>{quizzer.name}</Text>
            <Text ta="center">
              {quizzer.totalCorrect}/{quizzer.totalErrors}
            </Text>
          </Flex>
        ))}
      </Flex>
      <CardDivider color={color} />
      <Text size="md" fw={600}>
        {team.place !== 0 &&
          `${team.place === 1 ? "1st" : team.place === 2 ? "2nd" : "3rd"} - `}
        {team.runningScore.reduceRight((previous, current) => {
          if (previous !== "") return previous;
          return current;
        }, "")}{" "}
        points
      </Text>
    </Card>
  );
}

import { tickertapeDataOptions, tournamentDataOptions } from "@/api";
import HomepageCollapsable from "@/components/HomepageCollapsable.tsx";
import {
  roomScheduleRoute,
  roomStreamRoute,
  statGroupIndividualStandingsRoute,
  statGroupTeamStandingsRoute,
} from "@/pages";
import {
  RoomType,
  type StatGroupData,
  type StreamRoomType,
  type TickertapeData,
  type TournamentData,
} from "@/types/data.ts";
import { isQ } from "@/utils/utils.ts";
import {
  Button,
  Card,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

export default function StreamCards() {
  const { data, isPending: isPendingTournament } = useQuery(
    tournamentDataOptions,
  );
  const { data: tickertape, isPending: isPendingTickertape } = useQuery(
    tickertapeDataOptions,
  );

  const roomsList = useMemo(() => {
    const roomsList: Record<StreamRoomType, Set<string>> = {
      Novice: new Set<string>(),
      Experienced: new Set<string>(),
    };
    if (!data || !tickertape) return roomsList;
    const listOfAllRooms = new Set<string>();
    for (const quiz of data.statGroups
      .flatMap((statGroup) => statGroup.teams)
      .flatMap((team) => team.quizzes)) {
      if (quiz.division.includes("Novice")) {
        roomsList.Novice.add(quiz.room);
      } else if (quiz.division.includes("Experienced")) {
        roomsList.Experienced.add(quiz.room);
      }
    }
    return roomsList;
  }, [data, tickertape]);

  if (!data || !tickertape)
    // tournamentData should always be loaded, but tickertape probably hasn't been loaded yet
    return new Array(2).fill(undefined, 0, 2).map((_, index) => (
      <Skeleton key={Number(index)} w="50%" mb="sm">
        <Button size="md" pb="xs"></Button>
      </Skeleton>
    ));

  if (!isQ(data)) return <Text ta="center">This isn't Q???</Text>;

  return (["Experienced", "Novice"] as StreamRoomType[]).map((roomCategory) => (
    <HomepageCollapsable
      openByDefault={false}
      title={roomCategory}
      key={roomCategory}
    >
      <StreamCardGroup
        roomsList={[...roomsList[roomCategory]]}
        roomCategory={roomCategory}
      />
    </HomepageCollapsable>
  ));
}

function StreamCardGroup({
  roomsList,
  roomCategory,
}: { roomsList: string[]; roomCategory: StreamRoomType }) {
  return (
    <SimpleGrid
      cols={{
        base: 1,
        xs: roomsList ? Math.min(2, roomsList.length) : 2,
        lg: roomsList ? Math.min(4, roomsList.length) : 4,
        xl: roomsList ? Math.min(6, roomsList.length) : 6,
      }}
      sx={{
        width: "100%",
      }}
      spacing="sm"
      verticalSpacing="md"
      mb="lg"
    >
      {roomsList.map((room) => (
        <StreamCard room={room} key={room} />
      ))}
    </SimpleGrid>
  );
}

export function StreamCard({ room }: { room: string }) {
  const colorScheme = useComputedColorScheme("light");

  return (
    <Card withBorder shadow="sm" radius="md" p="md">
      <Card.Section inheritPadding pt="sm">
        <Flex justify="center" align="center">
          <Text
            size="md"
            hiddenFrom="sm"
            mb="xs"
            sx={{ whiteSpace: "nowrap", letterSpacing: "-0.02em" }}
          >
            {room}
          </Text>
          <Text
            size="lg"
            visibleFrom="sm"
            mb="xs"
            sx={{ whiteSpace: "nowrap", letterSpacing: "-0.04em" }}
          >
            {room}
          </Text>
        </Flex>
      </Card.Section>
      <Card.Section>
        <SimpleGrid cols={2} spacing="0">
          <Button
            component={Link}
            to={roomScheduleRoute.to}
            // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
            params={{ roomName: room }}
            viewTransition
            variant="outline"
            color="gray"
            radius="0"
            sx={(theme, u) => ({
              borderBottomWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0.5,
              fontWeight: 500,
              color:
                colorScheme === "light"
                  ? theme.colors.gray[9]
                  : theme.colors.dark[0],
              [u.smallerThan("sm")]: {
                fontSize: "13px",
              },
              [u.largerThan("sm")]: {
                fontSize: theme.fontSizes.sm,
              },
            })}
          >
            Schedule
          </Button>

          <Button
            component={Link}
            to={roomStreamRoute.to}
            // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
            params={{ roomName: room }}
            viewTransition
            variant="outline"
            color="gray"
            radius="0"
            sx={(theme, u) => ({
              borderBottomWidth: 0,
              borderRightWidth: 0,
              borderLeftWidth: 0.5,
              fontWeight: 500,
              color:
                colorScheme === "light"
                  ? theme.colors.gray[9]
                  : theme.colors.dark[0],
              [u.smallerThan("sm")]: {
                fontSize: "13px",
              },
              [u.largerThan("sm")]: {
                fontSize: theme.fontSizes.sm,
              },
            })}
          >
            Livestream
          </Button>
        </SimpleGrid>
      </Card.Section>
    </Card>
  );
}

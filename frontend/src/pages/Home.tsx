import { DivisionCard } from "@/components/DivisionCard.tsx";
import { Autocomplete, SimpleGrid, Skeleton } from "@mantine/core";
import { useMemo } from "react";
import { HomepageSection } from "@/components/HomepageSection.tsx";
import { useNavigate } from "react-router";
import { DivisionTeamList } from "@/components/DivisionTeamList.tsx";
import { useTournamentData } from "@/api.ts";

export function Home() {
  const navigate = useNavigate();
  // const data = useContext(DataContext);
  const { isPending, error, data } = useTournamentData();

  const individualsList = useMemo(
    () => [
      ...new Set(
        data?.divisions.flatMap((division) => {
          return division.individuals.map((individual) => individual.name);
        }),
      ),
    ],
    [data?.divisions],
  );

  const teamsList = useMemo(
    () => [
      ...new Set(
        data?.divisions.flatMap((division) => {
          return division.teams.map((team) => team.name);
        }),
      ),
    ],
    [data?.divisions],
  );

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <>
      <HomepageSection name={"Division Standings"}>
        <SimpleGrid
          cols={{
            base: 1,
            xs: data ? Math.min(2, data.divisions.length) : 2,
            lg: data ? Math.min(4, data.divisions.length) : 4,
            xl: data ? Math.min(6, data.divisions.length) : 6,
          }}
          sx={{
            width: "100%",
          }}
          spacing="sm"
          verticalSpacing="md"
        >
          {data?.divisions.map((division) => (
            <DivisionCard division={division} key={division.name} />
          )) ??
            new Array(24).fill(undefined).map((_, index) => (
              <Skeleton radius="md" key={Number(index)}>
                <DivisionCard
                  division={{
                    name: "Loading...", // placeholder so that the skeleton has the same height as a standard card
                    webName: "Loading...",
                    individuals: [],
                    teams: [],
                  }}
                />
              </Skeleton>
            ))}
        </SimpleGrid>
      </HomepageSection>
      <HomepageSection name={"Search"}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} w="100%">
          <Skeleton visible={isPending}>
            <Autocomplete
              label="Search Individuals"
              description="See stats for an individual across all divisions"
              placeholder="Enter a person's name..."
              flex="1"
              data={individualsList}
              onOptionSubmit={(individual) => {
                navigate(`/stats/individual/${encodeURIComponent(individual)}`);
              }}
              styles={{
                label: {
                  textAlign: "center",
                  width: "100%",
                },
                description: {
                  textAlign: "center",
                  width: "100%",
                },
              }}
              mb="none"
            />
          </Skeleton>
          <Skeleton visible={isPending}>
            <Autocomplete
              label="Search Teams"
              description="See stats for a team across all divisions"
              placeholder="Enter a team name..."
              flex="1"
              data={teamsList}
              onOptionSubmit={(team) => {
                navigate(`/stats/team/${encodeURIComponent(team)}`);
              }}
              styles={{
                label: {
                  textAlign: "center",
                  width: "100%",
                },
                description: {
                  textAlign: "center",
                  width: "100%",
                },
              }}
              mb="none"
            />
          </Skeleton>
        </SimpleGrid>
      </HomepageSection>
      <HomepageSection name={"Team Schedules"}>
        {data?.divisions.map((division) => (
          <DivisionTeamList division={division} key={division.name} />
        )) ?? <Skeleton height={256} radius="md" mb="md" w="100%" />}
      </HomepageSection>
    </>
  );
}

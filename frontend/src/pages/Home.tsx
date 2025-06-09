import { DivisionCard } from "@/components/DivisionCard.tsx";
import { DataContext } from "@/context.ts";
import { Autocomplete, SimpleGrid } from "@mantine/core";
import { useContext } from "react";
import { HomepageSection } from "@/components/HomepageSection.tsx";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();
  const data = useContext(DataContext);
  // const colorScheme = useComputedColorScheme("light");

  const individualsList = [
    ...new Set(
      data.divisions.flatMap((division) => {
        return division.individuals.map((individual) => individual.name);
      }),
    ),
  ];

  const teamsList = [
    ...new Set(
      data.divisions.flatMap((division) => {
        return division.teams.map((team) => team.name);
      }),
    ),
  ];

  return (
    <>
      <HomepageSection name={"Division Standings"}>
        <SimpleGrid
          cols={{
            base: 1,
            xxs: Math.min(2, data.divisions.length),
            md: Math.min(4, data.divisions.length),
            lg: Math.min(6, data.divisions.length),
          }}
          sx={{
            width: "100%",
          }}
          spacing="sm"
          verticalSpacing="md"
        >
          {data.divisions.map((division) => (
            <DivisionCard division={division} key={division.name} />
          ))}
        </SimpleGrid>
      </HomepageSection>
      <HomepageSection name={"Search"}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} w="100%">
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
        </SimpleGrid>
      </HomepageSection>
      <HomepageSection name={"Team Schedules"}></HomepageSection>
    </>
  );
}

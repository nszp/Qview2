import { DivisionCard } from "@/components/DivisionCard.tsx";
import { DataContext } from "@/context.ts";
import {
  Button,
  Flex,
  SimpleGrid,
  TextInput,
  useComputedColorScheme,
} from "@mantine/core";
import { useContext } from "react";
import { HomepageSection } from "@/components/HomepageSection.tsx";

export function Home() {
  const data = useContext(DataContext);
  const colorScheme = useComputedColorScheme("light");

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
        <form
          onSubmit={(values) => {
            console.log("Search submitted for:", values);
          }}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <Flex justify="center" align="flex-end" gap="sm" w="100%">
            <TextInput
              label="Search Individuals"
              description="See stats for an individual across all divisions"
              placeholder="Enter a person's name..."
              flex="1"
            />
            <Button
              variant="default"
              c={colorScheme === "dark" ? "white" : "black"}
            >
              Search
            </Button>
          </Flex>
        </form>
        <form
          onSubmit={(values) => {
            console.log("Search submitted for:", values);
          }}
          style={{ width: "100%" }}
        >
          <Flex justify="center" align="flex-end" gap="sm" w="100%">
            <TextInput
              label="Search Teams"
              description="See stats for a team across all divisions"
              placeholder="Enter a team name..."
              flex="1"
            />
            <Button
              variant="default"
              c={colorScheme === "dark" ? "white" : "black"}
            >
              Search
            </Button>
          </Flex>
        </form>
      </HomepageSection>
      <HomepageSection name={"Team Schedules"}></HomepageSection>
    </>
  );
}

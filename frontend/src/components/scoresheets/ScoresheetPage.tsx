import ScoresheetTable from "@/components/scoresheets/ScoresheetTable.tsx";
import ScoresheetTeamCard from "@/components/scoresheets/ScoresheetTeamCard.tsx";
import { ScoresheetTeamIcon } from "@/components/scoresheets/ScoresheetTeamIcon.tsx";
import ScoresheetTimeline from "@/components/scoresheets/ScoresheetTimeline.tsx";
import { theme } from "@/theme.ts";
import type { Scoresheet } from "@/types/data.ts";
import { getTeamColorsForTeamCount } from "@/utils/styleUtils.ts";
import { Flex, SegmentedControl, SimpleGrid, Text } from "@mantine/core";
import * as React from "react";
import { useState } from "react";

export default function ScoresheetPage({ data }: { data: Scoresheet }) {
  const teamColors = data ? getTeamColorsForTeamCount(data.teams.length) : [];
  const [selectedDisplay, setSelectedDisplay] = useState("timeline");

  return (
    <>
      <Flex
        justify="center"
        align="center"
        direction="column"
        sx={(_, u) => ({
          [u.smallerThan("sm")]: {
            width: "100%",
          },
        })}
      >
        <Text size="xl" ta="center">
          {data.room} {data.round}
        </Text>
        <Text size="md" mb="md" c="gray" ta="center">
          {data.tournament} {data.division}
          <br />
          {data.teams.length === 2 ? (
            <>
              <ScoresheetTeamIcon
                color={theme.colors.red[6]}
                size={16}
                style={{ marginRight: "2.5px" }}
              />
              <span style={{ marginLeft: "2.5px" }}>{data.teams[0].name}</span>
              &nbsp;vs.&nbsp;
              <ScoresheetTeamIcon
                color={theme.colors.green[6]}
                size={16}
                style={{ marginRight: "2.5px" }}
              />
              <span style={{ marginLeft: "2.5px" }}>{data.teams[1].name}</span>
            </>
          ) : (
            <>
              <ScoresheetTeamIcon
                color={theme.colors.red[6]}
                size={16}
                style={{ marginRight: "2.5px" }}
              />
              <span style={{ marginLeft: "2.5px" }}>{data.teams[0].name}</span>
              &nbsp;vs.&nbsp;
              <ScoresheetTeamIcon
                color={theme.colors.blue[5]}
                size={16}
                style={{ marginRight: "2.5px" }}
              />
              <span style={{ marginLeft: "2.5px" }}>{data.teams[1].name}</span>
              &nbsp;vs.&nbsp;
              <ScoresheetTeamIcon
                color={theme.colors.green[6]}
                size={16}
                style={{ marginRight: "2.5px" }}
              />
              <span style={{ marginLeft: "2.5px" }}>{data.teams[2].name}</span>
            </>
          )}
        </Text>

        <SegmentedControl
          visibleFrom="sm"
          value={selectedDisplay}
          onChange={setSelectedDisplay}
          size="md"
          data={[
            { label: "Modern Timeline", value: "timeline" },
            { label: "Legacy Scoresheet", value: "legacy" },
          ]}
          mb="md"
        />

        <SimpleGrid
          spacing="md"
          pt="sm"
          pb="md"
          cols={{ base: 1, sm: data.teams.length }}
          sx={(_, u) => ({
            [u.smallerThan("sm")]: {
              width: "100%",
            },
            [u.largerThan("sm")]: {
              minWidth: "36em",
            },
          })}
        >
          {data.teams.map((team, index) => (
            <ScoresheetTeamCard
              team={team}
              key={Number(index)}
              color={teamColors[index]}
              minTeamHeight={Math.max(
                ...data.teams.map((team) => team.quizzers.length),
              )}
            />
          ))}
        </SimpleGrid>

        <SegmentedControl
          hiddenFrom="sm"
          value={selectedDisplay}
          onChange={setSelectedDisplay}
          size="md"
          data={[
            { label: "Modern Timeline", value: "timeline" },
            { label: "Legacy Scoresheet", value: "legacy" },
          ]}
          mb="md"
        />
      </Flex>
      {selectedDisplay === "timeline" && <ScoresheetTimeline data={data} />}
      {selectedDisplay === "legacy" && <ScoresheetTable data={data} />}
    </>
  );
}

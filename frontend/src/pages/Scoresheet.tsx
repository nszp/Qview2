import { scoresheetDataOptions } from "@/api.ts";
import ScoresheetTeamCard from "@/components/ScoresheetTeamCard.tsx";
import { ScoresheetTeamIcon } from "@/components/ScoresheetTeamIcon.tsx";
import ScoresheetTimeline from "@/components/ScoresheetTimeline.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { theme } from "@/theme.ts";
import { getTeamColorsForTeamCount } from "@/utils/styleUtils.ts";
import {
  Flex,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Text,
} from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";

export const scoresheetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rounds/$roundNumber/scoresheet",
  loader: ({ params: { roundNumber } }) =>
    // TODO: can this check for NaN?
    queryClient.ensureQueryData(scoresheetDataOptions(roundNumber)),
  component: function Scoresheet() {
    const { roundNumber: _roundNumber } = scoresheetRoute.useParams();
    const { isLoading, error, data } = useSuspenseQuery(
      scoresheetDataOptions(_roundNumber),
    );

    const roundNumber = Number.parseInt(_roundNumber || "");

    if (Number.isNaN(roundNumber)) {
      return <Navigate to="/" replace />;
    }

    if (data) {
      data.tournament ??= "Q2024";
      // TODO: remove when data gets updated
    }

    const teamColors = getTeamColorsForTeamCount(data.teams.length);

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
          <Skeleton visible={!data}>
            <Text size="xl" ta="center">
              {data.room} {data.round}
            </Text>
          </Skeleton>
          <Text size="md" mb="md" c="gray" ta="center">
            {isLoading && " Loading..."}
            {error && ` Error: ${error.message}`}
            {data && (
              <>
                {data.tournament} {data.division}
                <br />
                {data.teams.length === 2 ? (
                  <>
                    <ScoresheetTeamIcon
                      color={theme.colors.red[6]}
                      size={16}
                      mr="2.5px"
                    />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[0].name}
                    </span>
                    &nbsp;vs.&nbsp;
                    <ScoresheetTeamIcon
                      color={theme.colors.green[6]}
                      size={16}
                      mr="2.5px"
                    />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[1].name}
                    </span>
                  </>
                ) : (
                  <>
                    <ScoresheetTeamIcon
                      color={theme.colors.red[6]}
                      size={16}
                      mr="2.5px"
                    />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[0].name}
                    </span>
                    &nbsp;vs.&nbsp;
                    <ScoresheetTeamIcon
                      color={theme.colors.blue[5]}
                      size={16}
                      mr="2.5px"
                    />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[1].name}
                    </span>
                    &nbsp;vs.&nbsp;
                    <ScoresheetTeamIcon
                      color={theme.colors.green[6]}
                      size={16}
                      mr="2.5px"
                    />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[2].name}
                    </span>
                  </>
                )}
              </>
            )}
          </Text>

          <SegmentedControl
            value={selectedDisplay}
            onChange={setSelectedDisplay}
            data={[
              { label: "Modern Timeline", value: "timeline" },
              { label: "Legacy Scoresheet", value: "legacy" },
            ]}
            mb="md"
          />

          {data && (
            <SimpleGrid
              spacing="md"
              pt="sm"
              pb="md"
              cols={{ base: 1, sm: data.teams.length }}
            >
              {data.teams.map((team, index) => (
                <ScoresheetTeamCard
                  team={team}
                  key={Number(index)}
                  color={teamColors[index]}
                />
              ))}
            </SimpleGrid>
          )}

          {selectedDisplay === "timeline" && <ScoresheetTimeline data={data} />}
          {/*selectedDisplay === "legacy" && <ScoresheetTable data={data} />*/}
        </Flex>
      </>
    );
  },
});

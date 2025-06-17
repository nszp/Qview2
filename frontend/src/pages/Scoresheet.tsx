import { scoresheetDataOptions } from "@/api.ts";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute, Navigate } from "@tanstack/react-router";
import ScoresheetTimeline from "@/components/ScoresheetTimeline.tsx";
import { Flex, SegmentedControl, Skeleton, Text } from "@mantine/core";
import { ScoresheetTeamIcon } from "@/components/ScoresheetTeamIcon.tsx";
import { useState } from "react";
import ScoresheetTable from "@/components/ScoresheetTable.tsx";

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
                    <ScoresheetTeamIcon color={"red"} size={16} mr="2.5px" />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[0].name}
                    </span>
                    &nbsp;vs.&nbsp;
                    <ScoresheetTeamIcon
                      color={"limegreen"}
                      size={16}
                      mr="2.5px"
                    />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[1].name}
                    </span>
                  </>
                ) : (
                  <>
                    <ScoresheetTeamIcon color={"red"} size={16} mr="2.5px" />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[0].name}
                    </span>
                    &nbsp;vs.&nbsp;
                    <ScoresheetTeamIcon color={"blue"} size={16} mr="2.5px" />
                    <span style={{ marginLeft: "2.5px" }}>
                      {data.teams[1].name}
                    </span>
                    &nbsp;vs.&nbsp;
                    <ScoresheetTeamIcon
                      color={"limegreen"}
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

          {selectedDisplay === "timeline" && <ScoresheetTimeline data={data} />}
          {selectedDisplay === "legacy" && <ScoresheetTable data={data} />}
        </Flex>
      </>
    );
  },
});

import { createRoute, Navigate } from "@tanstack/react-router";
import { Flex, Text, Timeline, List } from "@mantine/core";
import { scoresheetDataOptions } from "@/api.ts";
import {
  convertScoresheetToQuestionSummaries,
  eventTypeToPointDifference,
} from "@/utils/scoresheet.ts";
import { useMemo } from "react";
import { ScoresheetTeamIcon } from "@/components/ScoresheetTeamIcon.tsx";
import ScoresheetTimelineBullet from "@/components/ScoresheetTimelineBullet.tsx";
import { rootRoute } from "@/rootRoute.ts";
import { queryClient } from "@/main.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";

export const scoresheetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rounds/$roundNumber/scoresheet",
  loader: ({ params: { roundNumber } }) =>
    // TODO: can this check for NaN?
    queryClient.ensureQueryData(scoresheetDataOptions(roundNumber)),
  component: function Scoresheet() {
    const { roundNumber: _roundNumber } = scoresheetRoute.useParams();
    const { isPending, error, data } = useSuspenseQuery(
      scoresheetDataOptions(_roundNumber),
    );

    const roundNumber = Number.parseInt(_roundNumber || "");

    if (Number.isNaN(roundNumber)) {
      return <Navigate to="/" replace />;
    }

    const summaries = useMemo(() => {
      return data ? convertScoresheetToQuestionSummaries(data) : undefined;
    }, [data]);

    if (data) {
      data.tournament ??= "Q2024";
      // TODO: remove when data gets updated
    }

    return (
      <>
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
          {data && (
            // TODO: skeleton this ?
            <Text size="xl">
              {data.room} {data.round}
            </Text>
          )}
          <Text size="md" mb="md" c="gray" ta="center">
            {isPending && " Loading..."}
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
                  <></>
                )}
              </>
            )}
          </Text>

          {/*
        After the above short team list, there should be a card for each team. The team color should be incorporated in some way
        Header: Team Name - Total Score
        Body: List of quizzers with their scores in {correct}/{incorrect} format
        Footer: 1st 2nd or 3rd place

        This card structure is flexible but should contain all of this information
        */}

          <Timeline
            bulletSize={24}
            styles={{
              itemBullet: {
                width: "unset",
                height: "unset",
                border: "unset",
              },
            }}
          >
            {summaries?.map((summary) => {
              // Timeline: Bullet becomes a ScoresheetTeamIcon of primary team color with the question number embedded in the middle
              // Remove active line color, get the color from the primary team when rendering the bullet

              // Title is bold
              //
              let title = "";
              if (summary.questionNumber === 21 && summary.type === "correct") {
                // tiebreaker
                title = `${summary.primaryTeam} wins the tiebreaker!`;
              } else if (summary.type === "correct") {
                title = `${summary.primaryQuizzer} from ${summary.primaryTeam.name} answered correctly!`; // primaryQuizzer [correct] (different darker green badge)
              } else if (summary.type === "incorrect") {
                title = `${summary.primaryQuizzer} from ${summary.primaryTeam.name} answered incorrectly.`; // primaryQuizzer [error] (different darker red badge)
              } else if (summary.type === "nojump") {
                title = `No jump for question ${summary.questionNumber}`;
              }

              // Timeline item should look like this for an incorrect question:
              // [secondaryTeamColor Icon] secondaryQuizzer [correct bonus] (same darker green badge)
              // [secondaryTeamColor Icon] secondaryQuizzer [incorrect bonus] (same darker red badge)
              // [primaryTeamColor Icon] Third Person [bonus] (different colored badge or something?)
              // [primaryTeamColor Icon] Quiz Out Without Error [bonus] (same different colored badge or something?)
              // [primaryTeamColor Icon] Error Out [penalty] (another different colored badge or something?)

              // Under all that we need to display the running scores if they have changed

              return (
                <Timeline.Item
                  title={title}
                  key={summary.questionNumber}
                  bullet={
                    <ScoresheetTimelineBullet
                      teamColor={
                        "primaryTeam" in summary
                          ? summary.primaryTeam.color
                          : "gray"
                      }
                      questionNumber={summary.questionNumber}
                    />
                  }
                >
                  <Text>
                    {summary.questionNumber === 21
                      ? "OT"
                      : `Question ${summary.questionNumber}`}
                  </Text>
                  <List>
                    {summary.type === "incorrect"
                      ? summary.bonuses?.map((bonus) => (
                          <List.Item key={bonus.secondaryQuizzer}>
                            {bonus.secondaryQuizzer} from{" "}
                            {bonus.secondaryTeam.name} answered{" "}
                            {bonus.correct ? "correctly" : "incorrectly"}.
                          </List.Item>
                        ))
                      : undefined}

                    {summary.additionalEvents
                      .map((event) => {
                        const eventPointDifference =
                          eventTypeToPointDifference[event.type];
                        switch (event.type) {
                          case "perfectQuizout":
                            return `${event.quizzer} scored a perfect quizout! (+${eventPointDifference})`;
                          default:
                            return `Unknown event type: ${event.type} (${eventPointDifference >= 0 ? "+" : ""}${eventPointDifference})`;
                        }
                      })
                      .map((eventText, eventIndex) => {
                        if (typeof eventText !== "string") return eventText;
                        return (
                          <List.Item key={Number(eventIndex)}>
                            {eventText}
                          </List.Item>
                        );
                      })}
                  </List>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </Flex>
      </>
    );
  },
});

import { Navigate, useNavigate, useParams } from "react-router";
import { Flex, Text, Timeline, List } from "@mantine/core";
import { useScoresheetData } from "@/api.ts";
import {
  convertScoresheetToQuestionSummaries,
  eventTypeToPointDifference,
} from "@/utils/scoresheet.ts";
import { useMemo } from "react";
import { Circle } from "lucide-react";
import { ScoresheetTeamIcon } from "@/components/ScoresheetTeamIcon.tsx";

export function Scoresheet() {
  const { roundNumber: _roundNumber } = useParams<{ roundNumber: string }>();
  const roundNumber = Number.parseInt(_roundNumber || "");

  if (Number.isNaN(roundNumber)) {
    return <Navigate to="/" replace />;
  }

  const { isPending, error, data } = useScoresheetData(roundNumber);

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
              <br/>
              { data.teams.length === 2 ? (
                <>
                  <ScoresheetTeamIcon color={"red"} size={16} mr="2.5px"/>
                  <span style={{ marginLeft: "2.5px" }}>

                    { data.teams[0].name }
                  </span>
                  &nbsp;vs.&nbsp;
                  <ScoresheetTeamIcon color={"limegreen"} size={16} mr="2.5px"/>
                    <span style={{ marginLeft: "2.5px" }}>

                      { data.teams[1].name }
                    </span>
                </>
              ) : (
                <></>
              ) }
            </>
          )}
        </Text>

        <Timeline active={(summaries?.length ?? 1) - 1}>
          {summaries?.map((summary) => {
            // Timeline: Bullet becomes a ScoresheetTeamIcon of primary team color with the question number embedded in the middle
            // Remove active line color, get the color from the primary team when rendering the bullet
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

            return (
              <Timeline.Item title={title} key={summary.questionNumber}>
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
}

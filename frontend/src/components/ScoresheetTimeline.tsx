import { Badge, Box, Flex, List, Text, Timeline } from "@mantine/core";
import { ScoresheetTeamIcon } from "@/components/ScoresheetTeamIcon.tsx";
import { type JSX, useMemo } from "react";
import ScoresheetTimelineBullet from "@/components/ScoresheetTimelineBullet.tsx";
import ScoresheetAdditionalEvents from "@/components/ScoresheetAdditionalEvents.tsx";
import type { Scoresheet } from "@/types/data.ts";
import { convertScoresheetToQuestionSummaries } from "@/utils/summaryEngine.ts";

export default function ScoresheetTimeline({ data }: { data: Scoresheet }) {
  const summaries = useMemo(() => {
    return data ? convertScoresheetToQuestionSummaries(data) : undefined;
  }, [data]);

  return (
    <Flex
      mb="md"
      justify="center"
      align="center"
      direction="column"
      w="100%"
      px="xl"
    >
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
          itemBody: {
            paddingTop: "4px",
          },
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
          let title: string | JSX.Element = "";
          if (
            summary.questionNumber === 21 &&
            (summary.type === "correct" || summary.type === "incorrect")
          ) {
            // tiebreaker
            if (summary.type === "correct") {
              title = `${summary.primaryQuizzer} won the round for ${summary.primaryTeam.name}!`;
            } else {
              title = `${summary.primaryQuizzer} lost the round for ${summary.primaryTeam.name}.`;
            }
          } else if (summary.type === "correct") {
            title = (
              <>
                {summary.primaryQuizzer}{" "}
                <Badge color="green.8" autoContrast>
                  Correct
                </Badge>
              </>
            ); // primaryQuizzer [correct] (different darker green badge)
          } else if (summary.type === "incorrect") {
            title = (
              <>
                {summary.primaryQuizzer}{" "}
                <Badge color="red.8" autoContrast>
                  Error
                </Badge>
              </>
            ); // primaryQuizzer [error] (different darker red badge)
          } else if (summary.type === "nojump") {
            title = "No one jumped.";
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
              title={<span style={{ fontWeight: 700 }}>{title}</span>}
              key={summary.questionNumber}
              bullet={
                <ScoresheetTimelineBullet
                  questionResult={summary.type}
                  questionNumber={
                    summary.questionNumber === 21
                      ? "OT"
                      : summary.questionNumber
                  }
                />
              }
            >
              <List>
                {summary.type === "incorrect"
                  ? summary.bonuses?.map((bonus) => (
                      <List.Item key={bonus.secondaryQuizzer}>
                        <ScoresheetTeamIcon
                          color={bonus.secondaryTeam.color}
                          size={16}
                        />
                        {bonus.secondaryQuizzer}{" "}
                        {bonus.correct ? (
                          <Badge color="green.8" autoContrast>
                            Correct Bonus
                          </Badge>
                        ) : (
                          <Badge color="red.8" autoContrast>
                            Error Bonus
                          </Badge>
                        )}
                      </List.Item>
                    ))
                  : undefined}

                <ScoresheetAdditionalEvents summary={summary} />
              </List>
            </Timeline.Item>
          );
        })}
      </Timeline>
      <Text c="gray.7" pt="xl">
        Powered by the Quiz Summary Engine.
      </Text>
      {/* puppy! */}
    </Flex>
  );
}

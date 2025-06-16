import {
  type QuestionSummary,
  eventTypeToPointDifference,
} from "@/utils/summaryEngine.ts";
import { List } from "@mantine/core";
import type { JSX } from "react";

function narrowNotNoJump(
  summary: QuestionSummary,
): summary is Exclude<QuestionSummary, { type: "nojump" }> {
  return summary.type !== "nojump";
}

export default function ScoresheetAdditionalEvents({
  summary,
}: { summary: QuestionSummary }) {
  return summary.additionalEvents
    .map((event): string | JSX.Element => {
      const eventPointDifference = eventTypeToPointDifference[event.type];
      switch (event.type) {
        case "bonus":
          if (narrowNotNoJump(summary)) {
            const numbered =
              event.bonusNumber === 3 ? "3rd" : `${event.bonusNumber}th`;
            return `${summary.primaryTeam.name} got a bonus for their ${numbered} quizzer answering! (+${eventPointDifference})`;
          }
          break;
        case "perfectQuizout":
          if (narrowNotNoJump(summary)) {
            return `${summary.primaryQuizzer} scored a perfect quizout! (+${eventPointDifference})`;
          }
          break;
        case "errorAfterSixteen":
          if (narrowNotNoJump(summary)) {
            return `Error on or after 16th question. (${eventPointDifference})`;
          }
          break;
        case "errorOut":
          if (narrowNotNoJump(summary)) {
            return `${summary.primaryQuizzer} errored out. (${eventPointDifference})`;
          }
          break;
        case "fifthError":
          if (narrowNotNoJump(summary)) {
            return `Fifth error for ${summary.primaryTeam.name}. (${eventPointDifference})`;
          }
          break;
        case "secondFoulOrOverruledChallenge":
          if (narrowNotNoJump(summary)) {
            return `Second foul or overruled challenge for ${summary.primaryTeam.name}. (${eventPointDifference})`;
          }
          break;
        default:
          return `Unknown event type: ${event.type} (${eventPointDifference >= 0 ? "+" : ""}${eventPointDifference})`;
      }
    })
    .map((eventText, eventIndex) => {
      if (typeof eventText !== "string") return eventText;
      return <List.Item key={Number(eventIndex)}>{eventText}</List.Item>;
    });
}

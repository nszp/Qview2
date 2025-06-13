import type {
  Scoresheet,
  ScoresheetQuizzer,
  ScoresheetTeam,
} from "@/types/data.ts";

export type QuestionSummaryTeam = { name: string; color: string };

export type QuestionSummaryEvent =
  | {
      type: "bonus"; // +10 points
      bonusNumber: 3 | 4 | 5;
    }
  | {
      type: "perfectQuizout"; // +10 points
      quizzer: string;
    }
  | {
      type: "errorOut"; // -10 points
    }
  | {
      type: "fifthError"; // -10 points
    }
  | {
      type: "errorAfterSixteen"; // -10 points, on or after 16th question
    }
  | {
      type: "secondFoul"; // -10 points, if penalty points match to nothing else AND check total fouls of team
    };

export const eventTypeToPointDifference: Record<
  QuestionSummaryEvent["type"],
  number
> = {
  bonus: 10,
  perfectQuizout: 10,
  errorOut: -10,
  fifthError: -10,
  errorAfterSixteen: -10,
  secondFoul: -10,
};

export type QuestionSummary = {
  questionNumber: number;
  additionalEvents: QuestionSummaryEvent[];
  runningScores: (QuestionSummaryTeam & { runningScore: number })[]; // after all points of the question have been applied
} & (
  | ({
      primaryQuizzer: string;
      primaryTeam: QuestionSummaryTeam;
    } & (
      | {
          type: "correct";
        }
      | {
          type: "incorrect";
          bonuses: {
            secondaryQuizzer: string;
            secondaryTeam: QuestionSummaryTeam;
            correct: boolean;
          }[];
        }
    ))
  | { type: "nojump" }
);

export function convertScoresheetToQuestionSummaries(
  scoresheet: Scoresheet,
): QuestionSummary[] {
  const questionSummaries: QuestionSummary[] = new Array(21);
  const quizzersAnsweredTeamCount: Map<
    ScoresheetTeam,
    Set<ScoresheetQuizzer>
  > = scoresheet.teams.reduce((previousValue, currentTeam) => {
    previousValue.set(currentTeam, new Set<ScoresheetQuizzer>());
    return previousValue;
  }, new Map());

  for (let questionIndex = 0; questionIndex < 21; questionIndex++) {
    const questionNumber = questionIndex + 1;
    const additionalEvents: QuestionSummaryEvent[] = [];

    questionSummaries[questionIndex] = {
      type: "nojump",
      questionNumber,
      additionalEvents,
      runningScores: scoresheet.teams.map((t) => ({
        name: t.name,
        color: t.color,
        runningScore: findMostRecentRunningScore(t.runningScore, questionIndex),
      })),
    };

    if (questionNumber === 21) {
      // tiebreaker question
      const tiebreakerWinner = searchForValues(questionIndex, "C", scoresheet);
      if (tiebreakerWinner) {
        const [team, quizzer] = tiebreakerWinner;
        quizzersAnsweredTeamCount.get(team)?.add(quizzer);
        questionSummaries[questionIndex] = {
          questionNumber,
          type: "correct",
          primaryQuizzer: quizzer.name,
          primaryTeam: {
            name: team.name,
            color: team.color,
          },
          additionalEvents,
          runningScores: scoresheet.teams.map((t) => ({
            name: t.name,
            color: t.color,
            runningScore: findMostRecentRunningScore(
              t.runningScore,
              questionIndex,
            ),
          })),
        };
      } else {
        questionSummaries.pop(); // remove the last question, which should be 21 (index 20)
      }
    }

    // check for toss-up correct
    const tossupCorrect = searchForValues(
      questionIndex,
      ["20", "30"],
      scoresheet,
    );
    if (tossupCorrect) {
      const [team, quizzer] = tossupCorrect;
      quizzersAnsweredTeamCount.get(team)?.add(quizzer);

      if (quizzer.questions[questionIndex] === "30") {
        // quizout
        additionalEvents.push({
          type: "perfectQuizout",
          quizzer: quizzer.name,
        });
      }

      questionSummaries[questionIndex] = {
        questionNumber,
        type: "correct",
        primaryQuizzer: quizzer.name,
        primaryTeam: {
          name: team.name,
          color: team.color,
        },
        additionalEvents,
        runningScores: scoresheet.teams.map((t) => ({
          name: t.name,
          color: t.color,
          runningScore: findMostRecentRunningScore(
            t.runningScore,
            questionIndex,
          ),
        })),
      };
      continue;
    }
    // check for error
    const error = searchForValues(questionIndex, ["E", "-10"], scoresheet);
    if (error) {
      const [team, quizzer] = error;

      const bonuses = [];
      const errorBonus = searchForValues(questionIndex, ["B", "/"], scoresheet);
      if (errorBonus) {
        const [secondaryTeam, secondaryQuizzer] = errorBonus;
        bonuses.push({
          secondaryQuizzer: secondaryQuizzer.name,
          secondaryTeam: {
            name: secondaryTeam.name,
            color: secondaryTeam.color,
          },
          correct: secondaryQuizzer.questions[questionIndex] === "B",
        });

        // check for third team if necessary
        if (scoresheet.teams.length === 3) {
          const errorBonus2 = searchForValues(
            questionIndex,
            ["B", "/"],
            scoresheet,
            [secondaryTeam],
          );
          if (errorBonus2) {
            const [thirdTeam, thirdQuizzer] = errorBonus2;
            bonuses.push({
              secondaryQuizzer: thirdQuizzer.name,
              secondaryTeam: {
                name: thirdTeam.name,
                color: thirdTeam.color,
              },
              correct: thirdQuizzer.questions[questionIndex] === "B",
            });
          }
        }
      }

      questionSummaries[questionIndex] = {
        type: "incorrect",
        questionNumber,
        primaryQuizzer: quizzer.name,
        primaryTeam: {
          name: team.name,
          color: team.color,
        },
        additionalEvents,
        bonuses,
        runningScores: scoresheet.teams.map((t) => ({
          name: t.name,
          color: t.color,
          runningScore: findMostRecentRunningScore(
            t.runningScore,
            questionIndex,
          ),
        })),
      };
      continue;
    }
  }

  return questionSummaries;
}

function searchForValues(
  questionIndex: number,
  outcomes: string | string[],
  scoresheet: Scoresheet,
  skippedTeams: ScoresheetTeam[] = [],
): false | [ScoresheetTeam, ScoresheetQuizzer] {
  // returns a tuple of [team, quizzer] if a matching outcome is found, otherwise false
  const outcomesArray = Array.isArray(outcomes) ? outcomes : [outcomes];
  for (const team of scoresheet.teams) {
    if (skippedTeams.includes(team)) continue; // skip teams that have already been checked
    for (const quizzer of team.quizzers) {
      const quizzerResult = quizzer.questions[questionIndex];
      if (quizzerResult && outcomesArray.includes(quizzerResult)) {
        return [team, quizzer];
      }
    }
  }
  return false;
}

function findMostRecentRunningScore(
  runningScores: string[],
  questionIndex: number,
) {
  // go backwards from the current index until the score !== ""
  for (let i = questionIndex; i >= 0; i--) {
    if (runningScores[i] !== "") {
      return Number(runningScores[i]);
    }
  }
  return 0; // if no score is found, return 0
}

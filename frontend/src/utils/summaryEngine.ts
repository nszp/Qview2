import type {
  Scoresheet,
  ScoresheetQuizzer,
  ScoresheetTeam,
} from "@/types/data.ts";
import { getTeamColorsForTeamCount } from "@/utils/styleUtils.ts";

export type QuestionSummaryTeam = { name: string; color: string };

export type QuestionSummaryEvent =
  | {
      type: "bonus"; // +10 points (done)
      bonusNumber: 3 | 4 | 5;
    }
  | {
      type: "perfectQuizout"; // +10 points (done)
    }
  | {
      type: "errorOut"; // -10 points, 3rd error by individual (done)
    }
  | {
      type: "fifthError"; // -10 points, 5th error by team and every error after (done)
    }
  | {
      type: "errorAfterSixteen"; // -10 points, on or after the 16th question (done)
    }
  | {
      type: "secondFoulOrOverruledChallenge"; // -10 points, if penalty points match to nothing else AND check total fouls of team is >= 2
      // multiple fouls can occur in one question, making the penalty points == foulsInQuestion * -10
      // could also be an overruled challenge
      team: ScoresheetTeam; // (done)
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
  secondFoulOrOverruledChallenge: -10,
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
  const sumOfAllPlaces = scoresheet.teams.reduce(
    (previousValue, team) => previousValue + team.place,
    0,
  );
  // if all teams have a place of 0, then the round is incomplete

  const furthestQuestionIndexAsked = scoresheet.teams.reduce(
    (previousValue, team) => {
      const furthestQuestionTeamAnswered = team.quizzers.reduce(
        (previous, quizzer) => {
          let furthestQuestionAnswered = 0;
          for (let i = quizzer.questions.length - 1; i >= 0; i--) {
            const question = quizzer.questions[i];
            if (question !== "") {
              furthestQuestionAnswered = i;
              break;
            }
          }
          return Math.max(previous, furthestQuestionAnswered);
        },
        0,
      );
      return Math.max(previousValue, furthestQuestionTeamAnswered);
    },
    0,
  );

  const questionSummaries: QuestionSummary[] = new Array(
    sumOfAllPlaces === 0 ? furthestQuestionIndexAsked + 1 : 21,
  );
  const quizzersAnsweredTeamCount: Map<
    ScoresheetTeam,
    Set<ScoresheetQuizzer>
  > = scoresheet.teams.reduce((previousValue, currentTeam) => {
    previousValue.set(currentTeam, new Set<ScoresheetQuizzer>());
    return previousValue;
  }, new Map());

  const teamColors = getTeamColorsForTeamCount(scoresheet.teams.length);
  const teamToTeamColor = scoresheet.teams.reduce(
    (previousValue, currentTeam, teamIndex) => {
      previousValue.set(currentTeam, teamColors[teamIndex]);
      return previousValue;
    },
    new Map<ScoresheetTeam, string>(),
  );

  for (
    let questionIndex = 0;
    questionIndex < questionSummaries.length;
    questionIndex++
  ) {
    const questionNumber = questionIndex + 1;
    const additionalEvents: QuestionSummaryEvent[] = [];
    const expectedBonusPenaltyPoints = scoresheet.teams.reduce(
      (previousValue, currentTeam) => {
        previousValue.set(currentTeam, 0);
        return previousValue;
      },
      new Map<ScoresheetTeam, number>(),
    );

    function addBonusPenaltyPoints(team: ScoresheetTeam, bonus: number) {
      const previousBonus = expectedBonusPenaltyPoints.get(team) ?? 0;
      expectedBonusPenaltyPoints.set(team, previousBonus + bonus);
    }

    questionSummaries[questionIndex] = {
      type: "nojump",
      questionNumber,
      additionalEvents,
      runningScores: scoresheet.teams.map((t) => ({
        name: t.name,
        color: teamToTeamColor.get(t) ?? "black",
        runningScore: findMostRecentRunningScore(t.runningScore, questionIndex),
      })),
    };

    if (questionNumber === 21) {
      // tiebreaker question
      const tiebreaker = searchForValues(questionIndex, ["C", "E"], scoresheet);
      if (tiebreaker) {
        const [team, quizzer] = tiebreaker;
        questionSummaries[questionIndex] = {
          questionNumber,
          type:
            quizzer.questions[questionIndex] === "C" ? "correct" : "incorrect",
          bonuses: [], // empty for tiebreaker
          primaryQuizzer: quizzer.name,
          primaryTeam: {
            name: team.name,
            color: teamToTeamColor.get(team) ?? "black",
          },
          additionalEvents,
          runningScores: scoresheet.teams.map((t) => ({
            name: t.name,
            color: teamToTeamColor.get(t) ?? "black",
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

      const questionsAnsweredBeforeAddingQuizzer =
        quizzersAnsweredTeamCount.get(team)?.size ?? 0;
      quizzersAnsweredTeamCount.get(team)?.add(quizzer);
      const questionsAnsweredAfterAddingQuizzer =
        quizzersAnsweredTeamCount.get(team)?.size ?? 0;

      if (
        questionsAnsweredBeforeAddingQuizzer ===
          questionsAnsweredAfterAddingQuizzer - 1 &&
        questionsAnsweredAfterAddingQuizzer >= 3
      ) {
        // 3rd, 4th, or 5th team member answered
        additionalEvents.push({
          type: "bonus",
          bonusNumber: questionsAnsweredAfterAddingQuizzer as 3 | 4 | 5,
        });
        addBonusPenaltyPoints(team, 10);
      }

      if (quizzer.questions[questionIndex] === "30") {
        // quizout
        additionalEvents.push({
          type: "perfectQuizout",
        });
        addBonusPenaltyPoints(team, 10);
      }

      questionSummaries[questionIndex] = {
        questionNumber,
        type: "correct",
        primaryQuizzer: quizzer.name,
        primaryTeam: {
          name: team.name,
          color: teamToTeamColor.get(team) ?? "black",
        },
        additionalEvents,
        runningScores: scoresheet.teams.map((t) => ({
          name: t.name,
          color: teamToTeamColor.get(t) ?? "black",
          runningScore: findMostRecentRunningScore(
            t.runningScore,
            questionIndex,
          ),
        })),
      };
    } else {
      // check for error
      const error = searchForValues(questionIndex, ["E", "-10"], scoresheet);
      if (error) {
        const [team, quizzer] = error;

        if (questionNumber >= 16) {
          // add error after sixteen
          additionalEvents.push({
            type: "errorAfterSixteen",
          });
          addBonusPenaltyPoints(team, -10);
        }

        const errorsByEachQuizzer = team.quizzers.reduce(
          (previousValue, currentQuizzer) => {
            const questionsPriorToCurrent = currentQuizzer.questions.slice(
              0,
              questionIndex,
            );
            previousValue.set(
              currentQuizzer,
              questionsPriorToCurrent.filter((q) => q === "E").length,
            );
            return previousValue;
          },
          new Map<ScoresheetQuizzer, number>(),
        );

        const errorsByTeam = [...errorsByEachQuizzer.values()].reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0,
        );

        if (quizzer.questions[questionIndex] === "-10") {
          additionalEvents.push({
            type: "errorOut",
          });
        } else if (errorsByTeam >= 4) {
          additionalEvents.push({
            type: "fifthError",
          });
        }

        const bonuses = [];
        const errorBonus = searchForValues(
          questionIndex,
          ["B", "/"],
          scoresheet,
        );
        if (errorBonus) {
          const [secondaryTeam, secondaryQuizzer] = errorBonus;
          bonuses.push({
            secondaryQuizzer: secondaryQuizzer.name,
            secondaryTeam: {
              name: secondaryTeam.name,
              color: teamToTeamColor.get(secondaryTeam) ?? "black",
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
                  color: teamToTeamColor.get(thirdTeam) ?? "black",
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
            color: teamToTeamColor.get(team) ?? "black",
          },
          additionalEvents,
          bonuses,
          runningScores: scoresheet.teams.map((t) => ({
            name: t.name,
            color: teamToTeamColor.get(t) ?? "black",
            runningScore: findMostRecentRunningScore(
              t.runningScore,
              questionIndex,
            ),
          })),
        };
      }
    }

    // detect all additional events not already done above

    // if the team bonus/penalty doesn't match what's expected AND >= 2 team fouls, assume second foul happened
    // or an overruled challenge could've happened
    for (const [team, expectedPoints] of expectedBonusPenaltyPoints) {
      const teamFoulCount = team.quizzers.reduce(
        (previousValue, currentQuizzer) =>
          previousValue + currentQuizzer.totalFouls,
        0,
      );
      if (teamFoulCount >= 2 || team.overruledChallenges >= 2) {
        let actualBonusPenaltyPoints = Number.parseInt(
          team.bonusOrPenaltyPoints[questionIndex],
        );
        if (Number.isNaN(actualBonusPenaltyPoints)) {
          actualBonusPenaltyPoints = 0;
        }

        if (actualBonusPenaltyPoints !== expectedPoints) {
          const difference = actualBonusPenaltyPoints - expectedPoints;
          if (difference < 0) {
            const foulsInQuestion = Math.abs(difference) / 10;
            for (let i = 0; i < foulsInQuestion; i++) {
              additionalEvents.push({
                type: "secondFoulOrOverruledChallenge",
                team,
              });
            }
          }
        }
      }
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

import { rootRoute } from "@/rootRoute.ts";
import * as Pages from "@/pages";

export * from "./pages";
export const routeTree = rootRoute.addChildren([
  Pages.homeRoute,
  Pages.statGroupIndividualStandingsRoute,
  Pages.statGroupTeamStandingsRoute,
  Pages.individualOverviewRoute,
  Pages.teamOverviewRoute,
  Pages.statGroupTeamScheduleRoute,
  Pages.roomScheduleRoute,
  Pages.roomStreamRoute,
  Pages.scoresheetRoute,
]);

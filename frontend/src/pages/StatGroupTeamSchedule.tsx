import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/rootRoute.ts";

export const statGroupTeamScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedules/division/$statGroupName/$teamName",
  component: function StatGroupTeamSchedule() {
    return <p>Division team schedule</p>;
  },
});

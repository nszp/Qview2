import { createRoute, Navigate } from "@tanstack/react-router";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { tournamentDataOptions } from "@/api.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import ScheduleTable from "@/components/ScheduleTable.tsx";

export const statGroupTeamScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedules/division/$statGroupName/$teamName",
  loader: () => {
    return Promise.all([queryClient.ensureQueryData(tournamentDataOptions)]);
  },
  component: function StatGroupTeamSchedule() {
    const { statGroupName, teamName } = statGroupTeamScheduleRoute.useParams();

    const { isLoading, error, data } = useSuspenseQuery(tournamentDataOptions);

    const statGroup = data?.statGroups.find((s) => s.name === statGroupName);
    const team = statGroup?.teams.find((t) => t.name === teamName);

    if (isLoading) {
      return <p>wait,,,,</p>;
    }

    if (error) {
      return <p>Error: {error.toString()}</p>;
    }

    if (!statGroup || !team) {
      return <Navigate to="/" replace />;
    }

    return <ScheduleTable quizzes={team.quizzes} />;
  },
});

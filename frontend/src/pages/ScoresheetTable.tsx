import { scoresheetDataOptions } from "@/api.ts";
import ScoresheetTeamTable from "@/components/ScoresheetTeamTable.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, createRoute } from "@tanstack/react-router";

export const scoresheetTableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rounds/$roundNumber/scoresheet/table",
  loader: ({ params: { roundNumber } }) =>
    // TODO: can this check for NaN?
    queryClient.ensureQueryData(scoresheetDataOptions(roundNumber)),
  component: function ScoresheetTable() {
    const { roundNumber: _roundNumber } = scoresheetTableRoute.useParams();
    const { isPending, error, data } = useSuspenseQuery(
      scoresheetDataOptions(_roundNumber),
    );

    const roundNumber = Number.parseInt(_roundNumber || "");

    if (Number.isNaN(roundNumber)) {
      return <Navigate to="/" replace />;
    }

    if (isPending) return <Text>Loading...</Text>;

    return data.teams.map((team) => (
      <ScoresheetTeamTable key={team.name} team={team} />
    ));
  },
});

import { scoresheetDataOptions } from "@/api.ts";
import ScoresheetPage from "@/components/scoresheets/ScoresheetPage.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, createRoute } from "@tanstack/react-router";

export const scoresheetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rounds/$roundNumber/scoresheet",
  loader: ({ params: { roundNumber } }) =>
    // TODO: can this check for NaN?
    queryClient.ensureQueryData(scoresheetDataOptions(roundNumber)),
  component: function Scoresheet() {
    const { roundNumber: _roundNumber } = scoresheetRoute.useParams();
    const { data } = useSuspenseQuery(scoresheetDataOptions(_roundNumber));

    const roundNumber = Number.parseInt(_roundNumber || "");

    if (Number.isNaN(roundNumber)) {
      return <Navigate to="/" replace />;
    }

    if (data) {
      data.tournament ??= "Q2024";
      // TODO: remove when data gets updated
    }

    return <ScoresheetPage data={data} />;
  },
});

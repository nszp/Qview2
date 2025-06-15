import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/rootRoute.ts";

export const roomScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedules/room/$roomName",
  component: function RoomSchedule() {
    return <p>Room Schedule</p>;
  },
});

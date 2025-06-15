import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/rootRoute.ts";

export const roomStreamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/streams/room/$roomName",
  component: function RoomStream() {
    return <p>Room Stream</p>;
  },
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { MantineProvider } from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { theme } from "./theme";

import "@mantine/core/styles.css";

import * as Layouts from "./layouts";
import * as Pages from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = document.getElementById("root");

// https://pub-6d08eec9bb2b41c1a12ec58fb2943b8d.r2.dev/q2024min.json

const queryClient = new QueryClient();

if (root) {
  createRoot(root).render(
    <StrictMode>
      <MantineProvider
        theme={theme}
        stylesTransform={emotionTransform}
        defaultColorScheme="dark"
      >
        <MantineEmotionProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route element={<Layouts.Shell />}>
                  <Route path="/" element={<Pages.Home />} />
                  <Route
                    path="/stats/division/:divisionName/individual"
                    element={<Pages.DivisionIndividualStats />}
                  />
                  <Route
                    path="/stats/division/:divisionName/team"
                    element={<Pages.DivisionTeamStats />}
                  />
                  <Route
                    path="/stats/individual/:individualName"
                    element={<Pages.IndividualStats />}
                  />
                  <Route
                    path="/stats/team/:teamName"
                    element={<Pages.TeamStats />}
                  />
                  <Route
                    path="/schedules/division/:divisionName/:teamName"
                    element={<Pages.DivisionTeamSchedule />}
                  />
                  <Route
                    path="/schedules/room/:roomName"
                    element={<Pages.RoomSchedule />}
                  />
                  <Route
                    path="/streams/room/:roomName"
                    element={<Pages.RoomStream />}
                  />
                  <Route
                    path="/scoresheets/round/:roundNumber"
                    element={<Pages.Scoresheet />}
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </MantineEmotionProvider>
      </MantineProvider>
    </StrictMode>,
  );
}

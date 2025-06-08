import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { MantineProvider } from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { theme } from "./theme";

import "@mantine/core/styles.css";

import * as Layouts from "./layouts";
import * as Pages from "./pages";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <MantineProvider
        theme={theme}
        stylesTransform={emotionTransform}
        defaultColorScheme="dark"
      >
        <MantineEmotionProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layouts.Shell />}>
                <Route path="/" element={<Pages.Home />} />
                <Route
                  path="/individual/:divisionId"
                  element={<Pages.IndividualStats />}
                />
                <Route path="/team/:divisionId" element={<Pages.TeamStats />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </MantineEmotionProvider>
      </MantineProvider>
    </StrictMode>,
  );
}

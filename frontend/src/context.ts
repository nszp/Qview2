import { createContext } from "react";
import type { TournamentData } from "./types/data.ts";

declare global {
  interface Window {
    quizData: string;
  }
}

export const DataContext = createContext<TournamentData>(
  JSON.parse(window.quizData),
);

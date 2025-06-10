import { createContext } from "react";
import type { TournamentData } from "./types/data.ts";
import quizData from "../q2024.json";

declare global {
  interface Window {
    quizData: string;
  }
}

export const DataContext = createContext<TournamentData>(
  // JSON.parse(window.quizData),
  quizData as TournamentData,
);

"use client";

import { Agentation } from "agentation";

export function AgentationProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}

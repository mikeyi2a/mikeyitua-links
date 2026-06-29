"use client";

import { useEffect, useState } from "react";
import { GitGraph } from "lucide-react";

/**
 * GitHub contribution graph.
 *
 * Fetches the contribution calendar client-side from a tokenless service that
 * mirrors a public GitHub profile, then renders it with GitHub's own colour
 * scale (see --gh-0..4 in globals.css, which swap with light/dark theme).
 *
 * NOTE: a tokenless service can only see contributions GitHub exposes on the
 * PUBLIC profile. To include private contributions, enable
 * "Include private contributions on my profile" in GitHub → Settings →
 * Profile → Contribution settings; the counts then flow through automatically.
 */
const GITHUB_USERNAME = "mikeyi2a";
const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

const CELL_SIZE = 11;
const CELL_GAP = 3;
const CELL_RADIUS = 2;

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ApiResponse = { total: Record<string, number>; contributions: Day[] };

/** Group days into week columns (Sun→Sat), padding the first column to align. */
function toWeeks(days: Day[]): Array<Array<Day | null>> {
  if (days.length === 0) return [];
  const leadingBlanks = new Date(days[0].date).getUTCDay(); // 0 = Sunday
  const cells: Array<Day | null> = [...Array(leadingBlanks).fill(null), ...days];
  const weeks: Array<Array<Day | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function GithubGraph() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: ApiResponse) => setDays(data.contributions ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, []);

  const weeks = days ? toWeeks(days) : [];
  const total = days?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  return (
    <section
      className="animate-fade-in"
      style={{
        backgroundColor: "var(--app-frame-bg)",
        borderRadius: "22px",
        boxSizing: "border-box",
        padding: "14px 16px",
        width: "100%",
        animationDelay: "120ms",
      }}
    >
      <a
        href={PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity duration-200 ease-out hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary)/0.5)]"
        style={{
          alignItems: "center",
          color: "hsl(var(--muted-foreground))",
          display: "flex",
          gap: "8px",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          lineHeight: "14px",
          marginBottom: "12px",
          textDecoration: "none",
          textTransform: "uppercase",
          width: "fit-content",
        }}
      >
        <GitGraph size={14} />
        Contributions
        {days && (
          <span style={{ letterSpacing: "0.02em", opacity: 0.7, textTransform: "none" }}>
            · {total.toLocaleString()} in the last year
          </span>
        )}
      </a>

      {/* Graph is ~53 weeks wide — let it scroll on narrow screens */}
      <div
        style={{
          overflowX: "auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
        aria-label={`${GITHUB_USERNAME}'s GitHub contributions: ${total} in the last year`}
        role="img"
      >
        {error ? (
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "12px", lineHeight: "16px", margin: "4px 0" }}>
            Couldn&apos;t load contributions right now.{" "}
            <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--primary))" }}>
              View on GitHub
            </a>
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
              gap: `${CELL_GAP}px`,
              minWidth: "min-content",
              // hold height while loading so the card doesn't jump
              minHeight: `${CELL_SIZE * 7 + CELL_GAP * 6}px`,
            }}
          >
            {weeks.flatMap((week, w) =>
              // pad short final week to keep the 7-row grid rectangular
              Array.from({ length: 7 }, (_, d) => week[d] ?? null).map((day, d) => (
                <div
                  key={`${w}-${d}`}
                  title={day ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}` : undefined}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: CELL_RADIUS,
                    backgroundColor: day ? `var(--gh-${day.level})` : "transparent",
                  }}
                />
              )),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
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
type Tip = { text: string; x: number; y: number };

/** Group days into week columns (Sun→Sat), padding the first column to align. */
function toWeeks(days: Day[]): Array<Array<Day | null>> {
  if (days.length === 0) return [];
  const leadingBlanks = new Date(days[0].date).getUTCDay(); // 0 = Sunday
  const cells: Array<Day | null> = [...Array(leadingBlanks).fill(null), ...days];
  const weeks: Array<Array<Day | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

/** "17 contributions on June 18th" — GitHub's phrasing. */
function tooltipText(day: Day): string {
  const d = new Date(`${day.date}T00:00:00`);
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const dateLabel = `${month} ${ordinal(d.getDate())}`;
  const count =
    day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`;
  return `${count} on ${dateLabel}`;
}

export function GithubGraph() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [error, setError] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Once the graph renders, scroll to the most recent (right-most) weeks.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [days]);

  const weeks = days ? toWeeks(days) : [];
  const total = days?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  const showTip = (day: Day, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setTip({ text: tooltipText(day), x: rect.left + rect.width / 2, y: rect.top });
  };
  const hideTip = () => setTip(null);

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
        ref={scrollRef}
        style={{
          overflowX: "auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
        aria-label={`${GITHUB_USERNAME}'s GitHub contributions: ${total} in the last year`}
        role="img"
        onScroll={hideTip}
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
              Array.from({ length: 7 }, (_, d) => week[d] ?? null).map((day, d) =>
                day ? (
                  <button
                    type="button"
                    key={`${w}-${d}`}
                    aria-label={tooltipText(day)}
                    onMouseEnter={(e) => showTip(day, e.currentTarget)}
                    onMouseLeave={hideTip}
                    onFocus={(e) => showTip(day, e.currentTarget)}
                    onBlur={hideTip}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      padding: 0,
                      border: "none",
                      borderRadius: CELL_RADIUS,
                      cursor: "pointer",
                      backgroundColor: `var(--gh-${day.level})`,
                      outline: "1px solid rgba(27, 31, 36, 0.06)",
                      outlineOffset: "-1px",
                    }}
                  />
                ) : (
                  <div
                    key={`${w}-${d}`}
                    style={{ width: CELL_SIZE, height: CELL_SIZE, backgroundColor: "transparent" }}
                  />
                ),
              ),
            )}
          </div>
        )}
      </div>

      {/* Custom tooltip — fixed so the scroll container can't clip it */}
      {tip && (
        <div
          role="tooltip"
          style={{
            position: "fixed",
            left: tip.x,
            top: tip.y - 8,
            transform: "translate(-50%, -100%)",
            backgroundColor: "#1b1f24",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "16px",
            padding: "5px 10px",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 50,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          {tip.text}
        </div>
      )}
    </section>
  );
}

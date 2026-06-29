"use client";

import { GitGraph } from "lucide-react";

/**
 * GitHub contribution graph.
 *
 * Rendered via ghchart.rshah.org, which returns an SVG of a public user's
 * contribution calendar — no API token or backend required. The first path
 * segment is a base hex colour the service uses to derive the cell shades, so
 * we pass the site's cyan accent (also used as #19A7CE elsewhere).
 */
const GITHUB_USERNAME = "mikeyi2a";
const GRAPH_COLOR = "19A7CE";
const GRAPH_SRC = `https://ghchart.rshah.org/${GRAPH_COLOR}/${GITHUB_USERNAME}`;
const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

export function GithubGraph() {
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
      </a>

      {/* Graph is ~53 weeks wide — let it scroll on narrow screens */}
      <div
        style={{
          overflowX: "auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Plain <img>: external SVG, fluid width — skips next/image remote config */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={GRAPH_SRC}
          alt={`${GITHUB_USERNAME}'s GitHub contribution graph`}
          loading="lazy"
          style={{
            display: "block",
            minWidth: "560px",
            width: "100%",
            height: "auto",
          }}
        />
      </div>
    </section>
  );
}

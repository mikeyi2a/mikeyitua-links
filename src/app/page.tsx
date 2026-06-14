"use client";

import { ProfileHeader } from "@/components/ProfileHeader";
import { SocialPill } from "@/components/SocialPill";
import { LinkCard } from "@/components/LinkCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SpotifyWidget } from "@/components/SpotifyWidget";
import { socialLinks, links } from "@/data/links";

export default function LinksPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "0 6px 40px",
      }}
    >
      {/* Centered column — wider on desktop */}
      <div
        style={{
          display: "flex",
          flex: "1 1 0%",
          flexDirection: "column",
          gap: "4px",
          maxWidth: "560px",
          width: "100%",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        {/* ─── Hero Container ─── */}
        <section
          className="animate-fade-in"
          style={{
            backgroundColor: "var(--app-frame-bg)",
            borderRadius: "24px",
            marginTop: "16px",
            overflow: "hidden",
          }}
        >
          {/* Top bar: logo + name on left, toggle on right */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "0 16px 0 0",
            }}
          >
            <div style={{ flex: "1 1 0%", minWidth: 0 }}>
              <ProfileHeader />
            </div>
            <div style={{ paddingTop: "20px" }}>
              <ThemeToggle />
            </div>
          </div>

          {/* ─── Social Pills ─── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              padding: "8px 20px 20px",
            }}
          >
            {socialLinks.map((link) => (
              <SocialPill key={link.id} link={link} />
            ))}
          </div>
        </section>

        {/* ─── Spotify Widget (standalone) ─── */}
        <SpotifyWidget />

        {/* ─── Links Grid (2-column) ─── */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
          }}
        >
          {links.map((link, index) => (
            <LinkCard key={link.id} link={link} index={index} />
          ))}
        </section>

        {/* ─── Spacer ─── */}
        <div style={{ flexGrow: 1 }} />

        {/* ─── Footer ─── */}
        <footer
          className="animate-fade-in"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 0 0",
            animationDelay: "600ms",
          }}
        >
          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              fontSize: "12px",
              lineHeight: "16px",
              margin: 0,
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Mikey Itua
          </p>
        </footer>
      </div>
    </main>
  );
}

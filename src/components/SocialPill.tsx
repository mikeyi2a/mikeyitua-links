import type { LinkItem } from "@/data/links";
import styles from "./SocialPill.module.css";

export function SocialPill({ link }: { link: LinkItem }) {
  const isExternal = link.external || link.href.startsWith("http");

  return (
    <a
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`${styles.pill} active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary)/0.5)]`}
      style={{
        alignItems: "center",
        border: "1px solid var(--app-pill-border)",
        borderRadius: "999px",
        boxSizing: "border-box",
        color: "var(--app-on-surface)",
        display: "flex",
        justifyContent: "center",
        padding: "7px 16px",
        textDecoration: "none",
        transition:
          "background-color 200ms ease-out, border-color 200ms ease-out, transform 200ms ease-out",
      }}
    >
      <span
        style={{
          color: "var(--app-on-surface)",
          display: "inline-block",
          fontSize: "14px",
          lineHeight: "18px",
        }}
      >
        {link.title}
      </span>
    </a>
  );
}

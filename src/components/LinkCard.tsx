"use client";

import Image from "next/image";
import { Music2 } from "lucide-react";
import type { LinkItem } from "@/data/links";

/** OG images are 1200×630 — aspect ratio ≈ 1.91:1 */
const OG_ASPECT = 630 / 1200;

export function LinkCard({ link, index }: { link: LinkItem; index: number }) {
  const isExternal = link.external || link.href.startsWith("http");
  const isPlaceholder = !link.ogImage;

  return (
    <a
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group stagger-item block no-underline transition-[background-color] duration-200 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary)/0.5)]"
      style={{
        animationDelay: `${80 + index * 60}ms`,
        height: "100%",
      }}
    >
      <div
        className="transition-[background-color] duration-200 ease-out group-hover:bg-[hsl(var(--foreground)/0.04)] dark:group-hover:bg-[rgba(255,255,255,0.04)]"
        style={{
          backgroundColor: "var(--app-frame-bg)",
          borderRadius: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        {/* ─── OG Image / Placeholder ─── */}
        <div
          style={{
            aspectRatio: `1 / ${OG_ASPECT}`,
            backgroundColor: "var(--app-surface-bg)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            width: "100%",
          }}
        >
          {link.ogImage ? (
            <Image
              src={link.ogImage}
              alt={`${link.title} preview`}
              fill
              sizes="(max-width: 640px) 50vw, 280px"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              unoptimized
            />
          ) : (
            <div
              style={{
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  backgroundColor: "hsl(var(--muted-foreground) / 0.08)",
                  borderRadius: "6px",
                  height: "24px",
                  width: "72px",
                }}
              />
            </div>
          )}
        </div>

        {/* ─── Label ─── */}
        <div style={{ padding: "12px 14px", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: "6px",
            }}
          >
            <h2
              style={{
                color: "var(--app-on-surface)",
                fontSize: "14px",
                fontWeight: 550,
                letterSpacing: "-0.01em",
                lineHeight: "18px",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {link.title}
            </h2>
            {link.badge && (
              <span
                style={{
                  backgroundColor:
                    link.badgeVariant === "accent"
                      ? "hsl(var(--primary) / 0.12)"
                      : "hsl(var(--muted-foreground) / 0.1)",
                  borderRadius: "999px",
                  color:
                    link.badgeVariant === "accent"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  lineHeight: "12px",
                  padding: "2px 6px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {link.badge}
              </span>
            )}
          </div>
          {link.description && (
            <p
              style={{
                color: "hsl(var(--muted-foreground))",
                fontSize: "12px",
                lineHeight: "16px",
                margin: "3px 0 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {link.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

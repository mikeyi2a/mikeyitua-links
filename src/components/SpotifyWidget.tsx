"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ExternalLink, Loader2, Music2, X } from "lucide-react";
import { type SpotifyTrack, useSpotifyRecent } from "@/hooks/useSpotifyRecent";
import { useState } from "react";

const SPOTIFY_GREEN = "#1DB954";
const SPOTIFY_PLAYING_GREEN = "#35E86A";
const SPOTIFY_DISC_SRC = "/images/spotify/disc.png";
const SPOTIFY_CLOSED_HEIGHT = 72;
const SPOTIFY_OPEN_HEIGHT = "clamp(348px, 40vh, 380px)";
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const SPOTIFY_SPRING = {
  type: "spring",
  duration: 0.58,
  bounce: 0,
} as const;

const APP_PANEL_BG = "var(--app-frame-bg)";

function getBestImage(images: Array<{ url: string; height: number }>) {
  if (!images?.length) return null;
  return images.find((img) => img.height === 64) ?? [...images].sort((a, b) => a.height - b.height)[0];
}

function getDayLabel(playedAt?: string) {
  if (!playedAt) return "RECENT";

  const playedDate = new Date(playedAt);
  if (Number.isNaN(playedDate.getTime())) return "RECENT";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (left: Date, right: Date) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

  if (sameDay(playedDate, today)) return "TODAY";
  if (sameDay(playedDate, yesterday)) return "YESTERDAY";

  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(playedDate).toUpperCase();
}

function TrackArtwork({ track, size, radius }: { track?: SpotifyTrack | null; size: number; radius: number }) {
  const image = getBestImage(track?.album.images ?? []);

  if (image) {
    return (
      <Image
        src={image.url}
        alt={track?.album.name ?? "Spotify album artwork"}
        width={size}
        height={size}
        className="object-cover"
        style={{
          borderRadius: radius,
          flexShrink: 0,
          height: size,
          outline: "1px solid var(--app-hairline)",
          outlineOffset: "-1px",
          width: size,
        }}
        unoptimized
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        alignItems: "center",
        backgroundImage:
          "linear-gradient(135deg, color(display-p3 0.184 0.719 0.813 / 18%) 0%, color(display-p3 0.735 0.943 0.968 / 14%) 100%)",
        border: "1px solid var(--app-hairline)",
        borderRadius: radius,
        boxSizing: "border-box",
        display: "flex",
        flexShrink: 0,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      <Music2 size={Math.max(14, size * 0.28)} color="#19A7CE" />
    </div>
  );
}

function DiscArtwork({
  isPlaying,
  reducedMotion,
  size,
  radius,
}: {
  isPlaying: boolean;
  reducedMotion: boolean;
  size: number;
  radius: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      animate={isPlaying && !reducedMotion ? { rotate: 360 } : { rotate: 0 }}
      transition={
        isPlaying && !reducedMotion
          ? { duration: 8.5, ease: "linear", repeat: Number.POSITIVE_INFINITY }
          : { duration: 0.16, ease: SOFT_EASE }
      }
      style={{
        borderRadius: radius,
        flexShrink: 0,
        height: size,
        overflow: "hidden",
        position: "relative",
        width: size,
        willChange: "transform",
      }}
    >
      <Image alt="" fill src={SPOTIFY_DISC_SRC} sizes={`${size}px`} unoptimized style={{ objectFit: "cover" }} />
    </motion.div>
  );
}

function RecentTrackRow({ track }: { track: SpotifyTrack }) {
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-[background-color,transform] duration-200 ease-out hover:bg-[hsl(var(--foreground)/0.06)] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary)/0.5)]"
      style={{
        alignItems: "center",
        borderRadius: "12px",
        boxSizing: "border-box",
        color: "var(--app-on-surface)",
        display: "flex",
        gap: "10px",
        minHeight: "44px",
        padding: "4px 6px",
        textDecoration: "none",
      }}
    >
      <TrackArtwork track={track} size={34} radius={7} />
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 500, lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {track.name}
        </div>
        <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "12px", lineHeight: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {track.artists.join(", ")}
        </div>
      </div>
      <ExternalLink size={13} color="hsl(var(--muted-foreground))" style={{ flexShrink: 0, opacity: 0.6 }} />
    </a>
  );
}

function GroupedRecentTracks({ tracks }: { tracks: SpotifyTrack[] }) {
  let previousLabel = "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {tracks.map((track) => {
        const label = getDayLabel(track.played_at);
        const shouldRenderLabel = label !== previousLabel;
        previousLabel = label;

        return (
          <div key={`${track.id}-${track.played_at ?? track.name}`}>
            {shouldRenderLabel && (
              <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", lineHeight: "14px", opacity: 0.72, padding: "8px 6px 2px" }}>
                {label}
              </div>
            )}
            <RecentTrackRow track={track} />
          </div>
        );
      })}
    </div>
  );
}

export function SpotifyWidget() {
  const { tracks, currentlyPlaying, isPlaybackActive, isLoading } = useSpotifyRecent(10);
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isCompactPlaying = isPlaybackActive && !isOpen;
  const displayTrack = currentlyPlaying ?? tracks[0] ?? null;
  const isUnavailable = !isLoading && !displayTrack;
  const openStagger = isOpen ? 0.32 : 0;
  const panelTransition = shouldReduceMotion
    ? { duration: 0.16 }
    : {
        borderRadius: { duration: 0.42, delay: isOpen ? 0.26 : 0, ease: SOFT_EASE },
        layout: { ...SPOTIFY_SPRING, delay: openStagger },
        padding: { duration: 0.46, delay: isOpen ? 0.22 : 0, ease: SOFT_EASE },
      };
  const expandedContentTransition = shouldReduceMotion
    ? { duration: 0.16 }
    : { delay: isOpen ? 0.48 : 0, duration: isOpen ? 0.52 : 0.08, ease: SOFT_EASE };
  const listTransition = shouldReduceMotion
    ? { duration: 0.16 }
    : { delay: isOpen ? 0.6 : 0, duration: isOpen ? 0.42 : 0.08, ease: SOFT_EASE };
  const headerTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : { delay: isOpen ? 0.16 : 0.12, duration: 0.28, ease: SOFT_EASE };
  const topTrackTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : { duration: isOpen ? 0.34 : 0.12, delay: 0, ease: SOFT_EASE };

  const openSpotify = () => {
    if (isUnavailable) return;
    setIsOpen(true);
  };

  const closeSpotify = () => setIsOpen(false);

  return (
    <motion.section
      layout
      animate={{
        backgroundColor: isCompactPlaying ? SPOTIFY_PLAYING_GREEN : APP_PANEL_BG,
        borderRadius: isOpen ? 24 : 22,
        boxShadow: "none",
        padding: isOpen ? "14px" : "14px 16px",
      }}
      transition={panelTransition}
      style={{
        backgroundColor: APP_PANEL_BG,
        boxSizing: "border-box",
        display: "flex",
        flex: isOpen ? `0 0 ${SPOTIFY_OPEN_HEIGHT}` : `0 0 ${SPOTIFY_CLOSED_HEIGHT}px`,
        flexDirection: "column",
        flexShrink: 0,
        height: isOpen ? SPOTIFY_OPEN_HEIGHT : SPOTIFY_CLOSED_HEIGHT,
        maxHeight: isOpen ? 380 : SPOTIFY_CLOSED_HEIGHT,
        minHeight: isOpen ? 348 : SPOTIFY_CLOSED_HEIGHT,
        minWidth: 0,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <motion.div
        layout
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: isOpen ? 12 : 0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="spotify-expanded-header"
              initial={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(2px)", opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { filter: "blur(0px)", opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(2px)", opacity: 0 }}
              transition={headerTransition}
              style={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}
            >
              <div
                style={{
                  alignItems: "center",
                  color: "hsl(var(--muted-foreground))",
                  display: "flex",
                  gap: "8px",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  lineHeight: "14px",
                  textTransform: "uppercase",
                }}
              >
                <span aria-hidden="true" style={{ backgroundColor: SPOTIFY_GREEN, borderRadius: "999px", height: "9px", width: "9px" }} />
                Recently Played
              </div>
              <button
                type="button"
                onClick={closeSpotify}
                aria-label="Close recently played"
                className="border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--foreground)/0.03)] transition-[background-color,border-color,transform] duration-200 ease-out hover:border-border hover:bg-[hsl(var(--foreground)/0.07)] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary)/0.5)]"
                style={{
                  alignItems: "center",
                  borderRadius: "999px",
                  color: "var(--app-on-surface)",
                  cursor: "pointer",
                  display: "flex",
                  height: "40px",
                  justifyContent: "center",
                  padding: 0,
                  width: "40px",
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="spotify-closed-button"
              type="button"
              onClick={openSpotify}
              aria-label="Open recently played"
              disabled={isUnavailable}
              className={
                isUnavailable
                  ? "cursor-default appearance-none rounded-[14px] bg-transparent disabled:pointer-events-none disabled:opacity-100"
                  : "appearance-none rounded-[14px] bg-transparent transition-[background-color,transform] duration-200 ease-out hover:bg-[hsl(var(--foreground)/0.04)] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary)/0.5)]"
              }
              initial={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(2px)", opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { filter: "blur(0px)", opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(2px)", opacity: 0 }}
              transition={headerTransition}
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
                border: 0,
                color: isCompactPlaying ? "#091A0D" : "var(--app-on-surface)",
                cursor: isUnavailable ? "default" : "pointer",
                display: "flex",
                gap: "12px",
                minWidth: 0,
                padding: 0,
                textAlign: "left",
                width: "100%",
              }}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key="spotify-art"
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: "blur(2px)" }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: "blur(2px)" }}
                  transition={headerTransition}
                >
                  <TrackArtwork track={displayTrack} size={42} radius={8} />
                </motion.div>
              </AnimatePresence>
              <div style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                <div style={{ color: isCompactPlaying ? "#091A0D" : "var(--app-on-surface)", fontSize: "16px", fontWeight: 500, lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isLoading ? "Loading..." : isUnavailable ? "Spotify unavailable" : displayTrack?.name}
                </div>
                <div style={{ color: isCompactPlaying ? "rgba(9, 26, 13, 0.72)" : "hsl(var(--muted-foreground))", fontSize: "14px", lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isLoading ? "Recently played" : isUnavailable ? "Try again shortly" : displayTrack?.artists[0]}
                </div>
              </div>
              <div
                aria-hidden="true"
                style={{
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "14px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexShrink: 0,
                  height: "28px",
                  justifyContent: "center",
                  width: "28px",
                }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={13} color={isCompactPlaying ? "#091A0D" : "#19A7CE"} />
                ) : (
                  <DiscArtwork isPlaying={isCompactPlaying} reducedMotion={Boolean(shouldReduceMotion)} radius={16} size={32} />
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="spotify-expanded"
            initial={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(3px)", opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { filter: "blur(0px)", opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { filter: "blur(1px)", opacity: 0, y: 0 }}
            transition={expandedContentTransition}
            style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", minHeight: 0 }}
          >
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={topTrackTransition}
              style={{ alignItems: "center", display: "flex", gap: "14px", paddingBottom: "14px" }}
            >
              <TrackArtwork track={displayTrack} size={86} radius={12} />
              <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                <div style={{ color: "var(--app-on-surface)", fontSize: "18px", fontWeight: 500, lineHeight: "22px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isLoading ? "Loading Spotify..." : isUnavailable ? "Spotify unavailable" : displayTrack?.name}
                </div>
                <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "13px", lineHeight: "18px", marginTop: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isLoading ? "Fetching your recent tracks" : isUnavailable ? "Recently played could not load" : displayTrack?.artists.join(", ")}
                </div>
                {currentlyPlaying && !isUnavailable && (
                  <div style={{ alignItems: "center", color: "#19A7CE", display: "flex", gap: "6px", fontSize: "12px", fontWeight: 500, lineHeight: "16px", marginTop: "8px" }}>
                    <span aria-hidden="true" style={{ backgroundColor: "#19A7CE", borderRadius: "999px", height: "6px", width: "6px" }} />
                    Playing now
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={listTransition}
              style={{ borderTop: "1px solid var(--app-hairline)", flex: "1 1 auto", minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", paddingTop: "6px" }}
            >
              {isLoading ? (
                <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "13px", padding: "14px 6px" }}>Loading recently played...</div>
              ) : isUnavailable ? (
                <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "13px", lineHeight: "18px", padding: "14px 6px" }}>
                  Spotify is unavailable right now. The compact player will recover when the API responds again.
                </div>
              ) : (
                <GroupedRecentTracks tracks={tracks} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

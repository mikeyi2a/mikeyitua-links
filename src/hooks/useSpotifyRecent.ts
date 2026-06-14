import { useState, useEffect, useCallback, useRef } from "react";

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: {
    name: string;
    images: Array<{ url: string; height: number }>;
  };
  external_urls: {
    spotify: string;
  };
  played_at?: string;
  is_playing?: boolean;
  progress_ms?: number;
  duration_ms?: number;
}

interface UseSpotifyRecentReturn {
  tracks: SpotifyTrack[];
  currentlyPlaying: SpotifyTrack | null;
  isPlaybackActive: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const REFRESH_INTERVAL = 10000; // 10 seconds for live feel

function dedupeTracks(tracks: SpotifyTrack[]) {
  const seen = new Set<string>();

  return tracks.filter((track) => {
    const key = track.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function useSpotifyRecent(limit: number = 10): UseSpotifyRecentReturn {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<SpotifyTrack | null>(null);
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const previousCurrentTrackRef = useRef<SpotifyTrack | null>(null);

  const fetchTracks = useCallback(async () => {
    const shouldShowLoadingState = !hasLoadedOnce;

    try {
      if (shouldShowLoadingState) {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetch(`/api/spotify/recent?limit=${limit}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tracks");
      }

      if (data?.error?.currentlyPlaying) {
        console.warn("Currently playing error:", data.error.currentlyPlaying);
      }

      const nextTracks = Array.isArray(data?.tracks) ? data.tracks : [];
      const nextCurrentTrack = data?.currentlyPlaying ?? null;
      const previousCurrentTrack = previousCurrentTrackRef.current;
      const previousTrackJustFinished = Boolean(
        previousCurrentTrack &&
          nextCurrentTrack &&
          previousCurrentTrack.id !== nextCurrentTrack.id
      );

      if (nextTracks.length || previousTrackJustFinished) {
        setTracks((currentTracks) => {
          const syntheticHistoryTrack = previousTrackJustFinished
            ? {
                ...previousCurrentTrack,
                played_at: new Date().toISOString(),
                is_playing: false,
              }
            : null;
          const mergedTracks = syntheticHistoryTrack
            ? [syntheticHistoryTrack, ...nextTracks, ...currentTracks]
            : [...nextTracks, ...currentTracks];

          return dedupeTracks(mergedTracks).slice(0, limit);
        });
      } else if (shouldShowLoadingState) {
        setTracks([]);
      }

      if (nextCurrentTrack) {
        previousCurrentTrackRef.current = nextCurrentTrack;
        setIsPlaybackActive(true);
        setCurrentlyPlaying(nextCurrentTrack);
      } else if (shouldShowLoadingState) {
        previousCurrentTrackRef.current = null;
        setIsPlaybackActive(false);
        setCurrentlyPlaying(null);
      } else {
        setIsPlaybackActive(false);
      }

      setHasLoadedOnce(true);
    } catch (err) {
      console.error("Error fetching Spotify tracks:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tracks");

      if (!hasLoadedOnce) {
        setTracks([]);
        setIsPlaybackActive(false);
        setCurrentlyPlaying(null);
      }

      setHasLoadedOnce(true);
    } finally {
      if (shouldShowLoadingState) {
        setIsLoading(false);
      }
    }
  }, [hasLoadedOnce, limit]);

  useEffect(() => {
    fetchTracks();

    const interval = setInterval(() => {
      fetchTracks();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchTracks]);

  return {
    tracks,
    currentlyPlaying,
    isPlaybackActive,
    isLoading,
    error,
    refetch: fetchTracks,
  };
}

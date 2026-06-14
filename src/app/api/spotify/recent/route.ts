import { NextRequest, NextResponse } from "next/server";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string; height: number }>;
    };
    external_urls: {
      spotify: string;
    };
  };
  played_at: string;
}

interface SpotifyRecentResponse {
  items: SpotifyTrack[];
}

// Cache for token and tracks (in-memory, resets on cold start)
let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedTracks: { tracks: unknown[]; expiresAt: number } | null = null;
const CACHE_DURATION = 5000; // Keep history fresh as the current track changes.

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Spotify credentials not configured");
  }

  // Check cache first
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  // Refresh token
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data: SpotifyTokenResponse = await response.json();

  // Cache token (expires 5 minutes before actual expiry for safety)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
}

async function getCurrentlyPlaying(accessToken: string): Promise<unknown | null> {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Spotify currently-playing API error (${response.status}):`, errorText);

    if (response.status === 403) {
      throw new Error(
        "insufficient_scope: Missing user-read-currently-playing or user-read-playback-state scope"
      );
    }

    return null;
  }

  const data = await response.json();

  if (!data.is_playing || !data.item) {
    return null;
  }

  return {
    id: data.item.id,
    name: data.item.name,
    artists: data.item.artists.map((artist: { name: string }) => artist.name),
    album: {
      name: data.item.album.name,
      images: data.item.album.images,
    },
    external_urls: data.item.external_urls,
    is_playing: true,
    progress_ms: data.progress_ms,
    duration_ms: data.item.duration_ms,
  };
}

async function getRecentlyPlayed(accessToken: string, limit: number = 10): Promise<unknown[]> {
  // Check cache first
  if (cachedTracks && cachedTracks.expiresAt > Date.now()) {
    return cachedTracks.tracks;
  }

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch recently played: ${error}`);
  }

  const data: SpotifyRecentResponse = await response.json();

  // Format tracks
  const tracks = data.items.map((item) => ({
    id: item.track.id,
    name: item.track.name,
    artists: item.track.artists.map((artist) => artist.name),
    album: {
      name: item.track.album.name,
      images: item.track.album.images,
    },
    external_urls: item.track.external_urls,
    played_at: item.played_at,
  }));

  // Cache tracks
  cachedTracks = {
    tracks,
    expiresAt: Date.now() + CACHE_DURATION,
  };

  return tracks;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const accessToken = await getAccessToken();

    let currentlyPlaying = null;
    let currentlyPlayingError = null;

    try {
      currentlyPlaying = await getCurrentlyPlaying(accessToken);
    } catch (error) {
      console.error("Currently playing error:", error);
      currentlyPlayingError = error instanceof Error ? error.message : "Unknown error";
    }

    const tracks = await getRecentlyPlayed(accessToken, limit);

    return NextResponse.json({
      tracks,
      currentlyPlaying,
      error: currentlyPlayingError ? { currentlyPlaying: currentlyPlayingError } : undefined,
    });
  } catch (error) {
    console.error("Spotify API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        tracks: [],
      },
      { status: 500 }
    );
  }
}

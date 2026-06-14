import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AgentationProvider } from "@/components/AgentationProvider";

const siteUrl = "https://links.mikeyitua.com";
const socialImageUrl = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  title: "Mikey Itua | Links",
  description:
    "Links, projects, micro-tools, and experiments by Mikey Itua — AI-native designer taking imperfect action.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Mikey Itua | Links",
    description:
      "Links, projects, micro-tools, and experiments by Mikey Itua — AI-native designer taking imperfect action.",
    url: siteUrl,
    siteName: "Mikey Itua Links",
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: "Mikey Itua - Links",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ituadesign",
    creator: "@ituadesign",
    title: "Mikey Itua | Links",
    description:
      "Links, projects, micro-tools, and experiments by Mikey Itua.",
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: "Mikey Itua - Links",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          <AgentationProvider>{children}</AgentationProvider>
        </Providers>
      </body>
    </html>
  );
}

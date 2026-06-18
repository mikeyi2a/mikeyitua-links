export type LinkItem = {
  id: string;
  title: string;
  description?: string;
  href: string;
  category: "project" | "tool" | "social" | "writing" | "other";
  /** URL to OG image — displayed at 1200×630 (1.91:1) aspect ratio */
  ogImage?: string;
  badge?: string;
  badgeVariant?: "default" | "accent";
  external?: boolean;
};

export const socialLinks: LinkItem[] = [
  {
    id: "x",
    title: "X",
    href: "https://x.com/ituadesign",
    category: "social",
    external: true,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/mikeyitua/",
    category: "social",
    external: true,
  },
  {
    id: "youtube",
    title: "YouTube",
    href: "https://www.youtube.com/@ituadesign",
    category: "social",
    external: true,
  },
  {
    id: "email",
    title: "Email",
    href: "mailto:mikeyitua10@gmail.com",
    category: "social",
  },
];

export const links: LinkItem[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    description: "My full portfolio — projects, case studies, and side quests.",
    href: "https://www.mikeyitua.com",
    category: "project",
    ogImage: "https://www.mikeyitua.com/og-image-v4.png",
    badge: "Main Site",
    badgeVariant: "accent",
    external: true,
  },
  {
    id: "aidesignhq",
    title: "AI Design HQ",
    description:
      "A curated resource library for designers making the shift to AI-native.",
    href: "https://aidesignhq.com",
    category: "project",
    ogImage: "https://aidesignhq.com/og/aidesignhq-og-01-soft-light.png",
    badge: "Live",
    badgeVariant: "accent",
    external: true,
  },
  {
    id: "typiva",
    title: "Typiva",
    description:
      "AI font discovery tool — pairings, alternatives, and brand kits from a single prompt.",
    href: "https://typiva.com",
    category: "project",
    ogImage:
      "https://storage.googleapis.com/gpt-engineer-file-uploads/NAW7im3NcyTPDeK4YupmYInkfBX2/social-images/social-1760314657413-typiva OG image.png",
    badge: "Live",
    badgeVariant: "accent",
    external: true,
  },
  {
    id: "circle-animation-builder",
    title: "Circle Animation Builder",
    description:
      "Parameter-driven animation builder for tuning orbital icon motion. Built with v0.",
    href: "https://v0-animation-code-copy.vercel.app/",
    category: "tool",
    ogImage: "https://www.mikeyitua.com/images/pharmappy-images/circle-animation-tool.png",
    badge: "Tool",
    badgeVariant: "default",
    external: true,
  },
  {
    id: "jitter-grid-generator",
    title: "Jitter Grid Generator",
    description:
      "Visual generator for shimmer and jitter grid treatments. Built with Lovable.",
    href: "https://wave-shimmer.lovable.app/",
    category: "tool",
    ogImage:
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7499fc20-863f-41a1-837b-af5156a38292/id-preview-f382f623--b4b7be19-05ad-441d-a78d-eb5e02b72d9a.lovable.app-1775033874507.png",
    badge: "Tool",
    badgeVariant: "default",
    external: true,
  },
  {
    id: "playround",
    title: "Playround",
    description: "A SwiftUI iOS party game app built for groups.",
    href: "#",
    category: "project",
    badge: "Soon",
    badgeVariant: "default",
  },
  {
    id: "bookmrkr",
    title: "BookMrkr",
    description: "Desktop bookmarking app to organize inspiration, links, and assets.",
    href: "#",
    category: "tool",
    badge: "Soon",
    badgeVariant: "default",
  },
  {
    id: "minikit",
    title: "Minikit",
    description: "Copy-paste component registry for building mini creative tools.",
    href: "#",
    category: "tool",
    badge: "Soon",
    badgeVariant: "default",
  },
];


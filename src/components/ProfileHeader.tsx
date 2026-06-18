import { LiquidMetalLogo } from "./LiquidMetalLogo";

export function ProfileHeader() {
  return (
    <header
      className="flex flex-col gap-3"
      style={{ padding: "20px 20px 4px" }}
    >
      <LiquidMetalLogo className="h-[36px] w-[72px]" />

      <div className="flex flex-col gap-1">
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: "28px",
            margin: 0,
            color: "var(--app-on-surface)",
          }}
        >
          Mikey Itua
        </h1>
        <p
          className="dark:text-white/70"
          style={{
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: "22px",
            margin: 0,
            color: "hsl(var(--foreground) / 0.6)",
            maxWidth: "320px",
          }}
        >
          Product designer and <span className="ai-shimmer">AI-native builder</span> taking
          imperfect action
        </p>
      </div>
    </header>
  );
}

import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";

const storageKey = "juju-theme";

function applyTheme(nextTheme: "light" | "dark") {
  document.documentElement.dataset.theme = nextTheme;
  window.localStorage.setItem(storageKey, nextTheme);
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const preferredDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(preferredDark);
    applyTheme(preferredDark ? "dark" : "light");
  }, []);

  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        color: "var(--text)",
      }}
    >
      <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
        {dark ? "夜间" : "白天"}
      </span>
      <Switch.Root
        checked={dark}
        onCheckedChange={(checked) => {
          setDark(checked);
          applyTheme(checked ? "dark" : "light");
        }}
        style={{
          width: 58,
          height: 34,
          borderRadius: 999,
          padding: 4,
          display: "inline-flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, var(--accent), var(--accent-2))",
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "pointer",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        <Switch.Thumb
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            background: "white",
            display: "block",
            transition: "transform 180ms ease",
            transform: dark ? "translateX(24px)" : "translateX(0)",
          }}
        />
      </Switch.Root>
    </label>
  );
}

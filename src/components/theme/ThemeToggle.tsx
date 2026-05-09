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
        gap: "0.65rem",
        color: "var(--text)",
      }}
    >
      <span
        style={{
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {dark ? "夜间" : "白天"}
      </span>
      <Switch.Root
        checked={dark}
        onCheckedChange={(checked) => {
          setDark(checked);
          applyTheme(checked ? "dark" : "light");
        }}
        style={{
          width: 48,
          height: 26,
          padding: 3,
          display: "inline-flex",
          alignItems: "center",
          background: dark
            ? "var(--accent)"
            : "var(--line)",
          border: "1px solid var(--line)",
          cursor: "pointer",
          transition: "background 180ms ease",
        }}
      >
        <Switch.Thumb
          style={{
            width: 18,
            height: 18,
            background: dark ? "white" : "var(--accent)",
            display: "block",
            transition: "transform 180ms ease, background 180ms ease",
            transform: dark ? "translateX(22px)" : "translateX(0)",
          }}
        />
      </Switch.Root>
    </label>
  );
}

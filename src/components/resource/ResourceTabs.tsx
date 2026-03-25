import * as Tabs from "@radix-ui/react-tabs";
import type { CSSProperties } from "react";

type Props = {
  overview?: string;
  tutorial?: string;
  changelog?: string;
  notes?: string;
};

const tabListStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  marginBottom: "1.2rem",
};

const tabStyle: CSSProperties = {
  background: "var(--badge)",
  border: "1px solid var(--line)",
  color: "var(--text)",
  borderRadius: 999,
  padding: "0.65rem 1rem",
  cursor: "pointer",
};

const panelStyle: CSSProperties = {
  background: "var(--panel)",
  border: "1px solid var(--line)",
  borderRadius: "24px",
  padding: "1.25rem",
  color: "var(--text-muted)",
  lineHeight: 1.9,
};

export default function ResourceTabs({
  overview,
  tutorial,
  changelog,
  notes,
}: Props) {
  const sections = [
    { value: "overview", label: "概览", content: overview },
    { value: "tutorial", label: "使用教程", content: tutorial },
    { value: "changelog", label: "更新记录", content: changelog },
    { value: "notes", label: "注意事项", content: notes },
  ].filter((section) => section.content);

  if (sections.length === 0) return null;

  return (
    <Tabs.Root defaultValue={sections[0]?.value}>
      <Tabs.List style={tabListStyle}>
        {sections.map((section) => (
          <Tabs.Trigger key={section.value} value={section.value} style={tabStyle}>
            {section.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {sections.map((section) => (
        <Tabs.Content key={section.value} value={section.value} style={panelStyle}>
          {section.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

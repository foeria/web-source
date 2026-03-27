import * as Tabs from "@radix-ui/react-tabs";

type Props = {
  overview?: string;
  tutorial?: string;
  changelog?: string;
  notes?: string;
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
    <Tabs.Root className="resource-tabs" defaultValue={sections[0]?.value}>
      <Tabs.List className="resource-tabs__list">
        {sections.map((section) => (
          <Tabs.Trigger className="resource-tabs__trigger" key={section.value} value={section.value}>
            {section.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {sections.map((section) => (
        <Tabs.Content className="resource-tabs__panel" key={section.value} value={section.value}>
          {section.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

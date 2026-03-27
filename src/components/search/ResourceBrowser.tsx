import { useMemo, useState } from "react";
import { getDecorVisual } from "../../data/visuals";

type ResourceItem = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  platform: string[];
  version: string;
  updatedAt: string;
  cover?: string;
};

type Props = {
  items: ResourceItem[];
  categories: { name: string; slug: string }[];
  tags: string[];
};

function sortItems(items: ResourceItem[], mode: string) {
  const next = [...items];
  if (mode === "name") {
    next.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
    return next;
  }
  next.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return next;
}

export default function ResourceBrowser({ items, categories, tags }: Props) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [sortMode, setSortMode] = useState("latest");
  const [activeTag, setActiveTag] = useState("");

  const platforms = useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.platform))),
    [items],
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return sortItems(
      items.filter((item) => {
        const matchesKeyword =
          !q ||
          [item.title, item.summary, item.category, ...item.tags, ...item.platform]
            .join(" ")
            .toLowerCase()
            .includes(q);
        const matchesCategory = category === "all" || item.category === category;
        const matchesPlatform = platform === "all" || item.platform.includes(platform);
        const matchesTag = !activeTag || item.tags.includes(activeTag);
        return matchesKeyword && matchesCategory && matchesPlatform && matchesTag;
      }),
      sortMode,
    );
  }, [items, keyword, category, platform, activeTag, sortMode]);

  return (
    <div className="stack">
      <div className="card stack" style={{ padding: "20px" }}>
        <div className="filter-grid">
          <input
            className="search-input"
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索标题、标签或平台"
          />

          <select
            className="select-input"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">全部分类</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            className="select-input"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            <option value="all">全部平台</option>
            {platforms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            className="select-input"
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value)}
          >
            <option value="latest">按更新时间</option>
            <option value="name">按名称排序</option>
          </select>
        </div>

        <div className="tag-pool">
          <button
            className={activeTag === "" ? "pill pill-active" : "pill"}
            type="button"
            onClick={() => setActiveTag("")}
          >
            全部标签
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={activeTag === tag ? "pill pill-active" : "pill"}
              type="button"
              onClick={() => setActiveTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="pill">当前共筛选到 {filtered.length} 条资源</div>

      <div className="resource-list">
        {filtered.length ? (
          filtered.map((item) => (
            <a key={item.slug} className="card resource-row" href={`/resource/${item.slug}/`}>
              <div className="image-slot image-slot--clean resource-row__media">
                <img
                  className="visual-slot__image"
                  src={item.cover || getDecorVisual(item.slug)}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
              <div className="stack">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <span className="pill">
                    {categories.find((entry) => entry.slug === item.category)?.name ?? item.category}
                  </span>
                  {item.platform.map((name) => (
                    <span key={name} className="pill">
                      {name}
                    </span>
                  ))}
                  <span className="pill">版本 {item.version}</span>
                </div>
                <div style={{ fontSize: "1.16rem", fontWeight: 700 }}>{item.title}</div>
                <div style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>{item.summary}</div>
                <div className="meta-row">
                  {item.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
                  更新时间：{item.updatedAt}
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="card stack" style={{ padding: "24px" }}>
            <div className="image-slot image-slot--clean" style={{ minHeight: "220px" }}>
              <img
                className="visual-slot__image"
                src={getDecorVisual("empty-state")}
                alt="空状态插画"
                loading="lazy"
              />
            </div>
            <strong>没有找到符合条件的资源</strong>
            <span style={{ color: "var(--text-muted)" }}>
              可以尝试缩短关键词，或者清空筛选条件后重新查看。
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

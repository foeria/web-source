import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { getDecorVisual } from "../../data/visuals";
import { withBase } from "../../lib/site";

type SearchItem = {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  category: string;
  platform: string[];
  keywords: string[];
  aliases: string[];
  cover?: string;
};

type Props = {
  items: SearchItem[];
  initialQuery?: string;
};

export default function SearchExperience({ items, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery.trim());
  const [ready, setReady] = useState(false);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        threshold: 0.38,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 1,
        keys: [
          { name: "title", weight: 0.4 },
          { name: "aliases", weight: 0.2 },
          { name: "keywords", weight: 0.15 },
          { name: "tags", weight: 0.15 },
          { name: "summary", weight: 0.1 },
        ],
      }),
    [items],
  );

  const results = useMemo(() => {
    const trimmed = submittedQuery.trim();
    if (!trimmed) return [];
    return fuse.search(trimmed).map((entry) => entry.item);
  }, [fuse, submittedQuery]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get("q") ?? initialQuery;
    setQuery(urlQuery);
    setSubmittedQuery(urlQuery.trim());
    setReady(true);
  }, [initialQuery]);

  function commitQuery(nextQuery: string) {
    const trimmed = nextQuery.trim();
    setSubmittedQuery(trimmed);
    const url = trimmed ? withBase(`/search/?q=${encodeURIComponent(trimmed)}`) : withBase("/search/");
    window.history.replaceState({}, "", url);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    commitQuery(query);
  }

  return (
    <div className="stack">
      <div className="card stack" style={{ padding: "24px" }}>
        <div className="eyebrow">Search</div>
        <h1 className="section-title">搜索资源</h1>
        <form className="stack" style={{ gap: "14px" }} onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="search"
            name="q"
            placeholder="输入软件名、关键词、标签或别名"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="hero-actions">
            <button className="button" type="submit">
              搜索
            </button>
            <button
              className="button-secondary"
              type="button"
              onClick={() => {
                setQuery("");
                commitQuery("");
              }}
            >
              清空
            </button>
          </div>
        </form>
      </div>

      <div className="pill">
        {submittedQuery ? `已找到 ${results.length} 条结果` : "输入关键词后按回车或点击按钮开始搜索"}
      </div>

      {submittedQuery ? (
        results.length ? (
          <div className="resource-list">
            {results.map((item) => (
                <a key={item.slug} className="card resource-row" href={withBase(`/resource/${item.slug}/`)}>
                  <div className="image-slot image-slot--clean resource-row__media">
                    <img
                      className="visual-slot__image"
                      src={withBase(item.cover || getDecorVisual(item.slug))}
                      alt={item.title}
                      loading="lazy"
                    />
                </div>
                <div className="stack">
                  <div style={{ fontFamily: "'DM Serif Display', 'Noto Serif SC', Georgia, serif", fontSize: "1.1rem", fontWeight: 400 }}>{item.title}</div>
                  <div style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>{item.summary}</div>
                  <div className="meta-row">
                    <span className="pill">{item.category}</span>
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="card stack" style={{ padding: "24px" }}>
            <div className="image-slot image-slot--clean" style={{ minHeight: "220px" }}>
              <img
                className="visual-slot__image"
                src={getDecorVisual("search-empty")}
                alt="搜索空状态插画"
                loading="lazy"
              />
            </div>
            <strong>没有找到匹配结果</strong>
            <span style={{ color: "var(--text-muted)" }}>
              试试更短的关键词，或者换用资源标签、软件别名再次搜索。
            </span>
          </div>
        )
      ) : null}
    </div>
  );
}

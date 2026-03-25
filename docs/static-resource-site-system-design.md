# 静态资源分享网站系统设计方案

## 1. 文档说明

本文档基于 [静态资源分享网站需求文档](./static-resource-site-requirements.md) 输出，面向一个部署在 GitHub Pages、Cloudflare Pages、Netlify 等静态托管平台上的个人资源分享网站。

本设计方案重点解决以下问题：
- 在没有传统后端的前提下，如何组织资源内容与页面结构
- 如何支持“独立开发软件 + 其他资源”的可扩展目录体系
- 如何实现本地搜索、分类、标签、推荐与详情展示
- 如何以百度网盘作为统一下载方式进行展示

## 2. 设计原则

### 2.1 核心原则
- 纯静态部署：运行时不依赖数据库和服务端 API
- 数据驱动：资源目录、分类、标签、公告均由内容数据驱动生成
- 内容与模板分离：站长主要维护内容文件，页面模板稳定复用
- 可扩展：新增资源、分类、标签、页面模板时尽量不改核心架构
- 搜索优先：资源数量增长后仍可快速检索
- 软件优先：首页与导航层级优先突出“独立开发软件”
- 主题统一：白天/黑夜模式通过 CSS 变量统一控制
- 风格可塑：成熟组件负责交互稳定性，视觉层单独做二次元主题定制

### 2.2 设计结论
推荐使用 `Astro + TypeScript + React Islands + Markdown/JSON + 客户端轻量搜索` 作为首选实现方案。

原因：
- 适合静态导出
- 内容集合能力强
- Markdown 支持好
- 页面生成灵活
- 非常适合部署到 GitHub Pages
- 可以只在需要的页面加载少量前端交互 JS

## 3. 总体架构

### 3.1 总体架构图

```text
┌──────────────────────────────────────────────────────────────┐
│                        内容维护层                            │
│  resources/*.md   categories.json   announcements/*.md       │
│  about.md         tags(可从资源自动聚合)   assets/*          │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                        构建处理层                            │
│  Astro Content Collections                                    │
│  路由生成                                                     │
│  分类/标签聚合                                                │
│  搜索索引生成脚本                                             │
│  sitemap / RSS / SEO 元数据生成                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                        静态产出层                            │
│  HTML / CSS / JS / search-index.json / sitemap.xml           │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                        用户访问层                            │
│  首页浏览 / 分类筛选 / 标签聚合 / 搜索 / 详情页 / 下载跳转    │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 运行时边界
- 运行时只有静态页面、图片、JSON 和少量浏览器端 JavaScript
- 所谓“后端”仅存在于构建阶段，即 Node.js 构建脚本
- 所有资源信息在构建时固化为页面与数据文件

## 4. 技术选型

### 4.1 推荐技术栈
- 静态站点框架：`Astro`
- 语言：`TypeScript`
- 交互岛屿：`React`
- 内容格式：`Markdown + Frontmatter`，补充 `JSON`
- 样式方案：`Tailwind CSS + CSS Variables`
- UI 组件方案：`Radix UI + shadcn/ui`
- 图标方案：`Lucide`
- 动画方案：`Motion One` 或 `Framer Motion`
- 搜索方案：`Fuse.js` + 构建生成 `search-index.json`
- 构建工具：Astro 默认构建链路
- 部署平台：GitHub Pages 为主，兼容 Cloudflare Pages / Netlify

### 4.2 为什么不推荐传统前后端分离
- 部署目标是静态托管平台
- 资源站无需账号系统和复杂动态能力
- 传统接口、数据库、后台会显著增加复杂度
- 当前功能以内容展示、筛选、搜索和跳转下载为主，完全适合静态方案

### 4.3 为什么推荐 Markdown 作为资源详情主体
- 资源详情通常需要较长介绍、更新记录、使用说明
- Markdown 便于写教程和说明文档
- 前置信息用 Frontmatter 管理，正文用 Markdown 管理，结构清晰

### 4.4 为什么推荐 `Radix UI + shadcn/ui`
- 组件成熟，交互与可访问性基础较稳
- 适合只挑选需要的组件按需接入，不会把整个站点做成“模板站”
- 组件底层能力完整，适合主题切换、弹层、抽屉、Tabs、Carousel、Dialog 等需求
- 视觉层可完全自定义，适合做偏二次元、插画感更强的界面皮肤

### 4.5 主题系统设计结论
- 主题切换采用 `data-theme="light"` 和 `data-theme="dark"` 控制
- 核心颜色、阴影、描边、卡片透明度、背景光效均由 CSS 变量驱动
- UI 组件不直接写死颜色，统一消费语义化变量
- 白天模式偏柔和明亮，黑夜模式偏霓虹、梦幻、发光感

## 5. 信息架构与页面路由

### 5.1 页面结构
- `/`：首页
- `/resources/`：资源总览页
- `/category/[slug]/`：分类页
- `/tag/[slug]/`：标签页
- `/search/`：搜索结果页
- `/resource/[slug]/`：资源详情页
- `/announcements/`：公告列表页
- `/announcements/[slug]/`：公告详情页，可选
- `/about/`：关于页
- `/disclaimer/`：版权与免责声明页
- `/404.html`：404 页面

### 5.2 页面层级关系

```text
首页
├─ 独立开发软件专区
│  └─ 资源详情页
├─ 推荐资源
│  └─ 资源详情页
├─ 最新资源
│  └─ 资源详情页
├─ 分类入口
│  └─ 分类页
│     └─ 资源详情页
├─ 标签入口
│  └─ 标签页
│     └─ 资源详情页
└─ 搜索入口
   └─ 搜索结果页
      └─ 资源详情页
```

## 6. 内容模型设计

### 6.1 资源内容模型

建议每条资源使用一个 Markdown 文件：

```yaml
title: "Focus Timer Pro"
slug: "focus-timer-pro"
summary: "一款面向个人效率场景的专注计时软件"
category: "indie-software"
tags: ["Windows", "效率", "计时器", "生产力"]
type: "software"
subType: "desktop-app"
platform: ["Windows"]
version: "1.2.0"
fileFormat: "zip"
fileSize: "48MB"
cover: "/assets/resources/focus-timer/cover.jpg"
gallery:
  - "/assets/resources/focus-timer/1.jpg"
  - "/assets/resources/focus-timer/2.jpg"
downloadProvider: "baidu-pan"
baiduPanUrl: "https://pan.baidu.com/s/xxxx"
backupUrls: []
extractCode: "8h3d"
downloadNote: "解压后双击启动，如被拦截请加入信任列表"
featured: true
featuredInSoftware: true
status: "active"
publishedAt: "2026-03-20"
updatedAt: "2026-03-24"
---
这里是资源的正文介绍、功能说明、使用教程和更新记录。
```

### 6.2 分类模型

建议在 `src/data/categories.json` 中维护分类元数据：

```json
[
  {
    "name": "独立开发软件",
    "slug": "indie-software",
    "description": "站长独立开发的软件与工具合集",
    "order": 1,
    "featured": true
  },
  {
    "name": "开发资源",
    "slug": "dev-resources",
    "description": "脚本、工具、开发辅助资源",
    "order": 2,
    "featured": true
  }
]
```

### 6.3 公告模型
- 公告建议也使用 Markdown 管理
- 字段包含标题、摘要、发布时间、是否置顶
- 公告页面复用文章模板

### 6.4 标签模型
- 标签优先从资源 Frontmatter 自动聚合生成
- 如需描述性更强的标签页，可补充单独标签配置文件

## 7. 目录结构设计

### 7.1 推荐项目目录

```text
web-source/
├─ public/
│  ├─ assets/
│  │  ├─ brand/
│  │  ├─ resources/
│  │  └─ icons/
│  ├─ robots.txt
│  └─ favicon.svg
├─ src/
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ home/
│  │  ├─ resource/
│  │  ├─ search/
│  │  ├─ theme/
│  │  ├─ motion/
│  │  ├─ ui/
│  │  └─ common/
│  ├─ content/
│  │  ├─ resources/
│  │  ├─ announcements/
│  │  └─ pages/
│  ├─ data/
│  │  ├─ categories.json
│  │  └─ site.ts
│  ├─ layouts/
│  │  ├─ BaseLayout.astro
│  │  ├─ ResourceLayout.astro
│  │  └─ ArticleLayout.astro
│  ├─ lib/
│  │  ├─ content.ts
│  │  ├─ search.ts
│  │  ├─ seo.ts
│  │  └─ routes.ts
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ resources/
│  │  │  └─ index.astro
│  │  ├─ category/
│  │  │  └─ [slug].astro
│  │  ├─ tag/
│  │  │  └─ [slug].astro
│  │  ├─ resource/
│  │  │  └─ [slug].astro
│  │  ├─ search/
│  │  │  └─ index.astro
│  │  ├─ announcements/
│  │  │  ├─ index.astro
│  │  │  └─ [slug].astro
│  │  ├─ about.astro
│  │  └─ disclaimer.astro
│  └─ styles/
│     ├─ tokens.css
│     ├─ theme.css
│     ├─ motion.css
│     ├─ global.css
│     └─ prose.css
├─ scripts/
│  ├─ build-search-index.mjs
│  └─ build-sitemap.mjs
└─ docs/
```

### 7.2 架构解读
- `content/` 放正文内容
- `data/` 放结构化配置
- `components/` 放可复用界面模块
- `layouts/` 放页面骨架模板
- `scripts/` 放构建期处理逻辑

### 7.3 主题样式文件建议
- `tokens.css`：定义语义化设计令牌名称
- `theme.css`：定义浅色/深色主题变量
- `motion.css`：定义浮动、淡入、视差、光效等动画
- `global.css`：全局布局与排版

### 7.4 CSS 变量建议

```css
:root {
  --bg: #f6f2ff;
  --bg-soft: #fff9fe;
  --surface: rgba(255, 255, 255, 0.72);
  --surface-strong: rgba(255, 255, 255, 0.9);
  --text: #221b37;
  --text-muted: #6f648d;
  --line: rgba(139, 117, 181, 0.18);
  --accent: #ff6fb5;
  --accent-2: #7c9dff;
  --glow: 0 20px 60px rgba(124, 157, 255, 0.22);
}

[data-theme="dark"] {
  --bg: #0f1020;
  --bg-soft: #15172d;
  --surface: rgba(24, 28, 54, 0.72);
  --surface-strong: rgba(29, 34, 66, 0.9);
  --text: #f6f1ff;
  --text-muted: #aba4c8;
  --line: rgba(163, 151, 214, 0.2);
  --accent: #ff83c9;
  --accent-2: #8bb8ff;
  --glow: 0 24px 80px rgba(97, 118, 255, 0.35);
}
```

## 8. 页面生成方案

### 8.1 首页生成
- 从资源集合中筛选 `featuredInSoftware=true` 生成软件专区
- 从资源集合中筛选 `featured=true` 生成推荐区
- 按 `updatedAt` 倒序生成最新资源
- 分类入口来自 `categories.json`
- 公告摘要来自公告集合

### 8.2 资源列表页生成
- 读取全部资源
- 支持前端筛选和排序
- 大量资源时分页可在构建时生成多页，或浏览器端分段展示

### 8.3 分类页生成
- 以 `categories.json` 为准生成分类静态路由
- 每个分类页拉取对应分类资源并展示

### 8.4 标签页生成
- 从资源集合自动汇总标签
- 每个标签生成独立静态页面

### 8.5 资源详情页生成
- 每个 `resource.md` 生成一个独立页面
- 页面中自动拼装基础信息区、百度网盘下载区、正文区、相关推荐区

## 9. 搜索系统设计

### 9.1 目标
- 在静态站中提供流畅搜索体验
- 支持软件名称、资源名、摘要、标签、分类、功能关键词搜索
- 不依赖外部搜索服务

### 9.2 方案选择
推荐使用 `Fuse.js` 在浏览器端搜索预构建索引文件。

### 9.3 搜索数据来源
构建时生成 `public/search-index.json`，每条记录建议包含：
- `title`
- `slug`
- `summary`
- `categoryName`
- `type`
- `platform`
- `tags`
- `aliases`
- `keywords`
- `updatedAt`

### 9.4 搜索流程

```text
资源 Markdown / JSON
        │
        ▼
构建脚本提取可搜索字段
        │
        ▼
生成 search-index.json
        │
        ▼
浏览器加载索引
        │
        ▼
Fuse.js 本地匹配
        │
        ▼
搜索结果页展示匹配项
```

### 9.5 搜索交互设计
- 顶部导航常驻搜索入口
- 首页 Hero 区提供大搜索框
- 搜索结果页支持二次筛选
- 搜索结果卡片展示分类、标签、更新时间
- 若无结果，显示推荐分类和热门标签

### 9.6 性能控制
- 索引文件只保留必要字段
- 正文全文不进入首版搜索索引，避免文件过大
- 数据量继续增长时，再切换为分块索引或 Pagefind 类方案

## 10. 百度网盘下载模块设计

### 10.1 设计目标
- 下载信息清晰
- 提取码易复制
- 即使未来更换下载源，也不影响详情页模板

### 10.2 页面展示结构
- 主下载按钮：前往百度网盘
- 提取码展示区
- 一键复制提取码按钮
- 下载说明区
- 备用链接区，可选
- 风险说明区，例如“链接失效请等待更新”
- 可选角色立绘位或主题插画位，作为详情页视觉延展区域

### 10.3 字段兼容设计
虽然当前固定为百度网盘，但建议保留以下抽象字段：
- `downloadProvider`
- `downloadUrl`
- `extractCode`
- `downloadNote`
- `backupUrls`

这样后续如果增加夸克网盘、蓝奏云或官网直链时，无需重构整体模型。

## 11. 组件设计

### 11.1 全站公共组件
- `SiteHeader`
- `SiteFooter`
- `SearchBar`
- `CategoryNav`
- `ResourceCard`
- `TagChip`
- `Pagination`
- `EmptyState`
- `SeoHead`
- `ThemeToggle`
- `FloatingDecorations`
- `IllustrationFrame`

### 11.2 首页组件
- `HeroSection`
- `SoftwareShowcase`
- `FeaturedResources`
- `LatestResources`
- `AnnouncementStrip`
- `HeroVisualStage`
- `AnimeGalleryStrip`

### 11.3 详情页组件
- `ResourceHero`
- `ResourceMeta`
- `DownloadPanel`
- `GallerySection`
- `MarkdownContent`
- `RelatedResources`
- `CharacterArtAside`

### 11.4 搜索与筛选组件
- `SearchInput`
- `FilterBar`
- `SortSwitcher`
- `ResultList`

### 11.5 建议直接采用组件库的部件
- `Switch`：昼夜模式切换
- `Dialog`：图片预览或站点提示
- `Tabs`：详情页的说明 / 更新记录 / 使用教程切换
- `Carousel`：截图轮播与横向插画展示
- `Drawer`：移动端导航和筛选面板
- `Tooltip`：提取码复制提示、图标说明

## 12. 页面模板设计

### 12.1 BaseLayout
用于所有页面：
- 顶部导航
- SEO 元信息
- 页脚
- 全局样式

### 12.2 ResourceLayout
用于资源详情页：
- 资源头图与标题区
- 元信息区
- 下载区
- 正文区
- 推荐区

### 12.3 ArticleLayout
用于公告、关于、免责声明等单页内容：
- 标题
- 元信息
- 正文

## 13. 视觉设计策略

### 13.1 视觉主张
资源站不做重后台风格，也不做普通博客拼贴；首页应像“个人作品展 + 资源目录入口”的结合体，同时整体气质偏向轻梦幻、日系、二次元插画展示感。

### 13.2 页面层级
- 第一层：品牌名与软件作品
- 第二层：搜索与分类导航
- 第三层：资源目录与内容更新
- 第四层：说明页和公告

### 13.3 视觉基调建议
- 深浅分明的内容层级
- 大标题 + 清晰副标题
- 首页少卡片化，重点用分区、背景光晕和插画舞台组织内容
- 详情页强调可读性与下载入口
- 保留多个二次元图片占位区，等待后续填入角色图、横幅图、场景图

### 13.4 二次元视觉元素建议
- Hero 区设置主视觉插画位，适合放站点主角色、看板娘或主题横图
- 分类页和标签页设置横幅图占位区，形成专题氛围
- 资源详情页增加侧边立绘区或截图背景位
- 关于页可放作者头像插画、世界观式介绍图或品牌图

### 13.5 动画设计建议
- 首屏使用分层淡入：标题、搜索框、按钮、插画依次进入
- 背景使用低频漂浮光斑、星点、花瓣或粒子动画
- 卡片悬停采用轻微上浮、描边发光、图片位轻微视差
- 主题切换采用颜色渐变、背景过渡和发光变化，不做突兀硬切
- 截图轮播与标签筛选的切换动画要轻盈，避免厚重后台感

## 14. SEO 与静态优化

### 14.1 SEO 设计
- 每个资源详情页有独立标题与描述
- 分类页与标签页有独立描述
- 自动生成 `sitemap.xml`
- 自动输出 `robots.txt`
- 支持 OG 图与分享描述

### 14.2 静态性能优化
- 封面图压缩并按尺寸输出
- 图片懒加载
- 局部 JS 岛屿化加载
- 搜索脚本只在搜索页和首页加载
- 长列表分页或分块展示

## 15. 部署设计

### 15.1 GitHub Pages 部署流程

```text
本地修改内容
   │
   ▼
git commit / push
   │
   ▼
GitHub Actions 执行构建
   │
   ▼
产出 dist/
   │
   ▼
部署到 GitHub Pages
```

### 15.2 部署注意点
- 注意 `base` 路径配置，兼容仓库子路径部署
- 静态资源路径使用统一前缀处理
- 404 页面需要额外确认 GitHub Pages 行为

## 16. 风险与应对

### 16.1 百度网盘链接失效
- 风险：分享链接可能过期或被取消
- 应对：保留备用链接字段，详情页显示“链接失效请等待更新”

### 16.2 搜索索引膨胀
- 风险：资源数量增多后，搜索数据体积上升
- 应对：首版只索引摘要和关键字段，不索引全文

### 16.3 内容维护成本升高
- 风险：资源数增加后手工维护困难
- 应对：统一 Frontmatter 字段，后续可增加内容校验脚本

### 16.4 GitHub Pages 子路径兼容
- 风险：首页与资源路径在仓库页模式下路径错误
- 应对：在 Astro 配置中统一处理 `base` 路径

## 17. 分阶段实施建议

### 17.1 第一阶段
- 完成首页、资源列表页、详情页、分类页、标签页、关于页、公告页
- 完成百度网盘下载区
- 完成基础搜索

### 17.2 第二阶段
- 优化搜索体验
- 增加 RSS 与 sitemap
- 优化移动端浏览体验

### 17.3 第三阶段
- 接入第三方统计
- 接入第三方评论
- 增加更多主题样式和内容模板

## 18. 最终建议

对于当前这个资源站，最稳妥的系统方案是：
- 用 `Astro` 做静态页面生成
- 用 `Markdown + Frontmatter` 维护资源详情
- 用 `JSON` 维护分类等结构化配置
- 用 `Fuse.js` 做纯前端搜索
- 用统一的下载面板承载百度网盘链接与提取码

这样既符合 GitHub Pages 的部署限制，也为后续资源数量增长和分类扩展留出了足够空间。

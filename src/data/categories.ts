export type CategoryMeta = {
  name: string;
  slug: string;
  description: string;
  featured?: boolean;
};

export const categories: CategoryMeta[] = [
  {
    name: "独立开发软件",
    slug: "indie-software",
    description:
      "集中展示我独立开发的软件作品，突出版本更新、功能定位和适用平台。",
    featured: true,
  },
  {
    name: "开发资源",
    slug: "dev-resources",
    description:
      "整理开发中常用的工具、脚手架、代码片段和静态站资料。",
  },
  {
    name: "效率提升",
    slug: "productivity",
    description:
      "偏向桌面工作流、自动化和日常效率工具的资源集合。",
  },
  {
    name: "模板素材",
    slug: "templates",
    description:
      "收录界面模板、页面模块、展示素材和可复用设计资源。",
  },
  {
    name: "教程指南",
    slug: "guides",
    description:
      "记录搭建过程、使用说明和一些适合长期沉淀的实用教程。",
  },
  {
    name: "其他资源",
    slug: "others",
    description:
      "补充一些暂时不适合归类，但仍然值得保留的个人资源。",
  },
];

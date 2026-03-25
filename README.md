# 酒酒的奇妙空间

一个基于 `Astro + React Islands` 的静态资源分享网站，支持：

- UTF-8 中文内容
- 白天 / 黑夜主题切换
- 二次元视觉占位区
- 独立开发软件展示
- 资源分类、标签与搜索
- 百度网盘下载信息展示

## 本地开发

```bash
npm install
npm run dev
```

## 本地构建

```bash
npm run build
```

## GitHub Pages 部署

项目已经内置 GitHub Pages 工作流。

1. 将仓库推送到 GitHub
2. 在仓库 `Settings -> Pages` 中启用 `GitHub Actions`
3. 推送到默认分支后，工作流会自动构建并部署

如果你有自己的域名或正式站点地址，可以在 Actions 或仓库环境变量中设置：

```bash
SITE_URL=https://your-domain.com
```

## 内容维护

- 资源内容：`src/content/resources/`
- 公告内容：`src/content/announcements/`
- 分类配置：`src/data/categories.ts`
- 站点配置：`src/data/site.ts`

## 图片替换

当前大量图片区域为占位区，后续你可以将真实图片放入：

- `public/assets/resources/`
- `public/assets/decor/`
- `public/assets/brand/`

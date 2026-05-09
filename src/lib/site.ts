const basePath = import.meta.env.BASE_URL ?? "/";

function isExternalUrl(value: string) {
  return (
    /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(value) ||
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  );
}

export function withBase(path: string) {
  if (!path || isExternalUrl(path) || !path.startsWith("/")) {
    return path;
  }

  if (basePath !== "/" && path.startsWith(basePath)) {
    return path;
  }

  const baseUrl = new URL(basePath, "https://site.local");
  const resolved = new URL(path.slice(1), baseUrl);

  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}

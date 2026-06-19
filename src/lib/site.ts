const SITE_URL = (import.meta.env.VITE_SITE_URL || process.env.SITE_URL || "")
  .trim()
  .replace(/\/$/, "");

export function siteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return SITE_URL ? `${SITE_URL}${normalizedPath}` : normalizedPath;
}

export function siteOrigin() {
  return SITE_URL;
}

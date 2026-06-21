const defaultSiteUrl = "https://arcanumwiki.pages.dev";

export const siteConfig = {
  name: "ArcanumWiki",
  shortName: "ArcanumWiki",
  description:
    "A handmade Dungeon Master toolkit and reference archive with no AI slop, no launch-time login wall, and no ad clutter.",
  tagline: "A handmade Dungeon Master toolkit with public pages first.",
  siteUrl: (process.env.SITE_URL || defaultSiteUrl).replace(/\/$/, ""),
  donateUrl: process.env.PUBLIC_DONATE_URL || "https://ko-fi.com",
  githubUrl: "https://github.com/",
};

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${normalized}`;
}

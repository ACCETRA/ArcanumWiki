import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/lib/site";

export async function GET(context) {
  const guides = (await getCollection("guides")).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  return rss({
    title: `${siteConfig.name} Guides`,
    description: "Human-written DM guides from ArcanumWiki.",
    site: context.site ?? siteConfig.siteUrl,
    items: guides.map((guide) => ({
      title: guide.data.title,
      description: guide.data.description,
      pubDate: guide.data.publishedAt,
      link: `/guides/${guide.slug}/`,
    })),
  });
}

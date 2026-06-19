import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { siteUrl } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: pages } = await supabaseAdmin
          .from("pages")
          .select("slug, updated_at")
          .order("updated_at", { ascending: false })
          .limit(5000);
        const { data: users } = await supabaseAdmin
          .from("profiles")
          .select("username, created_at")
          .limit(5000);

        const staticEntries = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/wiki", changefreq: "hourly", priority: "0.9" },
          { path: "/dnd-classes", changefreq: "weekly", priority: "0.8" },
          { path: "/dnd-spells", changefreq: "weekly", priority: "0.8" },
          { path: "/dnd-monsters", changefreq: "weekly", priority: "0.8" },
          { path: "/dnd-items", changefreq: "weekly", priority: "0.8" },
          { path: "/campaigns", changefreq: "daily", priority: "0.8" },
          { path: "/resources", changefreq: "weekly", priority: "0.7" },
          { path: "/contributors", changefreq: "daily", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/auth", changefreq: "yearly", priority: "0.2" },
        ];

        const urls = [
          ...staticEntries.map(
            (e) =>
              `  <url>\n    <loc>${siteUrl(e.path)}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          ),
          ...(pages ?? []).map(
            (p) =>
              `  <url>\n    <loc>${siteUrl(`/wiki/${p.slug}`)}</loc>\n    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
          ),
          ...(users ?? []).map(
            (u) =>
              `  <url>\n    <loc>${siteUrl(`/u/${u.username}`)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.4</priority>\n  </url>`,
          ),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=1800",
          },
        });
      },
    },
  },
});

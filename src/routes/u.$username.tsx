import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Flame, ScrollText } from "lucide-react";
import { siteUrl } from "@/lib/site";

export const Route = createFileRoute("/u/$username")({
  loader: async ({ params }) => {
    const { data: profile } = await supabase
      .from("contributor_stats")
      .select("*")
      .eq("username", params.username)
      .maybeSingle();
    if (!profile) throw notFound();
    const [{ data: pages }, { data: recent }] = await Promise.all([
      supabase
        .from("pages")
        .select("slug, title, category, updated_at")
        .eq("creator_id", profile.id!)
        .order("updated_at", { ascending: false })
        .limit(50),
      supabase
        .from("revisions")
        .select("id, change_note, created_at, char_delta, pages:page_id(slug, title)")
        .eq("editor_id", profile.id!)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    return { profile, pages: pages ?? [], recent: recent ?? [] };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.profile;
    const title = p
      ? `${p.display_name} (@${p.username}) — ArcanumWiki`
      : `@${params.username} — ArcanumWiki`;
    const desc =
      p?.bio ||
      `${p?.display_name ?? params.username} on ArcanumWiki — ${p?.edit_count ?? 0} edits, ${p?.pages_created ?? 0} pages created.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: siteUrl(`/u/${params.username}`) },
      ],
      links: [{ rel: "canonical", href: siteUrl(`/u/${params.username}`) }],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl">No such scribe</h1>
      <p className="text-muted-foreground mt-2">This adventurer has not yet joined the guild.</p>
    </div>
  ),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, pages, recent } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="flex flex-wrap items-center gap-6 border-b border-border pb-8 mb-8">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-24 w-24 rounded-full" />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-arcane to-gold flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {profile.display_name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-3xl">{profile.display_name}</h1>
          <div className="text-muted-foreground">@{profile.username}</div>
          {profile.bio && <p className="mt-3 max-w-prose">{profile.bio}</p>}
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="font-display text-2xl text-gold">{profile.edit_count}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">edits</div>
          </div>
          <div>
            <div className="font-display text-2xl text-gold">{profile.pages_created}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">pages</div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="font-display text-xl mb-3 flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-gold" /> Pages created
          </h2>
          {pages.length === 0 ? (
            <p className="text-muted-foreground text-sm">None yet.</p>
          ) : (
            <ul className="space-y-2">
              {pages.map((p: { slug: string; title: string; category: string }) => (
                <li key={p.slug}>
                  <Link
                    to="/wiki/$slug"
                    params={{ slug: p.slug }}
                    className="block rounded-md border border-border bg-card/60 p-3 hover:border-gold/60"
                  >
                    <div className="text-xs uppercase tracking-widest text-gold">{p.category}</div>
                    <div className="font-display">{p.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="font-display text-xl mb-3 flex items-center gap-2">
            <Flame className="h-5 w-5 text-gold" /> Recent edits
          </h2>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">None yet.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((r: any) => (
                <li key={r.id} className="rounded-md border border-border bg-card/60 p-3 text-sm">
                  {r.pages ? (
                    <Link
                      to="/wiki/$slug"
                      params={{ slug: r.pages.slug }}
                      className="font-medium hover:text-gold"
                    >
                      {r.pages.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Deleted page</span>
                  )}
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {r.change_note || "Edit"} ·{" "}
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

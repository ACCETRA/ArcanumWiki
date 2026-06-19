import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Skull, Sparkles, BookOpenText, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { siteUrl } from "@/lib/site";
import { CATEGORY_META } from "@/lib/categories";
import { HubCard, HubPillLink, HubShell } from "@/components/seo-hub";

// @ts-ignore TanStack route types are regenerated during build.
export const Route = createFileRoute("/dnd-monsters")({
  head: () => ({
    meta: [
      { title: CATEGORY_META.Monsters.seoTitle },
      { name: "description", content: CATEGORY_META.Monsters.seoDescription },
      { property: "og:title", content: CATEGORY_META.Monsters.seoTitle },
      { property: "og:description", content: CATEGORY_META.Monsters.seoDescription },
      { property: "og:url", content: siteUrl("/dnd-monsters") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/dnd-monsters") }],
  }),
  component: DndMonstersPage,
});

function DndMonstersPage() {
  const { data } = useQuery({
    queryKey: ["seo", "monsters"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pages")
        .select("slug, title, summary, updated_at")
        .eq("category", "Monsters")
        .order("view_count", { ascending: false })
        .limit(12);
      return data ?? [];
    },
  });

  const pages = data ?? [];

  return (
    <HubShell
      eyebrow="Monster chapter"
      title="D&D monsters with the room to breathe"
      intro="This page turns the bestiary into a crawlable hub for creatures, encounter ideas, and boss fights. It helps people find threats by topic instead of forcing them through a flat list."
    >
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <HubCard
              icon={Skull}
              title="Encounter ready"
              body="Good monster pages show what the creature does in play, not just the stat block."
            />
            <HubCard
              icon={BookOpenText}
              title="Readable at a glance"
              body="Readers should know threat level, role, and special abilities within seconds."
            />
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="flex items-center gap-2 font-display text-2xl">
              <Sparkles className="h-5 w-5 text-gold" />
              Featured monster pages
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  to="/wiki/$slug"
                  params={{ slug: page.slug }}
                  className="rounded-2xl border border-border/70 bg-background/60 p-4 transition-colors hover:border-gold/60 hover:bg-background"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-gold">Monster page</div>
                  <div className="mt-1 font-display text-lg">{page.title}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                    {page.summary || "A monster reference from the codex."}
                  </div>
                </Link>
              ))}
              {pages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  The bestiary shelf is still being filled.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="font-display text-2xl">What makes a good monster page?</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Stat snapshot at the top.</li>
              <li>Traits and actions in plain language.</li>
              <li>Encounter role and tactics.</li>
              <li>Related pages for lairs, loot, and spells.</li>
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-gold/30 bg-gold/5 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-gold">Start here</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Search the archive for threats by category, then open the page that fits your fight.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <HubPillLink to="/wiki" label="Browse monsters" />
              <HubPillLink to="/wiki/new" label="Write a monster page" />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Related hubs
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <HubPillLink to="/dnd-classes" label="Class hub" />
              <HubPillLink to="/dnd-spells" label="Spell hub" />
              <HubPillLink to="/dnd-items" label="Item hub" />
            </div>
          </div>
          <Link
            to="/wiki"
            search={{ category: "Monsters" } as never}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm hover:border-gold/60 hover:text-gold"
          >
            Open the monster archive <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
            {CATEGORY_META.Monsters.tagline}
          </p>
        </div>
      </div>
    </HubShell>
  );
}

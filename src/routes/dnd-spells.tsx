import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { WandSparkles, Sparkles, BookOpenText, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { siteUrl } from "@/lib/site";
import { CATEGORY_META } from "@/lib/categories";
import { HubCard, HubPillLink, HubShell } from "@/components/seo-hub";

// @ts-ignore TanStack route types are regenerated during build.
export const Route = createFileRoute("/dnd-spells")({
  head: () => ({
    meta: [
      { title: CATEGORY_META.Spells.seoTitle },
      { name: "description", content: CATEGORY_META.Spells.seoDescription },
      { property: "og:title", content: CATEGORY_META.Spells.seoTitle },
      { property: "og:description", content: CATEGORY_META.Spells.seoDescription },
      { property: "og:url", content: siteUrl("/dnd-spells") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/dnd-spells") }],
  }),
  component: DndSpellsPage,
});

function DndSpellsPage() {
  const { data } = useQuery({
    queryKey: ["seo", "spells"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pages")
        .select("slug, title, summary, updated_at")
        .eq("category", "Spells")
        .order("view_count", { ascending: false })
        .limit(12);
      return data ?? [];
    },
  });

  const pages = data ?? [];

  return (
    <HubShell
      eyebrow="Spell chapter"
      title="D&D spells organized like a proper spellbook, not a checklist"
      intro="This landing page is made for readers searching for spells, schools, upcasting notes, and practical references. It gives search engines a real hub and readers a quick way into the archive."
    >
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <HubCard
              icon={WandSparkles}
              title="Magic with structure"
              body="Spell pages work best when they show level, school, casting time, range, and a plain-language summary."
            />
            <HubCard
              icon={BookOpenText}
              title="Find the right spell fast"
              body="People scan for effect, not just name. The archive should feel like a useful reference shelf."
            />
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="flex items-center gap-2 font-display text-2xl">
              <Sparkles className="h-5 w-5 text-gold" />
              Featured spell pages
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  to="/wiki/$slug"
                  params={{ slug: page.slug }}
                  className="rounded-2xl border border-border/70 bg-background/60 p-4 transition-colors hover:border-gold/60 hover:bg-background"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-gold">Spell page</div>
                  <div className="mt-1 font-display text-lg">{page.title}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                    {page.summary || "A spell reference from the codex."}
                  </div>
                </Link>
              ))}
              {pages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  The spellbook shelf is still being filled.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="font-display text-2xl">What makes a good spell page?</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Clear level and school.</li>
              <li>Range, components, and duration up front.</li>
              <li>Short, readable effect summary.</li>
              <li>Links to related classes and items.</li>
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-gold/30 bg-gold/5 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-gold">Start here</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the archive to compare spells by school or class, then open the best match.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <HubPillLink to="/wiki" label="Browse spells" />
              <HubPillLink to="/wiki/new" label="Write a spell page" />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Related hubs
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <HubPillLink to="/dnd-classes" label="Class hub" />
              <HubPillLink to="/dnd-items" label="Item hub" />
              <HubPillLink to="/dnd-monsters" label="Monster hub" />
            </div>
          </div>
          <Link
            to="/wiki"
            search={{ category: "Spells" } as never}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm hover:border-gold/60 hover:text-gold"
          >
            Open the spell archive <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
            {CATEGORY_META.Spells.tagline}
          </p>
        </div>
      </div>
    </HubShell>
  );
}

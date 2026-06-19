import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gem, Sparkles, BookOpenText, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { siteUrl } from "@/lib/site";
import { CATEGORY_META } from "@/lib/categories";
import { HubCard, HubPillLink, HubShell } from "@/components/seo-hub";

// @ts-ignore TanStack route types are regenerated during build.
export const Route = createFileRoute("/dnd-items")({
  head: () => ({
    meta: [
      { title: CATEGORY_META.Items.seoTitle },
      { name: "description", content: CATEGORY_META.Items.seoDescription },
      { property: "og:title", content: CATEGORY_META.Items.seoTitle },
      { property: "og:description", content: CATEGORY_META.Items.seoDescription },
      { property: "og:url", content: siteUrl("/dnd-items") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/dnd-items") }],
  }),
  component: DndItemsPage,
});

function DndItemsPage() {
  const { data } = useQuery({
    queryKey: ["seo", "items"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pages")
        .select("slug, title, summary, updated_at")
        .eq("category", "Items")
        .order("view_count", { ascending: false })
        .limit(12);
      return data ?? [];
    },
  });

  const pages = data ?? [];

  return (
    <HubShell
      eyebrow="Item chapter"
      title="D&D items, relics, and gear pages that actually help players"
      intro="This hub is built for loot hunters, crafters, and DMs who want a clean place to compare items, artifacts, and equipment without losing the story around them."
    >
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <HubCard
              icon={Gem}
              title="Loot with context"
              body="Item pages should explain what the item does, who wants it, and why it matters to the table."
            />
            <HubCard
              icon={BookOpenText}
              title="Practical at a glance"
              body="Rarity, attunement, and effect summary help readers compare items quickly."
            />
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="flex items-center gap-2 font-display text-2xl">
              <Sparkles className="h-5 w-5 text-gold" />
              Featured item pages
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  to="/wiki/$slug"
                  params={{ slug: page.slug }}
                  className="rounded-2xl border border-border/70 bg-background/60 p-4 transition-colors hover:border-gold/60 hover:bg-background"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-gold">Item page</div>
                  <div className="mt-1 font-display text-lg">{page.title}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                    {page.summary || "A gear reference from the codex."}
                  </div>
                </Link>
              ))}
              {pages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  The item shelf is still being filled.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="font-display text-2xl">What makes a good item page?</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Clear rarity and attunement.</li>
              <li>Readable effect summary.</li>
              <li>Story hook or lore tie-in.</li>
              <li>Useful comparisons to similar gear.</li>
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-gold/30 bg-gold/5 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-gold">Start here</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Search the archive for gear that fits your build, then open the item page that
              matters.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <HubPillLink to="/wiki" label="Browse items" />
              <HubPillLink to="/wiki/new" label="Write an item page" />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Related hubs
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <HubPillLink to="/dnd-classes" label="Class hub" />
              <HubPillLink to="/dnd-spells" label="Spell hub" />
              <HubPillLink to="/dnd-monsters" label="Monster hub" />
            </div>
          </div>
          <Link
            to="/wiki"
            search={{ category: "Items" } as never}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm hover:border-gold/60 hover:text-gold"
          >
            Open the item archive <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
            {CATEGORY_META.Items.tagline}
          </p>
        </div>
      </div>
    </HubShell>
  );
}

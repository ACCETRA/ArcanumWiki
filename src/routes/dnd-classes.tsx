import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Swords, Sparkles, BookOpenText, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { siteUrl } from "@/lib/site";
import { CATEGORY_META } from "@/lib/categories";
import { HubCard, HubPillLink, HubShell } from "@/components/seo-hub";

// @ts-ignore TanStack route types are regenerated during build.
export const Route = createFileRoute("/dnd-classes")({
  head: () => ({
    meta: [
      { title: CATEGORY_META.Classes.seoTitle },
      { name: "description", content: CATEGORY_META.Classes.seoDescription },
      { property: "og:title", content: CATEGORY_META.Classes.seoTitle },
      { property: "og:description", content: CATEGORY_META.Classes.seoDescription },
      { property: "og:url", content: siteUrl("/dnd-classes") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/dnd-classes") }],
  }),
  component: DndClassesPage,
});

function DndClassesPage() {
  const { data } = useQuery({
    queryKey: ["seo", "classes"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pages")
        .select("slug, title, summary, updated_at")
        .eq("category", "Classes")
        .order("view_count", { ascending: false })
        .limit(12);
      return data ?? [];
    },
  });

  const pages = data ?? [];

  return (
    <HubShell
      eyebrow="Class chapter"
      title="D&D classes worth reading like a real library shelf"
      intro="This chapter is for players who want more than a quick list. It is a clean landing page for class pages, subclass ideas, and build notes that help readers decide what to play."
    >
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <HubCard
              icon={Swords}
              title="Choose a role"
              body="Frontline, support, control, stealth, or magic. Classes work best when the page explains the table role, not just the stats."
            />
            <HubCard
              icon={BookOpenText}
              title="Show the build"
              body="Readers want progression, subclass identity, and practical notes. Good class pages tell them how the class actually plays."
            />
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="flex items-center gap-2 font-display text-2xl">
              <Sparkles className="h-5 w-5 text-gold" />
              Featured class pages
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  to="/wiki/$slug"
                  params={{ slug: page.slug }}
                  className="rounded-2xl border border-border/70 bg-background/60 p-4 transition-colors hover:border-gold/60 hover:bg-background"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-gold">Class page</div>
                  <div className="mt-1 font-display text-lg">{page.title}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                    {page.summary || "A class reference from the codex."}
                  </div>
                </Link>
              ))}
              {pages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  The class shelf is still being filled.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="font-display text-2xl">What makes a good class page?</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Clear role and fantasy.</li>
              <li>Useful level-by-level breakdowns.</li>
              <li>Subclass notes that help a player choose fast.</li>
              <li>Internal links to related spells, items, and builds.</li>
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-gold/30 bg-gold/5 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-gold">Start here</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the archive to compare classes, then open the page that matches your playstyle.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <HubPillLink to="/wiki" label="Browse classes" />
              <HubPillLink to="/wiki/new" label="Write a class page" />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Related hubs
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <HubPillLink to="/dnd-spells" label="Spell hub" />
              <HubPillLink to="/dnd-items" label="Item hub" />
              <HubPillLink to="/dnd-monsters" label="Monster hub" />
            </div>
          </div>
          <Link
            to="/wiki"
            search={{ category: "Classes" } as never}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm hover:border-gold/60 hover:text-gold"
          >
            Open the class archive <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
            {CATEGORY_META.Classes.tagline}
          </p>
        </div>
      </div>
    </HubShell>
  );
}

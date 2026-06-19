import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowDownAZ, BookOpenText, Clock, Eye, Plus, Search, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, CATEGORY_META, type Category } from "@/lib/categories";
import { siteUrl } from "@/lib/site";
import { BrandMark } from "@/components/BrandMark";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(["recent", "views", "az"]).optional(),
});

export const Route = createFileRoute("/wiki/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse the codex - ArcanumWiki" },
      {
        name: "description",
        content: "Browse every D&D page on ArcanumWiki by category, popularity, or recency.",
      },
      { property: "og:title", content: "Browse the codex - ArcanumWiki" },
      {
        property: "og:description",
        content: "Browse every D&D page by category, popularity, or recency.",
      },
      { property: "og:url", content: siteUrl("/wiki") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/wiki") }],
  }),
  component: Browse,
});

function Browse() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const category = (search.category as Category | undefined) ?? undefined;
  const sort = search.sort ?? "recent";

  const pages = useQuery({
    queryKey: ["pages", { q: search.q, category, sort }],
    queryFn: async () => {
      let query = supabase
        .from("pages")
        .select("slug, title, summary, category, updated_at, view_count");

      if (category) query = query.eq("category", category);

      const term = search.q?.trim();
      if (term) {
        query = query.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
      }

      if (sort === "recent") query = query.order("updated_at", { ascending: false });
      if (sort === "views") query = query.order("view_count", { ascending: false });
      if (sort === "az") query = query.order("title", { ascending: true });

      const { data } = await query.limit(200);
      return data ?? [];
    },
  });
  const archivePages = pages.data ?? [];

  function applySearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate({ search: { ...search, q: q || undefined } as never });
  }

  const categoryMeta = category ? CATEGORY_META[category] : null;
  const selectedCount = archivePages.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <section className="paper-surface relative overflow-hidden rounded-[2rem] border border-border p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-[-7rem] top-[-7rem] h-80 w-80 rounded-full bg-arcane/20 blur-3xl" />
          <div className="absolute right-[-5rem] top-[8rem] h-72 w-72 rounded-full bg-gold/12 blur-3xl" />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-gold">
              <BookOpenText className="h-3.5 w-3.5" /> The archive
            </div>
            <div className="mt-6 flex items-center gap-4">
              <BrandMark className="h-16 w-16 shrink-0" />
              <div className="min-w-0">
                <h1 className="font-display text-4xl leading-tight md:text-6xl">
                  Browse the codex like a real library shelf
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Search by name, filter by chapter, or sort by recency and views. The layout is
                  meant to feel curated, readable, and just a little ceremonial.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <HeroStat label="Pages indexed" value={`${selectedCount}`} />
              <HeroStat label="Categories" value={`${CATEGORIES.length}`} />
              <HeroStat label="Newest filter" value={sort === "recent" ? "Recent" : sort} />
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                to="/wiki/new"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                <Plus className="h-4 w-4" /> New page
              </Link>
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm transition-colors hover:border-gold/60 hover:text-gold"
              >
                <Sparkles className="h-4 w-4" /> Open the campaign vault
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gold/20 bg-background/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                  Search and sort
                </div>
                <div className="mt-1 font-display text-2xl">Find the right chapter fast</div>
              </div>
              <Sparkles className="h-5 w-5 text-gold" />
            </div>

            <form onSubmit={applySearch} className="mt-5 relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search titles and summaries"
                className="w-full rounded-2xl border border-border/70 bg-input/70 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
              />
            </form>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <SortBtn
                cur={sort}
                v="recent"
                icon={<Clock className="h-3.5 w-3.5" />}
                onClick={(v) => navigate({ search: { ...search, sort: v } as never })}
                label="Most recent"
              />
              <SortBtn
                cur={sort}
                v="views"
                icon={<Eye className="h-3.5 w-3.5" />}
                onClick={(v) => navigate({ search: { ...search, sort: v } as never })}
                label="Most viewed"
              />
              <SortBtn
                cur={sort}
                v="az"
                icon={<ArrowDownAZ className="h-3.5 w-3.5" />}
                onClick={(v) => navigate({ search: { ...search, sort: v } as never })}
                label="A to Z"
              />
            </div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                Quick filters
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <FilterPill
                  active={!category}
                  onClick={() => navigate({ search: { ...search, category: undefined } as never })}
                  label="All chapters"
                />
                {CATEGORIES.map((c) => {
                  const Icon = CATEGORY_META[c].icon;
                  return (
                    <FilterPill
                      key={c}
                      active={category === c}
                      onClick={() => navigate({ search: { ...search, category: c } as never })}
                      label={c}
                      icon={<Icon className="h-3.5 w-3.5" />}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {categoryMeta && (
        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rune-border rounded-[1.75rem] border border-border bg-card/70 p-6">
            <div className="flex items-start gap-3">
              {(() => {
                const Icon = categoryMeta.icon;
                return <Icon className="mt-1 h-5 w-5 text-gold" />;
              })()}
              <div>
                <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                  Active chapter
                </div>
                <h2 className="mt-1 font-display text-3xl">{category}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {categoryMeta.description}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-gold/20 bg-gold/5 p-6">
            <div className="text-xs uppercase tracking-[0.26em] text-gold">Starter blueprint</div>
            <div className="mt-2 font-display text-2xl">{categoryMeta.starter.title}</div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              A useful page should feel like a finished reference, not a blank note. The starter
              template keeps that structure in place.
            </p>
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-border bg-card/70 p-5">
            <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Categories
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <SidebarButton
                active={!category}
                onClick={() => navigate({ search: { ...search, category: undefined } as never })}
              >
                All chapters
              </SidebarButton>
              {CATEGORIES.map((c) => {
                const Icon = CATEGORY_META[c].icon;
                return (
                  <SidebarButton
                    key={c}
                    active={category === c}
                    onClick={() => navigate({ search: { ...search, category: c } as never })}
                  >
                    <Icon className="h-4 w-4" />
                    {c}
                  </SidebarButton>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-dashed border-gold/40 bg-gold/5 p-5">
            <div className="flex items-center gap-2 font-display text-lg">
              <Sparkles className="h-4 w-4 text-gold" />
              Need a template?
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Start a new page from a category blueprint so the archive stays consistent as it
              grows.
            </p>
          </div>
        </aside>

        <section>
          <div className="mb-4 text-sm text-muted-foreground">
            {pages.isLoading ? "Summoning the index..." : `${archivePages.length} pages found`}
          </div>

          {archivePages.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-gold/40 p-10 text-center">
              <p className="font-display text-2xl">No pages match this filter.</p>
              <p className="mt-2 text-muted-foreground">
                Try a different chapter or write the first one yourself.
              </p>
              <Link
                to="/wiki/new"
                className="mt-5 inline-flex rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                Create page
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {archivePages.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/wiki/$slug"
                    params={{ slug: p.slug }}
                    className="group flex h-full flex-col rounded-[1.5rem] border border-border bg-card/70 p-5 transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:bg-card"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.26em] text-gold">
                      <span>{p.category}</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {p.view_count}
                      </span>
                    </div>
                    <div className="mt-3 font-display text-2xl leading-tight">{p.title}</div>
                    <p className="mt-2 line-clamp-4 text-sm leading-7 text-muted-foreground">
                      {p.summary || "No summary yet."}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-border bg-background/60 px-4 py-2">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-sm text-foreground">{value}</div>
    </div>
  );
}

function SortBtn({
  cur,
  v,
  label,
  icon,
  onClick,
}: {
  cur: string;
  v: "recent" | "views" | "az";
  label: string;
  icon: ReactNode;
  onClick: (v: "recent" | "views" | "az") => void;
}) {
  return (
    <button
      onClick={() => onClick(v)}
      className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-left text-sm transition-colors ${
        cur === v
          ? "border-gold/60 bg-gold/10 text-gold"
          : "border-border bg-background/60 hover:border-gold/40 hover:text-gold"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function FilterPill({
  active,
  label,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
        active
          ? "border-gold/60 bg-gold/10 text-gold"
          : "border-border bg-background/60 hover:border-gold/40 hover:text-gold"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SidebarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left transition-colors ${
        active ? "bg-gold/10 text-gold" : "hover:bg-muted/60"
      }`}
    >
      {children}
    </button>
  );
}

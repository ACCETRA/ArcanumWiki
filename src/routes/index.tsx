import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BookOpenText,
  Dice6,
  Flame,
  History,
  MapPinned,
  Search,
  Shield,
  Sparkles,
  Star,
  ScrollText,
  Users,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/BrandMark";
import { CATEGORY_META, CATEGORIES, HOME_PORTALS } from "@/lib/categories";
import { siteUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArcanumWiki - The D&D community codex" },
      {
        name: "description",
        content:
          "A community-built Dungeons & Dragons hub for classes, races, spells, monsters, lore, campaigns, and homebrew.",
      },
      { property: "og:title", content: "ArcanumWiki - The D&D community codex" },
      {
        property: "og:description",
        content:
          "Search the codex, explore the campaign vault, and find everything a D&D community needs in one place.",
      },
      { property: "og:url", content: siteUrl("/") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/") }],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const recentPages = useQuery({
    queryKey: ["home", "recent-pages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pages")
        .select("slug, title, summary, category, updated_at")
        .order("updated_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const popularPages = useQuery({
    queryKey: ["home", "popular-pages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pages")
        .select("slug, title, summary, category, view_count")
        .order("view_count", { ascending: false })
        .limit(4);
      return data ?? [];
    },
  });

  const contributors = useQuery({
    queryKey: ["home", "contributors"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contributor_stats")
        .select("username, display_name, avatar_url, edit_count, pages_created")
        .order("edit_count", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const counts = useQuery({
    queryKey: ["home", "stats"],
    queryFn: async () => {
      const [{ count: pages }, { count: edits }, { count: people }] = await Promise.all([
        supabase.from("pages").select("*", { count: "exact", head: true }),
        supabase.from("revisions").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);

      return {
        pages: pages ?? 0,
        edits: edits ?? 0,
        people: people ?? 0,
      };
    },
  });

  const recentArchive = recentPages.data ?? [];
  const popularArchive = popularPages.data ?? [];
  const contributorArchive = contributors.data ?? [];
  const emptyArchive = recentArchive.length === 0;
  const emptyPopular = popularArchive.length === 0;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-70 pointer-events-none">
        <div className="absolute left-[-8rem] top-[-6rem] h-96 w-96 rounded-full bg-arcane/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-32 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3 rounded-[1.4rem] border border-border/70 bg-card/80 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
              <BrandMark className="h-12 w-12 rounded-full border border-border/60" />
              <div className="leading-tight">
                <div className="font-display text-lg font-bold tracking-wide">
                  Arcanum<span className="text-gold">Wiki</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                  a hand-built d&d archive
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-4 py-1 text-xs uppercase tracking-[0.28em] text-gold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Built like a living reference shelf
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 max-w-4xl font-display text-5xl leading-tight md:text-7xl"
            >
              An editorial home for{" "}
              <span className="text-gold">Dungeons &amp; Dragons knowledge</span>,{" "}
              <span className="text-arcane">campaigns</span>, and community-made lore.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground"
            >
              Browse a living codex for classes, races, spells, monsters, items, lore, homebrew, and
              campaigns. Search fast, write clearly, and credit every adventurer who adds to the
              archive.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/wiki", search: { q: q.trim() } as never });
              }}
              className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-border/70 bg-card/80 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.2)]"
            >
              <Search className="ml-3 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the codex for spells, classes, monsters, or lore"
                className="w-full bg-transparent px-2 py-3 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                Search
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <Link
                to="/wiki"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                <ScrollText className="h-4 w-4" />
                Browse the codex
              </Link>
              <Link
                to="/wiki/new"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-3 text-sm font-semibold transition-colors hover:bg-gold/10"
              >
                Add a page <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Open campaign vault
              </Link>
            </motion.div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <Link
                to={"/dnd-classes" as any}
                className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 hover:border-gold/50 hover:text-gold"
              >
                D&D classes
              </Link>
              <Link
                to={"/dnd-spells" as any}
                className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 hover:border-gold/50 hover:text-gold"
              >
                D&D spells
              </Link>
              <Link
                to={"/dnd-monsters" as any}
                className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 hover:border-gold/50 hover:text-gold"
              >
                D&D monsters
              </Link>
              <Link
                to={"/dnd-items" as any}
                className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 hover:border-gold/50 hover:text-gold"
              >
                D&D items
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Metric label="Pages" value={counts.data?.pages ?? 0} />
              <Metric label="Edits" value={counts.data?.edits ?? 0} />
              <Metric label="Scribes" value={counts.data?.people ?? 0} />
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rune-border paper-surface rounded-[2rem] border border-border p-6 md:p-7"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gold">
                <Dice6 className="h-3.5 w-3.5" />
                Quick start
              </div>
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Community first
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {starterFlow.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-border/80 bg-background/55 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-sm text-gold">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-display text-lg">{step.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-4">
              <div className="font-display text-xl">Everything available, one click away</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the wiki for knowledge, the campaign vault for table state, and the resources
                page for tools and references.
              </p>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HOME_PORTALS.map((portal, index) => {
            const Icon = CATEGORY_META[portal.category].icon;
            return (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-32px" }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to="/wiki"
                  search={{ category: portal.category } as never}
                  className="rune-border paper-surface group block h-full rounded-[1.5rem] border border-border p-5 transition-colors hover:bg-card"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-gold" />
                    <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {portal.category}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl group-hover:text-gold transition-colors">
                    {portal.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{portal.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[2rem] border border-border paper-surface p-6 md:p-8">
            <SectionHeading
              icon={BookOpenText}
              title="The codex chapters"
              description="Every major D&D category, laid out as a curated community reference shelf."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {CATEGORIES.map((category, index) => {
                const Icon = CATEGORY_META[category].icon;
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      to="/wiki"
                      search={{ category } as never}
                      className="group block rounded-2xl border border-border/80 bg-background/55 p-4 transition-colors hover:border-gold/50 hover:bg-background"
                    >
                      <Icon className="h-8 w-8 text-gold" />
                      <div className="mt-3 font-display text-xl group-hover:text-gold transition-colors">
                        {category}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {CATEGORY_META[category].tagline}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <InfoCard
              icon={Shield}
              title="Credit every creator"
              body="Every page, edit, and profile is built to keep authors visible. That makes the site feel like a real community archive instead of a static wiki dump."
            />
            <InfoCard
              icon={WandSparkles}
              title="Write with structure"
              body="Starter blueprints help new pages begin with the right sections, so the archive stays readable even as it grows."
            />
            <InfoCard
              icon={MapPinned}
              title="Keep the table together"
              body="Campaigns, maps, sheets, recaps, notes, and homebrew all belong in one place for each group."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <Panel
              icon={History}
              title="Recently inscribed"
              subtitle="New and updated pages from the community."
            >
              {emptyArchive ? (
                <EmptyState
                  title="The archive is waiting for its first chapter"
                  body="Create the first pages and this section will start filling with recent lore, rules, and homebrew."
                  ctaLabel="Write the first page"
                  ctaTo="/wiki/new"
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {recentArchive.map((page) => (
                    <ArchiveCard
                      key={page.slug}
                      to={`/wiki/${page.slug}`}
                      tag={page.category}
                      title={page.title}
                      body={page.summary || "No summary yet."}
                      meta={new Date(page.updated_at).toLocaleDateString()}
                    />
                  ))}
                </div>
              )}
            </Panel>

            <Panel
              icon={Star}
              title="Most viewed"
              subtitle="What the community returns to most often."
            >
              {emptyPopular ? (
                <EmptyState
                  title="Popular pages will surface here"
                  body="Once readers start exploring, the most visited entries will rise to the top automatically."
                  ctaLabel="Browse the codex"
                  ctaTo="/wiki"
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {popularArchive.map((page) => (
                    <ArchiveCard
                      key={page.slug}
                      to={`/wiki/${page.slug}`}
                      tag={page.category}
                      title={page.title}
                      body={page.summary || "No summary yet."}
                      meta={`${page.view_count} views`}
                    />
                  ))}
                </div>
              )}
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel icon={Users} title="Top scribes" subtitle="The most active authors on the site.">
              <div className="space-y-3">
                {contributorArchive.map((contributor, index) => (
                  <Link
                    key={contributor.username}
                    to="/u/$username"
                    params={{ username: contributor.username! }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-3 transition-colors hover:border-gold/50"
                  >
                    <span className="font-display text-lg text-gold w-6 text-right">
                      {index + 1}
                    </span>
                    {contributor.avatar_url ? (
                      <img
                        src={contributor.avatar_url}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-arcane to-gold" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{contributor.display_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {contributor.edit_count} edits - {contributor.pages_created} pages
                      </div>
                    </div>
                    <Flame className="h-4 w-4 text-gold/80" />
                  </Link>
                ))}
                {contributorArchive.length === 0 && (
                  <EmptyState
                    title="No scribes yet"
                    body="Sign in and claim the first chapters of the codex."
                    ctaLabel="Sign in"
                    ctaTo="/auth"
                  />
                )}
              </div>
            </Panel>

            <Panel
              icon={BookOpen}
              title="How the site works"
              subtitle="The fastest route from idea to published page."
            >
              <div className="space-y-3">
                {workflow.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-background/60 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-xs text-gold">
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-display text-base">{item.title}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
            <SectionHeading
              icon={Shield}
              title="Campaign vault"
              description="The table-state layer for every long-running game, built to feel like part of the archive."
            />
            <p className="mt-4 text-muted-foreground">
              Use campaigns to store maps, character sheets, session recaps, notes, and homebrew
              spellbooks so your group always has the latest version of the world.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {campaignFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-border bg-background/60 p-4 text-sm"
                >
                  {feature}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/campaigns"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                Open the vault
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
              >
                See tools and references
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
            <SectionHeading
              icon={Flame}
              title="What makes it the best community page"
              description="A D&D home needs more than a search box. It needs structure, authorship, and momentum."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {valueProps.map((prop) => (
                <div
                  key={prop.title}
                  className="rounded-2xl border border-border/80 bg-background/60 p-4"
                >
                  <prop.icon className="h-5 w-5 text-gold" />
                  <div className="mt-3 font-display text-lg">{prop.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{prop.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 text-gold" />
        <div>
          <div className="font-display text-3xl">{title}</div>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gold" />
        <h2 className="font-display text-3xl">{title}</h2>
      </div>
      <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 text-center">
      <div className="font-display text-3xl text-gold">{value.toLocaleString()}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
      <Icon className="h-5 w-5 text-gold" />
      <div className="mt-3 font-display text-2xl">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function ArchiveCard({
  to,
  tag,
  title,
  body,
  meta,
}: {
  to: string;
  tag: string;
  title: string;
  body: string;
  meta: string;
}) {
  return (
    <Link
      to={to as never}
      className="group rounded-2xl border border-border bg-card/60 p-4 transition-colors hover:border-gold/50 hover:bg-card"
    >
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
        <span className="text-gold">{tag}</span>
        <span>{meta}</span>
      </div>
      <div className="mt-2 font-display text-xl group-hover:text-gold transition-colors">
        {title}
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{body}</p>
    </Link>
  );
}

function EmptyState({
  title,
  body,
  ctaLabel,
  ctaTo,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-6 text-center">
      <div className="font-display text-2xl">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Link
        to={ctaTo as never}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
      >
        {ctaLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

const starterFlow = [
  {
    title: "Search the archive",
    body: "Jump straight to classes, monsters, spells, lore, or a campaign note with one query.",
  },
  {
    title: "Use a blueprint",
    body: "Start with a category template so new pages look complete and stay readable.",
  },
  {
    title: "Credit every edit",
    body: "Profiles and revisions keep authors visible so the community can grow with trust.",
  },
];

const workflow = [
  {
    title: "Find the right chapter",
    body: "Use the categories to narrow your path before you start writing or reading.",
  },
  {
    title: "Build with structure",
    body: "Starter templates make it easy to capture the important details of a D&D entry.",
  },
  {
    title: "Publish and revisit",
    body: "New pages, edits, and views rise into the archive automatically.",
  },
];

const campaignFeatures = [
  "Campaign overviews and worlds",
  "Characters, portraits, and sheets",
  "Uploaded maps and handouts",
  "Session recaps and important points",
  "DM notes, quests, NPCs, and lore",
  "Homebrew spellbooks and custom rules",
];

const valueProps = [
  {
    icon: BookOpenText,
    title: "Everything has a place",
    body: "Classes, lore, campaigns, and homebrew are organized into clear chapters.",
  },
  {
    icon: Users,
    title: "Built for the community",
    body: "The site makes authors visible, which helps readers trust what they find.",
  },
  {
    icon: Search,
    title: "Search first, scroll less",
    body: "Fast search and sorting help people find answers instead of hunting through menus.",
  },
  {
    icon: Sparkles,
    title: "Easy to expand",
    body: "The templates and vault structure make future D&D content easier to add.",
  },
];

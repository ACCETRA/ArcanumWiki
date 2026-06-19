import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import {
  Edit3,
  History as HistoryIcon,
  Eye,
  Trash2,
  ListTree,
  Clock3,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { deleteOwnPage, incrementView } from "@/lib/wiki.functions";
import { formatDistanceToNow } from "date-fns";
import { CATEGORY_META, getCategoryHub, type Category } from "@/lib/categories";
import { estimateReadTime, extractToc } from "@/lib/wiki-content";
import { slugify } from "@/lib/categories";
import { siteUrl } from "@/lib/site";

type ProfileRef = {
  username: string;
  display_name: string;
  avatar_url: string | null;
};

export const Route = createFileRoute("/wiki/$slug")({
  loader: async ({ params }) => {
    const { data: page } = await supabase
      .from("pages")
      .select("*, profiles:creator_id(username, display_name, avatar_url)")
      .eq("slug", params.slug)
      .maybeSingle();
    if (!page) throw notFound();

    const [{ data: contributors }, { data: related }] = await Promise.all([
      supabase
        .from("revisions")
        .select("editor_id, profiles:editor_id(username, display_name, avatar_url)")
        .eq("page_id", page.id)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("pages")
        .select("slug, title, summary, category, view_count, updated_at")
        .eq("category", page.category)
        .neq("slug", params.slug)
        .order("view_count", { ascending: false })
        .limit(4),
    ]);

    return { page, contributors: contributors ?? [], related: related ?? [] };
  },
  head: ({ loaderData, params }) => {
    const page = loaderData?.page;
    const categoryMeta = page ? CATEGORY_META[page.category as Category] : null;
    const title = page ? `${page.title} - ArcanumWiki` : "ArcanumWiki";
    const desc =
      page?.summary ||
      categoryMeta?.seoDescription ||
      `Read about ${page?.title ?? params.slug} on ArcanumWiki, the community D&D compendium.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: siteUrl(`/wiki/${params.slug}`) },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: siteUrl(`/wiki/${params.slug}`) }],
      scripts: page
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: page.title,
                description: desc,
                articleSection: page.category,
                dateModified: page.updated_at,
                datePublished: page.created_at,
              }),
            },
          ]
        : undefined,
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl text-gold">Unwritten</h1>
      <p className="text-muted-foreground mt-2">No page exists at this slug yet.</p>
      <Link
        to="/wiki/new"
        className="mt-6 inline-flex rounded-md bg-gold text-primary-foreground px-4 py-2 font-semibold hover:bg-gold-soft"
      >
        Write it
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl text-destructive">Could not load page</h1>
      <p className="text-muted-foreground mt-2">{error.message}</p>
    </div>
  ),
  component: PageView,
});

function PageView() {
  const { page, contributors, related } = Route.useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const incView = useServerFn(incrementView);
  const delFn = useServerFn(deleteOwnPage);

  useEffect(() => {
    incView({ data: { slug: page.slug } }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.slug]);

  const toc = useMemo(() => extractToc(page.content), [page.content]);
  const readTime = useMemo(() => estimateReadTime(page.content), [page.content]);
  const uniqueContributors = Array.from(
    new Map(contributors.map((c: any) => [c.editor_id, c.profiles])).values(),
  ).filter(Boolean) as Array<ProfileRef>;
  const creator = page.profiles as ProfileRef | null;
  const categoryMeta = CATEGORY_META[page.category as Category];
  const categoryHub = getCategoryHub(page.category as Category);
  const relatedSearchLabel = `Browse more ${page.category.toLowerCase()}`;

  async function onDelete() {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    try {
      await delFn({ data: { slug: page.slug } });
      navigate({ to: "/wiki" });
    } catch (e: any) {
      alert(e?.message ?? "Could not delete page.");
    }
  }

  return (
    <article className="mx-auto max-w-7xl px-4 py-10">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-[2rem] border border-border bg-card/70 p-6 md:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.26em] text-muted-foreground">
              <Link
                to="/wiki"
                search={{ category: page.category } as never}
                className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-gold transition-colors hover:border-gold/60 hover:bg-gold/10"
              >
                {page.category}
              </Link>
              {categoryHub?.path && (
                <Link
                  to={categoryHub.path as never}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 transition-colors hover:border-gold/60 hover:text-gold"
                >
                  {categoryHub.label}
                </Link>
              )}
            </div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">{page.title}</h1>
            {page.summary && (
              <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
                {page.summary}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <MetaPill icon={<Eye className="h-3.5 w-3.5" />} text={`${page.view_count} views`} />
              <MetaPill icon={<Clock3 className="h-3.5 w-3.5" />} text={`${readTime} min read`} />
              <MetaPill
                icon={<Sparkles className="h-3.5 w-3.5" />}
                text={`Updated ${formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/wiki/$slug/history"
              params={{ slug: page.slug }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-gold/60 hover:text-gold"
            >
              <HistoryIcon className="h-4 w-4" /> History
            </Link>
            <Link
              to="/wiki/$slug/edit"
              params={{ slug: page.slug }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
            >
              <Edit3 className="h-4 w-4" /> Edit
            </Link>
            {user && creator && user.id === page.creator_id && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-md border border-destructive/60 text-destructive px-3 py-1.5 text-sm hover:bg-destructive/10"
                title="Only you can delete this page (you created it)"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="prose-wiki text-foreground/95 rounded-[2rem] border border-border bg-card/50 p-6 md:p-8">
            {page.content.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: Heading("h2"),
                  h3: Heading("h3"),
                }}
              >
                {page.content}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                This page is a stub. Press <em>Edit</em> to begin.
              </p>
            )}
          </div>

          {categoryHub?.path && (
            <div className="mt-6 rounded-[1.5rem] border border-gold/20 bg-gold/5 p-5">
              <div className="text-xs uppercase tracking-[0.26em] text-gold">Chapter link</div>
              <div className="mt-2 font-display text-2xl">{categoryHub.label}</div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {categoryHub.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={categoryHub.path as never}
                  className="inline-flex items-center rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
                >
                  Open hub
                </Link>
                <Link
                  to="/wiki"
                  search={{ category: page.category } as never}
                  className="inline-flex items-center rounded-full border border-border bg-background/60 px-4 py-2 text-sm transition-colors hover:border-gold/60 hover:text-gold"
                >
                  {relatedSearchLabel}
                </Link>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="font-display text-lg">Page guide</div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{categoryMeta.description}</p>
            <div className="mt-4 grid gap-3 text-sm">
              <MetaRow label="Created" value={new Date(page.created_at).toLocaleDateString()} />
              <MetaRow
                label="Edited"
                value={formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}
              />
              <MetaRow label="Scribes" value={`${uniqueContributors.length}`} />
            </div>
          </div>

          {toc.length > 0 && (
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="flex items-center gap-2 font-display text-lg">
                <ListTree className="h-4 w-4 text-gold" />
                Table of contents
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id} style={{ marginLeft: item.depth === 3 ? "0.75rem" : 0 }}>
                    <a href={`#${item.id}`} className="text-muted-foreground hover:text-gold">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="font-display text-lg">Related pages</div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              More pages from the same chapter, ordered by what readers use most often.
            </p>
            <div className="mt-4 space-y-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to="/wiki/$slug"
                  params={{ slug: item.slug }}
                  className="block rounded-2xl border border-border/70 bg-background/60 p-3 transition-colors hover:border-gold/60 hover:bg-background"
                >
                  <div className="text-xs uppercase tracking-widest text-gold">{item.category}</div>
                  <div className="mt-1 font-medium">{item.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {item.summary || "No summary yet."}
                  </div>
                </Link>
              ))}
              {related.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  This chapter has no nearby pages yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-dashed border-gold/40 bg-gold/5 p-5">
            <div className="font-display text-lg">Originally inscribed by</div>
            {creator ? (
              <Link
                to="/u/$username"
                params={{ username: creator.username }}
                className="mt-3 flex items-center gap-3 hover:text-gold"
              >
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.display_name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-arcane to-gold" />
                )}
                <div>
                  <div className="font-medium">{creator.display_name}</div>
                  <div className="text-sm text-muted-foreground">@{creator.username}</div>
                </div>
              </Link>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Unknown author.</p>
            )}
          </div>
        </aside>
      </div>

      <footer className="mt-12 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {uniqueContributors.length} {uniqueContributors.length === 1 ? "scribe" : "scribes"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-3 py-1">
            <Eye className="h-3.5 w-3.5 text-gold" />
            {page.view_count} views
          </span>
          {categoryHub?.path && (
            <Link
              to={categoryHub.path as never}
              className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-gold transition-colors hover:border-gold/60 hover:bg-gold/10"
            >
              {categoryHub.label}
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}

function Heading(tag: "h2" | "h3") {
  return function HeadingRenderer({ children }: { children?: React.ReactNode }) {
    const text = typeof children === "string" ? children : flattenText(children);
    const id = slugify(text);
    const classes = tag === "h2" ? "group" : "group";
    if (tag === "h2") {
      return (
        <h2 id={id} className={`scroll-mt-24 font-display text-2xl mt-10 mb-3 ${classes}`}>
          {children}
        </h2>
      );
    }
    return (
      <h3 id={id} className={`scroll-mt-24 font-display text-xl mt-8 mb-2 ${classes}`}>
        {children}
      </h3>
    );
  };
}

function flattenText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return flattenText((node as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

function MetaPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-3 py-1">
      {icon}
      {text}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/60 px-3 py-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

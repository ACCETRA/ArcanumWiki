import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, FileText, Sparkles, WandSparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { BrandMark } from "@/components/BrandMark";
import { CATEGORIES, CATEGORY_META, type Category, getStarterTemplate } from "@/lib/categories";
import { createPage } from "@/lib/wiki.functions";

export const Route = createFileRoute("/wiki/new")({
  head: () => ({
    meta: [{ title: "Create a new page - ArcanumWiki" }, { name: "robots", content: "noindex" }],
  }),
  component: NewPage,
});

function NewPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const create = useServerFn(createPage);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<Category>("Lore");
  const [content, setContent] = useState(() => getStarterTemplate("Lore").content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const starter = getStarterTemplate(category);
  const fieldClass =
    "w-full rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/wiki/new" } as never });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!content.trim()) {
      setContent(starter.content);
    }
  }, [category, content, starter.content]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { slug } = await create({ data: { title, summary, category, content } });
      navigate({ to: "/wiki/$slug", params: { slug } });
    } catch (e: any) {
      setError(e?.message ?? "Could not create the page.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="paper-surface relative overflow-hidden rounded-[2rem] border border-border p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-[-7rem] top-[-7rem] h-80 w-80 rounded-full bg-arcane/18 blur-3xl" />
          <div className="absolute right-[-6rem] bottom-[-6rem] h-80 w-80 rounded-full bg-gold/14 blur-3xl" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-gold">
              <Sparkles className="h-3.5 w-3.5" /> New page
            </div>
            <div className="mt-6 flex items-center gap-4">
              <BrandMark className="h-16 w-16 shrink-0" />
              <div>
                <h1 className="font-display text-4xl leading-tight md:text-6xl">
                  Inscribe a page into the codex
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Add to the archive with a clean structure, a strong summary, and a category that
                  helps readers find it later.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gold/20 bg-background/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="flex items-center gap-2 font-display text-2xl">
              <FileText className="h-5 w-5 text-gold" />
              Choose a chapter
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Every category begins with a blueprint so the page reads like a finished reference.
            </p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-4 w-full rounded-2xl border border-border/70 bg-input px-4 py-3 text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {CATEGORY_META[category].description}
            </p>
            <button
              type="button"
              onClick={() => setContent(starter.content)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              <WandSparkles className="h-4 w-4" /> Insert {category} template
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Page title (e.g. ${starter.title})`}
              minLength={2}
              maxLength={120}
              required
              className={`${fieldClass} font-display text-2xl`}
            />
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={starter.summary}
              rows={2}
              maxLength={280}
              className={fieldClass}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder={starter.content}
              className="w-full rounded-[1.5rem] border border-border/70 bg-background/75 px-4 py-3 font-mono text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="font-display text-2xl">Template support</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use the starter structure to keep the page readable and consistent with the rest of
                the archive.
              </p>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
                  Strong title
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
                  One-line summary
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2">
                  Structured body copy
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-dashed border-gold/40 bg-gold/5 p-5">
              <div className="flex items-center gap-2 font-display text-lg">
                <WandSparkles className="h-4 w-4 text-gold" />
                Before you publish
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Keep the summary concise, use headings for structure, and link out to related pages
                when it helps readers move through the archive.
              </p>
              <Link
                to="/wiki"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-soft"
              >
                Browse the archive <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {saving ? "Forging..." : "Create page"} <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/wiki" })}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 transition-colors hover:border-gold/60 hover:text-gold"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

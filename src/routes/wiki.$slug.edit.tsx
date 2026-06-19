import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { BrandMark } from "@/components/BrandMark";
import { CATEGORY_META, CATEGORIES, type Category, getStarterTemplate } from "@/lib/categories";
import { savePageEdit } from "@/lib/wiki.functions";
import { ArrowRight, Eye, FileText, Save, Sparkles, WandSparkles } from "lucide-react";

export const Route = createFileRoute("/wiki/$slug/edit")({
  head: ({ params }) => ({
    meta: [{ title: `Edit · ${params.slug} - ArcanumWiki` }, { name: "robots", content: "noindex" }],
  }),
  component: EditPage,
});

function EditPage() {
  const { slug } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const save = useServerFn(savePageEdit);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<Category>("Lore");
  const [content, setContent] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const starter = getStarterTemplate(category);
  const fieldClass =
    "w-full rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: `/wiki/${slug}/edit` } as never });
  }, [loading, user, navigate, slug]);

  useEffect(() => {
    supabase
      .from("pages")
      .select("title, summary, category, content")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setSummary(data.summary);
          setCategory(data.category as Category);
          setContent(data.content);
        }
        setLoaded(true);
      });
  }, [slug]);

  const charCount = useMemo(() => content.length, [content]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await save({ data: { slug, title, summary, category, content, change_note: changeNote } });
      navigate({ to: "/wiki/$slug", params: { slug } });
    } catch (e: any) {
      setError(e?.message ?? "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-muted-foreground">
        Summoning the page...
      </div>
    );
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
              <FileText className="h-3.5 w-3.5" /> Editing page
            </div>
            <div className="mt-6 flex items-center gap-4">
              <BrandMark className="h-16 w-16 shrink-0" />
              <div>
                <h1 className="font-display text-4xl leading-tight md:text-6xl">
                  Editing <span className="text-gold">{title || slug}</span>
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Keep the page structured, searchable, and easy to revisit later.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gold/20 bg-background/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="flex items-center gap-2 font-display text-2xl">
              <WandSparkles className="h-5 w-5 text-gold" />
              Category guide
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Choose the chapter that best fits the page, then use the starter blueprint if you
              need a clearer structure.
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
              <WandSparkles className="h-4 w-4" /> Insert blueprint
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title"
              className={`${fieldClass} font-display text-2xl`}
              required
              minLength={2}
              maxLength={120}
            />
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One-sentence summary (shown on cards and search)"
              rows={2}
              maxLength={280}
              className={fieldClass}
            />

            <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/70">
              <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-background/60 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setTab("edit")}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    tab === "edit" ? "bg-gold/10 text-gold" : "hover:bg-muted/60"
                  }`}
                >
                  <Save className="h-4 w-4" /> Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    tab === "preview" ? "bg-gold/10 text-gold" : "hover:bg-muted/60"
                  }`}
                >
                  <Eye className="h-4 w-4" /> Preview
                </button>
                <span className="ml-auto text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {charCount.toLocaleString()} chars
                </span>
              </div>
              {tab === "edit" ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Heading&#10;&#10;Write the page in Markdown. Supports **bold**, _italic_, [links](https://example.com), tables, lists, and code."
                  rows={24}
                  className="min-h-[420px] w-full rounded-none border-0 bg-background/75 px-4 py-3 font-mono text-sm outline-none"
                />
              ) : (
                <div className="prose-wiki min-h-[420px] p-6">
                  {content.trim() ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  ) : (
                    <p className="italic text-muted-foreground">Nothing to preview yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="font-display text-2xl">Editing notes</div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                <li>Use headings so readers get a clear map of the page.</li>
                <li>Keep the summary short and readable in search results.</li>
                <li>Add tables for stats, traits, or spell details whenever they help.</li>
              </ul>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <label className="block text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Change note
              </label>
              <input
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
                placeholder="What did you change?"
                maxLength={200}
                className="mt-3 w-full rounded-2xl border border-border/70 bg-input px-4 py-3 text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Shown in the page history beside your name.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-dashed border-gold/40 bg-gold/5 p-5">
              <div className="flex items-center gap-2 font-display text-lg">
                <Sparkles className="h-4 w-4 text-gold" />
                Category context
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Each chapter has its own structure and search intent. Matching the page to the
                category helps it rank and helps readers trust it.
              </p>
              <div className="mt-4 rounded-2xl border border-border/70 bg-background/60 px-3 py-2 text-sm">
                {CATEGORY_META[category].tagline}
              </div>
            </div>
            {error && (
              <div className="rounded-2xl border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {saving ? "Sealing..." : "Save & credit me"}
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/wiki/$slug", params: { slug } })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm transition-colors hover:border-gold/60 hover:text-gold"
            >
              Cancel <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      </div>
    </form>
  );
}

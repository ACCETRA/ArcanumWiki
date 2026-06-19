import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Plus, Minus, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/wiki/$slug/history")({
  head: ({ params }) => ({
    meta: [{ title: `History · ${params.slug} — ArcanumWiki` }, { name: "robots", content: "noindex" }],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { slug } = Route.useParams();
  const data = useQuery({
    queryKey: ["history", slug],
    queryFn: async () => {
      const { data: page } = await supabase
        .from("pages")
        .select("id, title")
        .eq("slug", slug)
        .maybeSingle();
      if (!page) return null;
      const { data: revs } = await supabase
        .from("revisions")
        .select("id, change_note, char_delta, created_at, profiles:editor_id(username, display_name, avatar_url)")
        .eq("page_id", page.id)
        .order("created_at", { ascending: false });
      return { page, revs: revs ?? [] };
    },
  });

  if (data.isLoading) return <div className="mx-auto max-w-3xl px-4 py-20 text-muted-foreground">Unrolling the scroll…</div>;
  if (!data.data?.page) return <div className="mx-auto max-w-3xl px-4 py-20">Page not found.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/wiki/$slug"
        params={{ slug }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to page
      </Link>
      <h1 className="mt-4 font-display text-3xl">History of <span className="text-gold">{data.data.page.title}</span></h1>
      <p className="text-muted-foreground mt-1">{data.data.revs.length} revisions, every one credited.</p>

      <ol className="mt-8 relative border-l border-border ml-3 space-y-6">
        {data.data.revs.map((r: any) => {
          const p = r.profiles;
          const positive = r.char_delta >= 0;
          return (
            <li key={r.id} className="pl-6 relative">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-gold ring-4 ring-background" />
              <div className="flex items-center gap-3">
                {p?.avatar_url ? (
                  <img src={p.avatar_url} alt="" className="h-7 w-7 rounded-full" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-arcane to-gold" />
                )}
                <div className="flex-1">
                  <div className="text-sm">
                    {p ? (
                      <Link to="/u/$username" params={{ username: p.username }} className="text-gold hover:underline font-semibold">
                        {p.display_name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Unknown</span>
                    )}{" "}
                    <span className="text-muted-foreground">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="text-sm mt-0.5">{r.change_note || "Edit"}</div>
                </div>
                <span className={`inline-flex items-center gap-0.5 text-xs font-mono ${positive ? "text-emerald-400" : "text-destructive"}`}>
                  {positive ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                  {Math.abs(r.char_delta)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

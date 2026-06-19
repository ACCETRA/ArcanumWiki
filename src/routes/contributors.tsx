import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { siteUrl } from "@/lib/site";
import { Crown, Trophy, Medal, Flame } from "lucide-react";

export const Route = createFileRoute("/contributors")({
  head: () => ({
    meta: [
      { title: "Contributors — ArcanumWiki" },
      {
        name: "description",
        content:
          "The adventurers writing the ArcanumWiki D&D codex, ranked by edits and pages created.",
      },
      { property: "og:title", content: "Contributors — ArcanumWiki" },
      { property: "og:description", content: "The adventurers writing the ArcanumWiki D&D codex." },
      { property: "og:url", content: siteUrl("/contributors") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/contributors") }],
  }),
  component: Contributors,
});

function Contributors() {
  const q = useQuery({
    queryKey: ["contributors-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contributor_stats")
        .select("username, display_name, avatar_url, bio, edit_count, pages_created")
        .order("edit_count", { ascending: false })
        .limit(200);
      return data ?? [];
    },
  });
  const contributorRows = q.data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="text-center mb-10">
        <h1 className="font-display text-4xl">The Guild</h1>
        <p className="text-muted-foreground mt-2">Adventurers who have shaped the codex.</p>
      </header>

      <ul className="space-y-3">
        {contributorRows.map((u, i) => (
          <li key={u.username}>
            <Link
              to="/u/$username"
              params={{ username: u.username! }}
              className="flex items-center gap-4 rounded-lg border border-border bg-card/60 p-4 hover:border-gold/60 transition-colors"
            >
              <RankBadge rank={i + 1} />
              {u.avatar_url ? (
                <img src={u.avatar_url} alt="" className="h-12 w-12 rounded-full" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-arcane to-gold flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {u.display_name?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg">{u.display_name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {u.bio || `@${u.username}`}
                </div>
              </div>
              <div className="hidden sm:block text-right text-sm">
                <div className="flex items-center justify-end gap-1 text-gold">
                  <Flame className="h-4 w-4" />
                  {u.edit_count} edits
                </div>
                <div className="text-muted-foreground">{u.pages_created} pages created</div>
              </div>
            </Link>
          </li>
        ))}
        {contributorRows.length === 0 && (
          <li className="text-center text-muted-foreground py-12">
            No contributors yet - be the first.
          </li>
        )}
      </ul>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-6 w-6 text-gold" />;
  if (rank === 2) return <Trophy className="h-6 w-6 text-gold-soft" />;
  if (rank === 3) return <Medal className="h-6 w-6 text-arcane" />;
  return <span className="w-6 text-center font-display text-muted-foreground">{rank}</span>;
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "@/lib/wiki.functions";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings — ArcanumWiki" }, { name: "robots", content: "noindex" }],
  }),
  component: Settings,
});

function Settings() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const save = useServerFn(updateProfile);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/settings" } as never });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
  }, [profile]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await save({ data: { display_name: displayName, bio, avatar_url: avatarUrl } });
      setMsg("Saved.");
    } catch (e: any) {
      setMsg(e?.message ?? "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (!profile) return <div className="mx-auto max-w-xl px-4 py-20 text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-3xl mb-6">Your scribe</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Username</label>
          <div className="mt-1 px-3 py-2 rounded-md bg-muted text-muted-foreground">@{profile.username}</div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full bg-input border border-border rounded-md px-3 py-2" required minLength={1} maxLength={60} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Avatar URL</label>
          <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" className="mt-1 w-full bg-input border border-border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={500} className="mt-1 w-full bg-input border border-border rounded-md px-3 py-2" />
        </div>
        {msg && <div className="text-sm text-gold">{msg}</div>}
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="rounded-md bg-gold text-primary-foreground px-4 py-2 font-semibold hover:bg-gold-soft disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={onSignOut} className="rounded-md border border-border px-4 py-2 hover:bg-muted">Sign out</button>
        </div>
      </form>
    </div>
  );
}

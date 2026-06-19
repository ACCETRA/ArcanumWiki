import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Camera,
  ClipboardList,
  FileUp,
  GalleryVerticalEnd,
  MapPinned,
  PlusCircle,
  ScrollText,
  Shield,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { BrandMark } from "@/components/BrandMark";
import { slugify } from "@/lib/categories";
import { siteUrl } from "@/lib/site";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaign Vault - ArcanumWiki" },
      {
        name: "description",
        content:
          "Create and manage D&D campaigns with maps, character sheets, recaps, notes, and homebrew spell storage.",
      },
      { property: "og:title", content: "Campaign Vault - ArcanumWiki" },
      {
        property: "og:description",
        content: "Your campaign hub for maps, sheets, recaps, and homebrew.",
      },
      { property: "og:url", content: siteUrl("/campaigns") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/campaigns") }],
  }),
  component: CampaignVault,
});

const fieldClass =
  "w-full rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const compactFieldClass =
  "w-full rounded-2xl border border-border/70 bg-background/75 px-4 py-2.5 text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

function CampaignVault() {
  const { user, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  const [activeCampaignId, setActiveCampaignId] = useState("");

  const campaigns = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaigns")
        .select(
          "id, slug, name, summary, system, world_name, is_public, session_count, last_recap, last_recap_at, updated_at",
        )
        .order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const characters = useQuery({
    queryKey: ["campaign-characters"],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_characters")
        .select("id, campaign_id, name, race, class_name, level, summary, portrait_url, updated_at")
        .order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const assets = useQuery({
    queryKey: ["campaign-assets"],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_assets")
        .select("id, campaign_id, title, description, asset_type, public_url, created_at")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const recaps = useQuery({
    queryKey: ["campaign-recaps"],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_recaps")
        .select("id, campaign_id, session_number, recap, important_points, created_at")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const notes = useQuery({
    queryKey: ["campaign-notes"],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_notes")
        .select("id, campaign_id, note_type, title, content, pinned, created_at")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const spells = useQuery({
    queryKey: ["campaign-homebrew-spells"],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_homebrew_spells")
        .select(
          "id, campaign_id, name, summary, level, school, casting_time, range, components, duration, content, updated_at",
        )
        .order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const counts = useQuery({
    queryKey: ["campaign-stats"],
    queryFn: async () => {
      const [{ count: c }, { count: a }, { count: r }, { count: n }, { count: s }] =
        await Promise.all([
          supabase.from("campaigns").select("*", { count: "exact", head: true }),
          supabase.from("campaign_assets").select("*", { count: "exact", head: true }),
          supabase.from("campaign_recaps").select("*", { count: "exact", head: true }),
          supabase.from("campaign_notes").select("*", { count: "exact", head: true }),
          supabase.from("campaign_homebrew_spells").select("*", { count: "exact", head: true }),
        ]);
      return {
        campaigns: c ?? 0,
        assets: a ?? 0,
        recaps: r ?? 0,
        notes: n ?? 0,
        spells: s ?? 0,
      };
    },
  });

  const canWrite = Boolean(user && profile);
  const campaignRows = useMemo(() => campaigns.data ?? [], [campaigns.data]);
  const characterRows = useMemo(() => characters.data ?? [], [characters.data]);
  const assetRows = useMemo(() => assets.data ?? [], [assets.data]);
  const recapRows = useMemo(() => recaps.data ?? [], [recaps.data]);
  const noteRows = useMemo(() => notes.data ?? [], [notes.data]);
  const spellRows = useMemo(() => spells.data ?? [], [spells.data]);
  const campaignById = useMemo(
    () => new Map(campaignRows.map((campaign) => [campaign.id, campaign])),
    [campaignRows],
  );

  useEffect(() => {
    if (campaignRows.length === 0) return;
    if (!activeCampaignId || !campaignRows.some((campaign) => campaign.id === activeCampaignId)) {
      setActiveCampaignId(campaignRows[0].id);
    }
  }, [activeCampaignId, campaignRows]);

  const activeCampaign = useMemo(
    () =>
      campaignRows.find((campaign) => campaign.id === activeCampaignId) ?? campaignRows[0] ?? null,
    [activeCampaignId, campaignRows],
  );

  const [campaignName, setCampaignName] = useState("");
  const [campaignSummary, setCampaignSummary] = useState("");
  const [campaignWorld, setCampaignWorld] = useState("");
  const [campaignSystem, setCampaignSystem] = useState("D&D 5e");
  const [campaignPublic, setCampaignPublic] = useState(true);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const [assetTitle, setAssetTitle] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const [assetType, setAssetType] = useState<"map" | "sheet" | "handout" | "token">("map");
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [assetMessage, setAssetMessage] = useState<string | null>(null);

  const [recapSession, setRecapSession] = useState("");
  const [recapBody, setRecapBody] = useState("");
  const [recapPoints, setRecapPoints] = useState("");
  const [savingRecap, setSavingRecap] = useState(false);

  const [noteType, setNoteType] = useState("important_point");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [notePinned, setNotePinned] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const [spellName, setSpellName] = useState("");
  const [spellSummary, setSpellSummary] = useState("");
  const [spellLevel, setSpellLevel] = useState("");
  const [spellSchool, setSpellSchool] = useState("");
  const [spellCastingTime, setSpellCastingTime] = useState("");
  const [spellRange, setSpellRange] = useState("");
  const [spellComponents, setSpellComponents] = useState("");
  const [spellDuration, setSpellDuration] = useState("");
  const [spellContent, setSpellContent] = useState("");
  const [savingSpell, setSavingSpell] = useState(false);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setCreatingCampaign(true);
    setCampaignError(null);
    try {
      const base = slugify(campaignName) || "campaign";
      const slug = `${base}-${Date.now().toString(36).slice(-4)}`;
      const { data, error } = await supabase
        .from("campaigns")
        .insert({
          slug,
          name: campaignName,
          summary: campaignSummary,
          system: campaignSystem,
          world_name: campaignWorld,
          is_public: campaignPublic,
          created_by: user.id,
        })
        .select("id")
        .single();
      if (error) throw error;
      setActiveCampaignId(data.id);
      setCampaignName("");
      setCampaignSummary("");
      setCampaignWorld("");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    } catch (error: any) {
      setCampaignError(error?.message ?? "Could not create campaign.");
    } finally {
      setCreatingCampaign(false);
    }
  }

  async function uploadAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeCampaign || !assetFile) return;
    setUploadingAsset(true);
    setAssetMessage(null);
    try {
      const path = `${activeCampaign.id}/${Date.now()}-${assetFile.name}`;
      const { data: upload, error: uploadError } = await supabase.storage
        .from("campaign-assets")
        .upload(path, assetFile, {
          contentType: assetFile.type || "application/octet-stream",
          upsert: false,
        });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage
        .from("campaign-assets")
        .getPublicUrl(upload.path);
      const { error: insertError } = await supabase.from("campaign_assets").insert({
        campaign_id: activeCampaign.id,
        uploaded_by: user.id,
        asset_type: assetType,
        title: assetTitle || assetFile.name,
        description: assetDescription,
        storage_path: upload.path,
        public_url: publicData.publicUrl,
      });
      if (insertError) throw insertError;
      setAssetTitle("");
      setAssetDescription("");
      setAssetFile(null);
      setAssetMessage("Uploaded and indexed.");
      queryClient.invalidateQueries({ queryKey: ["campaign-assets"] });
    } catch (error: any) {
      setAssetMessage(error?.message ?? "Could not upload the file.");
    } finally {
      setUploadingAsset(false);
    }
  }

  async function saveRecap(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeCampaign) return;
    setSavingRecap(true);
    try {
      const points = recapPoints
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const { error } = await supabase.from("campaign_recaps").insert({
        campaign_id: activeCampaign.id,
        session_number: Number(recapSession) || activeCampaign.session_count + 1,
        recap: recapBody,
        important_points: points,
        created_by: user.id,
      });
      if (error) throw error;
      setRecapSession("");
      setRecapBody("");
      setRecapPoints("");
      queryClient.invalidateQueries({ queryKey: ["campaign-recaps"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    } finally {
      setSavingRecap(false);
    }
  }

  async function saveNote(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeCampaign) return;
    setSavingNote(true);
    try {
      const { error } = await supabase.from("campaign_notes").insert({
        campaign_id: activeCampaign.id,
        note_type: noteType,
        title: noteTitle,
        content: noteBody,
        pinned: notePinned,
        created_by: user.id,
      });
      if (error) throw error;
      setNoteTitle("");
      setNoteBody("");
      setNotePinned(false);
      queryClient.invalidateQueries({ queryKey: ["campaign-notes"] });
    } finally {
      setSavingNote(false);
    }
  }

  async function saveSpell(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeCampaign) return;
    setSavingSpell(true);
    try {
      const { error } = await supabase.from("campaign_homebrew_spells").insert({
        campaign_id: activeCampaign.id,
        created_by: user.id,
        name: spellName,
        summary: spellSummary,
        level: spellLevel,
        school: spellSchool,
        casting_time: spellCastingTime,
        range: spellRange,
        components: spellComponents,
        duration: spellDuration,
        content: spellContent,
      });
      if (error) throw error;
      setSpellName("");
      setSpellSummary("");
      setSpellLevel("");
      setSpellSchool("");
      setSpellCastingTime("");
      setSpellRange("");
      setSpellComponents("");
      setSpellDuration("");
      setSpellContent("");
      queryClient.invalidateQueries({ queryKey: ["campaign-homebrew-spells"] });
    } finally {
      setSavingSpell(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <section className="paper-surface relative overflow-hidden rounded-[2rem] border border-border p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute right-[-7rem] top-[-7rem] h-80 w-80 rounded-full bg-gold/18 blur-3xl" />
          <div className="absolute left-[-7rem] bottom-[-7rem] h-80 w-80 rounded-full bg-arcane/18 blur-3xl" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-gold">
              <Shield className="h-3.5 w-3.5" /> Campaign vault
            </div>
            <div className="mt-6 flex items-center gap-4">
              <BrandMark className="h-16 w-16 shrink-0" />
              <div className="min-w-0">
                <h1 className="font-display text-4xl leading-tight md:text-6xl">
                  Everything a campaign needs, in one vault
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Store characters, maps, recap history, important points, homebrew spells, and DM
                  notes so players and the Dungeon Master always have the current state of the
                  world.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Metric label="Campaigns" value={counts.data?.campaigns ?? 0} />
              <Metric label="Assets" value={counts.data?.assets ?? 0} />
              <Metric label="Recaps" value={counts.data?.recaps ?? 0} />
              <Metric label="Notes" value={counts.data?.notes ?? 0} />
              <Metric label="Homebrew spells" value={counts.data?.spells ?? 0} />
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                to="/wiki"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm transition-colors hover:border-gold/60 hover:text-gold"
              >
                <BookOpen className="h-4 w-4" /> Browse the archive
              </Link>
              <Link
                to="/wiki/new"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                <PlusCircle className="h-4 w-4" /> New page
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gold/20 bg-background/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="flex items-center gap-2 font-display text-2xl">
              <PlusCircle className="h-5 w-5 text-gold" />
              Create campaign
            </div>
            {canWrite ? (
              <form onSubmit={createCampaign} className="mt-5 space-y-3">
                <input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Campaign name"
                  className={fieldClass}
                  required
                />
                <textarea
                  value={campaignSummary}
                  onChange={(e) => setCampaignSummary(e.target.value)}
                  placeholder="Campaign summary"
                  rows={3}
                  className={fieldClass}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={campaignWorld}
                    onChange={(e) => setCampaignWorld(e.target.value)}
                    placeholder="World / setting"
                    className={fieldClass}
                  />
                  <input
                    value={campaignSystem}
                    onChange={(e) => setCampaignSystem(e.target.value)}
                    placeholder="System"
                    className={fieldClass}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={campaignPublic}
                    onChange={(e) => setCampaignPublic(e.target.checked)}
                  />
                  Public campaign
                </label>
                {campaignError && (
                  <div className="rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {campaignError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={creatingCampaign}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" />{" "}
                  {creatingCampaign ? "Forging..." : "Create campaign"}
                </button>
              </form>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                Sign in to create campaigns and upload vault content.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Panel icon={GalleryVerticalEnd} title="Campaigns">
            <div className="grid gap-4 sm:grid-cols-2">
              {campaignRows.map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => setActiveCampaignId(campaign.id)}
                  className={`rounded-[1.5rem] border p-4 text-left transition-all ${
                    activeCampaign?.id === campaign.id
                      ? "border-gold/60 bg-gold/10 shadow-[0_8px_24px_rgba(214,174,77,0.12)]"
                      : "border-border bg-card/60 hover:-translate-y-0.5 hover:border-gold/40"
                  }`}
                >
                  <div className="text-xs uppercase tracking-widest text-gold">
                    {campaign.system}
                  </div>
                  <div className="mt-1 font-display text-2xl leading-tight">{campaign.name}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
                    {campaign.summary || "No summary yet."}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                    <span>{campaign.world_name || "No world set"}</span>
                    <span>{campaign.session_count} sessions</span>
                    <span>{campaign.is_public ? "Public" : "Private"}</span>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground line-clamp-2">
                    {campaign.last_recap || "No recap yet."}
                  </div>
                </button>
              ))}
              {!campaigns.isLoading && campaignRows.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-border bg-background/60 p-6 text-sm text-muted-foreground">
                  No campaigns yet. Create one to start storing sheets, maps, recaps, and notes.
                </div>
              )}
            </div>
          </Panel>

          <Panel icon={Camera} title="Uploaded maps and sheets">
            <div className="space-y-3">
              {assetRows.map((asset) => {
                const campaign = campaignById.get(asset.campaign_id);
                return (
                  <a
                    key={asset.id}
                    href={asset.public_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[1.5rem] border border-border bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:border-gold/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-gold">
                          {asset.asset_type}
                        </div>
                        <div className="mt-1 font-display text-xl">{asset.title}</div>
                        <div className="mt-1 text-sm leading-6 text-muted-foreground">
                          {asset.description || "No description."}
                        </div>
                      </div>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                        {campaign?.name ?? "Unknown campaign"}
                      </span>
                    </div>
                  </a>
                );
              })}
              {assetRows.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-background/60 p-6 text-sm text-muted-foreground">
                  Uploaded maps and character sheets will appear here.
                </div>
              )}
            </div>
          </Panel>

          <Panel icon={ClipboardList} title="Recaps and important points">
            <div className="space-y-3">
              {recapRows.map((recap) => {
                const campaign = campaignById.get(recap.campaign_id);
                const points = Array.isArray(recap.important_points) ? recap.important_points : [];
                return (
                  <div
                    key={recap.id}
                    className="rounded-[1.5rem] border border-border bg-card/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-display text-xl">Session {recap.session_number}</div>
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {campaign?.name ?? "Unknown campaign"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {recap.recap || "No recap text."}
                    </p>
                    {points.length > 0 && (
                      <ul className="mt-3 grid gap-2 text-sm">
                        {points.map((point) => (
                          <li
                            key={String(point)}
                            className="rounded-xl border border-border/70 bg-background/60 px-3 py-2"
                          >
                            {String(point)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
              {recapRows.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-background/60 p-6 text-sm text-muted-foreground">
                  Session recaps and important points will appear here.
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel icon={FileUp} title="Quick upload map or character sheet">
            {canWrite ? (
              <form onSubmit={uploadAsset} className="space-y-3">
                <VaultSelect
                  campaigns={campaignRows}
                  value={activeCampaignId}
                  onChange={setActiveCampaignId}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={assetTitle}
                    onChange={(e) => setAssetTitle(e.target.value)}
                    placeholder="Title"
                    className={compactFieldClass}
                  />
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as typeof assetType)}
                    className={compactFieldClass}
                  >
                    <option value="map">Map</option>
                    <option value="sheet">Character sheet</option>
                    <option value="handout">Handout</option>
                    <option value="token">Token</option>
                  </select>
                </div>
                <textarea
                  value={assetDescription}
                  onChange={(e) => setAssetDescription(e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className={fieldClass}
                />
                <input
                  type="file"
                  onChange={(e) => setAssetFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-muted-foreground"
                />
                {assetMessage && (
                  <div className="text-sm text-muted-foreground">{assetMessage}</div>
                )}
                <button
                  type="submit"
                  disabled={uploadingAsset}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
                >
                  <MapPinned className="h-4 w-4" />{" "}
                  {uploadingAsset ? "Uploading..." : "Upload asset"}
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                Sign in to upload files into the campaign bucket.
              </div>
            )}
          </Panel>

          <Panel icon={ScrollText} title="Log a recap">
            {canWrite ? (
              <form onSubmit={saveRecap} className="space-y-3">
                <VaultSelect
                  campaigns={campaignRows}
                  value={activeCampaignId}
                  onChange={setActiveCampaignId}
                />
                <input
                  value={recapSession}
                  onChange={(e) => setRecapSession(e.target.value)}
                  placeholder="Session number"
                  type="number"
                  min="1"
                  className={fieldClass}
                />
                <textarea
                  value={recapBody}
                  onChange={(e) => setRecapBody(e.target.value)}
                  placeholder="Recap"
                  rows={4}
                  className={fieldClass}
                />
                <textarea
                  value={recapPoints}
                  onChange={(e) => setRecapPoints(e.target.value)}
                  placeholder="Important points, one per line"
                  rows={3}
                  className={fieldClass}
                />
                <button
                  type="submit"
                  disabled={savingRecap}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
                >
                  <CalendarDays className="h-4 w-4" /> {savingRecap ? "Saving..." : "Save recap"}
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                Sign in to add session recaps.
              </div>
            )}
          </Panel>

          <Panel icon={BookOpen} title="Important notes and world state">
            {canWrite ? (
              <form onSubmit={saveNote} className="space-y-3">
                <VaultSelect
                  campaigns={campaignRows}
                  value={activeCampaignId}
                  onChange={setActiveCampaignId}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className={compactFieldClass}
                  >
                    <option value="important_point">Important point</option>
                    <option value="npc">NPC</option>
                    <option value="location">Location</option>
                    <option value="quest">Quest</option>
                    <option value="lore">Lore</option>
                  </select>
                  <label className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-3 py-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={notePinned}
                      onChange={(e) => setNotePinned(e.target.checked)}
                    />
                    Pin this note
                  </label>
                </div>
                <input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note title"
                  className={fieldClass}
                />
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="Note content"
                  rows={4}
                  className={fieldClass}
                />
                <button
                  type="submit"
                  disabled={savingNote}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" /> {savingNote ? "Saving..." : "Save note"}
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                Sign in to store DM notes and important points.
              </div>
            )}
          </Panel>

          <Panel icon={WandSparkles} title="Homebrew spellbook">
            {canWrite ? (
              <form onSubmit={saveSpell} className="space-y-3">
                <VaultSelect
                  campaigns={campaignRows}
                  value={activeCampaignId}
                  onChange={setActiveCampaignId}
                />
                <input
                  value={spellName}
                  onChange={(e) => setSpellName(e.target.value)}
                  placeholder="Spell name"
                  className={fieldClass}
                />
                <textarea
                  value={spellSummary}
                  onChange={(e) => setSpellSummary(e.target.value)}
                  placeholder="Summary"
                  rows={2}
                  className={fieldClass}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={spellLevel}
                    onChange={(e) => setSpellLevel(e.target.value)}
                    placeholder="Level"
                    className={compactFieldClass}
                  />
                  <input
                    value={spellSchool}
                    onChange={(e) => setSpellSchool(e.target.value)}
                    placeholder="School"
                    className={compactFieldClass}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={spellCastingTime}
                    onChange={(e) => setSpellCastingTime(e.target.value)}
                    placeholder="Casting time"
                    className={compactFieldClass}
                  />
                  <input
                    value={spellRange}
                    onChange={(e) => setSpellRange(e.target.value)}
                    placeholder="Range"
                    className={compactFieldClass}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={spellComponents}
                    onChange={(e) => setSpellComponents(e.target.value)}
                    placeholder="Components"
                    className={compactFieldClass}
                  />
                  <input
                    value={spellDuration}
                    onChange={(e) => setSpellDuration(e.target.value)}
                    placeholder="Duration"
                    className={compactFieldClass}
                  />
                </div>
                <textarea
                  value={spellContent}
                  onChange={(e) => setSpellContent(e.target.value)}
                  placeholder="Spell text"
                  rows={4}
                  className={fieldClass}
                />
                <button
                  type="submit"
                  disabled={savingSpell}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
                >
                  <WandSparkles className="h-4 w-4" /> {savingSpell ? "Saving..." : "Save spell"}
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                Sign in to store campaign homebrew spells.
              </div>
            )}
          </Panel>
        </div>
      </section>

      <section className="mt-12 grid gap-6 xl:grid-cols-3">
        <Panel icon={Camera} title="Character sheets">
          <div className="space-y-3">
            {characterRows.map((character) => {
              const campaign = campaignById.get(character.campaign_id);
              return (
                <div key={character.id} className="rounded-2xl border border-border bg-card/60 p-4">
                  <div className="flex items-start gap-3">
                    {character.portrait_url ? (
                      <img
                        src={character.portrait_url}
                        alt={character.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-arcane to-gold" />
                    )}
                    <div className="min-w-0">
                      <div className="font-display text-lg">{character.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {character.race} {character.class_name} level {character.level}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                        {campaign?.name ?? "Unknown campaign"}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {character.summary || "No summary yet."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {characterRows.length === 0 && (
              <EmptyText>Character sheets and portraits will appear here.</EmptyText>
            )}
          </div>
        </Panel>

        <Panel icon={GalleryVerticalEnd} title="Homebrew spell archive">
          <div className="space-y-3">
            {spellRows.map((spell) => {
              const campaign = campaignById.get(spell.campaign_id ?? "");
              return (
                <div key={spell.id} className="rounded-2xl border border-border bg-card/60 p-4">
                  <div className="text-xs uppercase tracking-widest text-gold">
                    {spell.level || "Spell"}
                  </div>
                  <div className="mt-1 font-display text-lg">{spell.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {spell.summary || "No summary yet."}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                    <span>{campaign?.name ?? "Global"}</span>
                    <span>{spell.school || "School?"}</span>
                    <span>{spell.casting_time || "Casting time?"}</span>
                  </div>
                </div>
              );
            })}
            {spellRows.length === 0 && <EmptyText>No homebrew spells stored yet.</EmptyText>}
          </div>
        </Panel>

        <Panel icon={BookOpen} title="Important notes">
          <div className="space-y-3">
            {noteRows.map((note) => {
              const campaign = campaignById.get(note.campaign_id);
              return (
                <div
                  key={note.id}
                  className={`rounded-[1.5rem] border bg-card/60 p-4 ${note.pinned ? "border-gold/50" : "border-border"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-display text-lg">{note.title}</div>
                    {note.pinned && (
                      <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] uppercase tracking-widest text-gold">
                        Pinned
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {note.note_type} · {campaign?.name ?? "Unknown campaign"}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-4">
                    {note.content || "No content."}
                  </p>
                </div>
              );
            })}
            {noteRows.length === 0 && <EmptyText>No campaign notes yet.</EmptyText>}
          </div>
        </Panel>
      </section>

      {!loading && !user && (
        <div className="mt-12 rounded-[1.75rem] border border-dashed border-border bg-card/60 p-6 text-center">
          <div className="font-display text-2xl">Sign in to write to the vault</div>
          <p className="mt-2 text-muted-foreground">
            Creating campaigns, uploading files, and saving recap history all require an account.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-border bg-card/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 font-display text-2xl">
        <Icon className="h-5 w-5 text-gold" />
        {title}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-full border border-border bg-background/60 px-4 py-3 text-center">
      <div className="font-display text-2xl text-gold">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function VaultSelect({
  campaigns,
  value,
  onChange,
}: {
  campaigns: Array<{ id: string; name: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
      {campaigns.map((campaign) => (
        <option key={campaign.id} value={campaign.id}>
          {campaign.name}
        </option>
      ))}
      {campaigns.length === 0 && <option value="">Create a campaign first</option>}
    </select>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-border bg-background/60 p-5 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

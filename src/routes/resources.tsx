import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Compass,
  Dice6,
  FileImage,
  Globe2,
  LibraryBig,
  MapPinned,
  MessageSquare,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { siteUrl } from "@/lib/site";

type ToolItem = {
  name: string;
  href: string;
  claim: string;
  sourceLabel: string;
  icon: LucideIcon;
};

type ToolSection = {
  title: string;
  intro: string;
  icon: LucideIcon;
  items: ToolItem[];
};

const toolSections: ToolSection[] = [
  {
    title: "Game hosting and live play",
    intro: "Use these when the table is online and you want the session to feel immediate.",
    icon: Cloud,
    items: [
      {
        name: "Roll20",
        href: "https://roll20.net/",
        claim:
          "Browser-based virtual tabletop for maps, dice, character sheets, and campaign play.",
        sourceLabel: "Official Roll20 site",
        icon: Globe2,
      },
      {
        name: "Foundry Virtual Tabletop",
        href: "https://foundryvtt.com/",
        claim: "Self-hosted VTT with a modern interface and a deploy-it-yourself model.",
        sourceLabel: "Official Foundry site",
        icon: Cloud,
      },
      {
        name: "Fantasy Grounds",
        href: "https://www.fantasygrounds.com/",
        claim:
          "Virtual tabletop with GM tools, player access, and automation for combat and sheets.",
        sourceLabel: "Official Fantasy Grounds site",
        icon: Dice6,
      },
      {
        name: "Discord",
        href: "https://discord.com/",
        claim: "Voice, video, and text channels for the social layer around the game.",
        sourceLabel: "Official Discord site",
        icon: MessageSquare,
      },
      {
        name: "Zoom",
        href: "https://zoom.us/",
        claim: "Video meetings and live collaboration for remote tables and game prep.",
        sourceLabel: "Official Zoom site",
        icon: Users,
      },
    ],
  },
  {
    title: "Character lifecycle",
    intro: "From first concept to a finished token, these tools shape a player character.",
    icon: PencilLine,
    items: [
      {
        name: "D&D Beyond",
        href: "https://www.dndbeyond.com/",
        claim: "Digital character creation, sheets, homebrew, encounter tools, and the Maps VTT.",
        sourceLabel: "Official D&D Beyond site",
        icon: BookOpen,
      },
      {
        name: "Hero Forge",
        href: "https://www.heroforge.com/",
        claim: "Custom 3D miniatures for visualizing a hero before they reach the table.",
        sourceLabel: "Official Hero Forge site",
        icon: Sparkles,
      },
      {
        name: "Token Stamp",
        href: "https://rolladvantage.com/tokenstamp/",
        claim: "A fast way to crop art into clean VTT-ready tokens.",
        sourceLabel: "Official Token Stamp site",
        icon: FileImage,
      },
    ],
  },
  {
    title: "Campaign planning and worldbuilding",
    intro: "A second brain for DMs who need to track factions, NPCs, and long-running arcs.",
    icon: LibraryBig,
    items: [
      {
        name: "World Anvil",
        href: "https://www.worldanvil.com/",
        claim: "Worldbuilding, timelines, articles, and public campaign knowledge hubs.",
        sourceLabel: "Official World Anvil site",
        icon: Globe2,
      },
      {
        name: "Notion",
        href: "https://www.notion.so/",
        claim: "Flexible docs and databases that can act as a campaign brain.",
        sourceLabel: "Official Notion site",
        icon: LibraryBig,
      },
      {
        name: "Obsidian",
        href: "https://obsidian.md/",
        claim: "Local-first linked notes for building a campaign knowledge vault.",
        sourceLabel: "Official Obsidian site",
        icon: Compass,
      },
    ],
  },
  {
    title: "Cartography and map design",
    intro:
      "Build continents, regions, dungeons, and tactical battle maps with the right level of detail.",
    icon: MapPinned,
    items: [
      {
        name: "Inkarnate",
        href: "https://inkarnate.com/",
        claim:
          "Mapmaking for worlds, regions, cities, and battle maps with a polished export flow.",
        sourceLabel: "Official Inkarnate site",
        icon: MapPinned,
      },
      {
        name: "Dungeondraft",
        href: "https://dungeondraft.net/",
        claim:
          "Battle map creation tool for detailed interiors, encounters, and atmospheric scenes.",
        sourceLabel: "Official Dungeondraft site",
        icon: FileImage,
      },
      {
        name: "Dungeon Scrawl",
        href: "https://www.dungeonscrawl.com/",
        claim: "A fast dungeon sketching tool for live-session mapping and quick layouts.",
        sourceLabel: "Official Dungeon Scrawl site",
        icon: WandSparkles,
      },
    ],
  },
  {
    title: "Procedural content and quick reference",
    intro: "When the DM needs a result now, these tools fill the gap in seconds.",
    icon: Dice6,
    items: [
      {
        name: "Donjon",
        href: "https://donjon.bin.sh/",
        claim: "Random generation for dungeons, encounters, names, and other DM prep aids.",
        sourceLabel: "Official Donjon site",
        icon: Dice6,
      },
      {
        name: "Kassoon",
        href: "https://www.kassoon.com/",
        claim: "Generators for names, dungeons, treasure, NPCs, and encounter planning.",
        sourceLabel: "Official Kassoon site",
        icon: WandSparkles,
      },
      {
        name: "D&D Beyond Encounter Builder",
        href: "https://www.dndbeyond.com/encounter-builder",
        claim: "Encounter planning inside the official D&D Beyond toolset.",
        sourceLabel: "Official D&D Beyond feature",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Rules reference and publishing",
    intro: "For live rules lookup and polished homebrew documents that feel book-adjacent.",
    icon: ShieldCheck,
    items: [
      {
        name: "5e SRD",
        href: "https://5thsrd.org/",
        claim: "A compact reference for fifth edition rules text and SRD material.",
        sourceLabel: "Official 5thSRD site",
        icon: ShieldCheck,
      },
      {
        name: "Homebrewery",
        href: "https://homebrewery.naturalcrit.com/",
        claim:
          "Markdown-to-book formatting for custom content that mimics the feel of a sourcebook.",
        sourceLabel: "Official Homebrewery site",
        icon: BookOpen,
      },
      {
        name: "GM Binder",
        href: "https://www.gmbinder.com/",
        claim: "A publishing workflow for clean, book-style D&D homebrew documents.",
        sourceLabel: "Official GM Binder site",
        icon: LibraryBig,
      },
    ],
  },
];

const marketplacePrinciples = [
  "Browse studios for art and maps",
  "Post a commission request with budget and deadline",
  "Keep requests tied to campaigns and player-facing needs",
];

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources and Marketplace - ArcanumWiki" },
      {
        name: "description",
        content:
          "A source-backed D&D tool atlas plus a live marketplace for commissioning art and maps.",
      },
      { property: "og:title", content: "Resources and Marketplace - ArcanumWiki" },
      {
        property: "og:description",
        content:
          "Find real tool references, DM workflows, player workflows, and commission listings in one place.",
      },
      { property: "og:url", content: siteUrl("/resources") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/resources") }],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { user, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  const canWrite = Boolean(user && profile);

  const [studioTitle, setStudioTitle] = useState("");
  const [studioSummary, setStudioSummary] = useState("");
  const [studioDescription, setStudioDescription] = useState("");
  const [listingType, setListingType] = useState<"art" | "maps" | "both">("art");
  const [startingPrice, setStartingPrice] = useState("");
  const [turnaroundDays, setTurnaroundDays] = useState("7");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [listingError, setListingError] = useState<string | null>(null);
  const [listingSaving, setListingSaving] = useState(false);

  const [requestTitle, setRequestTitle] = useState("");
  const [requestType, setRequestType] = useState<"art" | "maps" | "both">("art");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [requestBrief, setRequestBrief] = useState("");
  const [requestContactEmail, setRequestContactEmail] = useState("");
  const [requestCampaignId, setRequestCampaignId] = useState("");
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSaving, setRequestSaving] = useState(false);

  const campaigns = useQuery({
    queryKey: ["resource-campaigns"],
    queryFn: async () => {
      const { data } = await supabase
        .from("campaigns")
        .select("id, name, slug")
        .order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const listings = useQuery({
    queryKey: ["commission-listings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("commission_listings")
        .select(
          "id, profile_id, title, summary, description, listing_type, starting_price_usd, turnaround_days, portfolio_url, contact_url, active, created_at",
        )
        .eq("active", true)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const requests = useQuery({
    queryKey: ["commission-requests"],
    queryFn: async () => {
      const { data } = await supabase
        .from("commission_requests")
        .select(
          "id, requester_id, campaign_id, listing_id, commission_type, title, brief, budget_min, budget_max, due_date, contact_email, status, created_at",
        )
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const artists = useQuery({
    queryKey: ["commission-artists"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .order("display_name", { ascending: true });
      return data ?? [];
    },
  });

  const campaignRows = useMemo(() => campaigns.data ?? [], [campaigns.data]);
  const listingRows = useMemo(() => listings.data ?? [], [listings.data]);
  const requestRows = useMemo(() => requests.data ?? [], [requests.data]);
  const artistRows = useMemo(() => artists.data ?? [], [artists.data]);

  useEffect(() => {
    if (campaignRows.length === 0) return;
    if (!requestCampaignId || !campaignRows.some((campaign) => campaign.id === requestCampaignId)) {
      setRequestCampaignId(campaignRows[0].id);
    }
  }, [campaignRows, requestCampaignId]);

  const artistById = useMemo(
    () => new Map(artistRows.map((artist) => [artist.id, artist])),
    [artistRows],
  );

  const myRequests = useMemo(
    () => requestRows.filter((request) => request.requester_id === user?.id),
    [requestRows, user?.id],
  );

  async function saveListing(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    setListingSaving(true);
    setListingError(null);
    try {
      const { error } = await supabase.from("commission_listings").insert({
        profile_id: user.id,
        title: studioTitle,
        summary: studioSummary,
        description: studioDescription,
        listing_type: listingType,
        starting_price_usd: Number(startingPrice) || 0,
        turnaround_days: Number(turnaroundDays) || 7,
        portfolio_url: portfolioUrl,
        contact_url: contactUrl,
      });
      if (error) throw error;
      setStudioTitle("");
      setStudioSummary("");
      setStudioDescription("");
      setStartingPrice("");
      setTurnaroundDays("7");
      setPortfolioUrl("");
      setContactUrl("");
      queryClient.invalidateQueries({ queryKey: ["commission-listings"] });
    } catch (error: any) {
      setListingError(error?.message ?? "Could not create the listing.");
    } finally {
      setListingSaving(false);
    }
  }

  async function saveRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    setRequestSaving(true);
    setRequestError(null);
    try {
      const { error } = await supabase.from("commission_requests").insert({
        requester_id: user.id,
        campaign_id: requestCampaignId || null,
        commission_type: requestType,
        title: requestTitle,
        brief: requestBrief,
        budget_min: budgetMin ? Number(budgetMin) : null,
        budget_max: budgetMax ? Number(budgetMax) : null,
        due_date: dueDate || null,
        contact_email: requestContactEmail,
      });
      if (error) throw error;
      setRequestTitle("");
      setRequestBrief("");
      setBudgetMin("");
      setBudgetMax("");
      setDueDate("");
      setRequestContactEmail("");
      queryClient.invalidateQueries({ queryKey: ["commission-requests"] });
    } catch (error: any) {
      setRequestError(error?.message ?? "Could not submit the request.");
    } finally {
      setRequestSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card/70 p-8 md:p-10">
        <div className="absolute inset-0 -z-10 opacity-70 pointer-events-none">
          <div className="absolute top-[-8rem] right-[-8rem] h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute bottom-[-7rem] left-[-7rem] h-80 w-80 rounded-full bg-arcane/20 blur-3xl" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Source-backed atlas
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-6xl">
              A cleaner D&amp;D reference hall with a real commission market
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Every tool below points back to the vendor or project site, and the marketplace lets
              artists, cartographers, DMs, and players connect over maps and commissions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/wiki"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                Browse the codex <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#marketplace"
                className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gold/10"
              >
                Open marketplace
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Metric label="Tool sections" value={toolSections.length} />
              <Metric label="Live listings" value={listingRows.length} />
              <Metric label="Commission requests" value={requestRows.length} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-background/70 p-6">
            <div className="flex items-center gap-3">
              <NodeGlyph />
              <div>
                <div className="font-display text-2xl">The table cycle</div>
                <p className="text-sm text-muted-foreground">
                  DM prep, live play, and community growth.
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {marketplacePrinciples.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-xs text-gold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6">
        {toolSections.map((section, index) => (
          <ToolSectionBlock key={section.title} section={section} index={index} />
        ))}
      </section>

      <section id="marketplace" className="mt-12 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
          <SectionHeading
            icon={WandSparkles}
            title="Commission marketplace"
            description="Post your studio, browse artists and mapmakers, and send a real request tied to a campaign."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {listingRows.map((listing) => {
              const artist = artistById.get(listing.profile_id);
              return (
                <div
                  key={listing.id}
                  className="rounded-2xl border border-border bg-background/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-gold">
                        {listing.listing_type}
                      </div>
                      <div className="mt-1 font-display text-xl">{listing.title}</div>
                    </div>
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      ${listing.starting_price_usd}+
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {listing.summary || listing.description}
                  </p>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {artist?.display_name ?? artist?.username ?? "Unknown studio"}
                    </span>
                    <span className="mx-2">-</span>
                    {listing.turnaround_days} day turnaround
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {listing.portfolio_url && (
                      <a
                        href={listing.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:bg-muted"
                      >
                        Portfolio
                      </a>
                    )}
                    {listing.contact_url && (
                      <a
                        href={listing.contact_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md bg-gold px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-primary-foreground transition-colors hover:bg-gold-soft"
                      >
                        Contact
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {listingRows.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-6">
                <div className="font-display text-2xl">No studios have posted yet</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Be the first artist or mapmaker to post a listing and this section becomes a real
                  marketplace instead of a dead end.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-border bg-background/60 p-5">
            <div className="flex items-center gap-2 font-display text-2xl">
              <ShieldCheck className="h-5 w-5 text-gold" />
              What buyers can post
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MarketplaceChip title="Portraits" body="Character art, NPC art, creature art." />
              <MarketplaceChip title="Battle maps" body="Taverns, dungeons, wilderness, lairs." />
              <MarketplaceChip title="Campaign art" body="Covers, sigils, posters, title cards." />
              <MarketplaceChip
                title="Source notes"
                body="Campaign links, references, style guidance."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
            <SectionHeading
              icon={Users}
              title="Post a studio listing"
              description="Artists and mapmakers can advertise their commission style right inside the site."
            />
            {canWrite ? (
              <form onSubmit={saveListing} className="mt-5 space-y-3">
                <input
                  value={studioTitle}
                  onChange={(e) => setStudioTitle(e.target.value)}
                  placeholder="Studio or service name"
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
                  required
                />
                <textarea
                  value={studioSummary}
                  onChange={(e) => setStudioSummary(e.target.value)}
                  placeholder="Short summary for buyers"
                  rows={2}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
                />
                <textarea
                  value={studioDescription}
                  onChange={(e) => setStudioDescription(e.target.value)}
                  placeholder="Describe your style, deliverables, and what buyers should know."
                  rows={4}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as typeof listingType)}
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  >
                    <option value="art">Art</option>
                    <option value="maps">Maps</option>
                    <option value="both">Art + maps</option>
                  </select>
                  <input
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="Starting price USD"
                    type="number"
                    min="0"
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={turnaroundDays}
                    onChange={(e) => setTurnaroundDays(e.target.value)}
                    placeholder="Turnaround days"
                    type="number"
                    min="1"
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  />
                  <input
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="Portfolio URL"
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  />
                </div>
                <input
                  value={contactUrl}
                  onChange={(e) => setContactUrl(e.target.value)}
                  placeholder="Contact URL, email, or booking link"
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
                />
                {listingError && (
                  <div className="rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {listingError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={listingSaving}
                  className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
                >
                  <PencilLine className="h-4 w-4" />
                  {listingSaving ? "Publishing..." : "Publish listing"}
                </button>
              </form>
            ) : (
              <GateCta
                title="Sign in to post a studio"
                body="Create an account to list your art or map commission work."
              />
            )}
          </div>

          <div className="rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
            <SectionHeading
              icon={Sparkles}
              title="Post a commission request"
              description="Players and DMs can submit a brief, budget, and deadline for the whole community to see."
            />
            {canWrite ? (
              <form onSubmit={saveRequest} className="mt-5 space-y-3">
                <input
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  placeholder="Request title"
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
                  required
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value as typeof requestType)}
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  >
                    <option value="art">Art</option>
                    <option value="maps">Maps</option>
                    <option value="both">Art + maps</option>
                  </select>
                  <select
                    value={requestCampaignId}
                    onChange={(e) => setRequestCampaignId(e.target.value)}
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  >
                    <option value="">No campaign</option>
                    {campaignRows.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder="Budget minimum USD"
                    type="number"
                    min="0"
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  />
                  <input
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="Budget maximum USD"
                    type="number"
                    min="0"
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    type="date"
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  />
                  <input
                    value={requestContactEmail}
                    onChange={(e) => setRequestContactEmail(e.target.value)}
                    placeholder="Contact email"
                    type="email"
                    className="rounded-md border border-border bg-input px-3 py-2 text-sm"
                  />
                </div>
                <textarea
                  value={requestBrief}
                  onChange={(e) => setRequestBrief(e.target.value)}
                  placeholder="Brief, style notes, references, and deliverables"
                  rows={5}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
                  required
                />
                {requestError && (
                  <div className="rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {requestError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={requestSaving}
                  className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gold/10 disabled:opacity-60"
                >
                  <ArrowRight className="h-4 w-4" />
                  {requestSaving ? "Submitting..." : "Submit request"}
                </button>
              </form>
            ) : (
              <GateCta
                title="Sign in to post a request"
                body="Commission requests need an account so artists know who to contact."
              />
            )}
          </div>

          <div className="rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
            <SectionHeading
              icon={BookOpen}
              title="Your requests"
              description="A private list of the requests you have posted."
            />
            <div className="mt-5 space-y-3">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-border bg-background/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-display text-lg">{request.title}</div>
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{request.brief}</p>
                  <div className="mt-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {request.commission_type}
                    {request.budget_min || request.budget_max
                      ? ` - $${request.budget_min ?? 0} to $${request.budget_max ?? "?"}`
                      : ""}
                  </div>
                </div>
              ))}
              {myRequests.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-5 text-sm text-muted-foreground">
                  You have not posted a request yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {!loading && !user && (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center">
          <div className="font-display text-2xl">Sign in to contribute to the marketplace</div>
          <p className="mt-2 text-muted-foreground">
            Create studio listings and commission requests once you have an account.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}

function ToolSectionBlock({ section, index }: { section: ToolSection; index: number }) {
  const Icon = section.icon;
  return (
    <section className="rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gold">
            <Icon className="h-3.5 w-3.5" />
            Workflow {index + 1}
          </div>
          <h2 className="mt-4 font-display text-3xl">{section.title}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{section.intro}</p>
        </div>
        <SectionOrbit />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-border bg-background/60 p-4 transition-colors hover:border-gold/50 hover:bg-background"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                    <ItemIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display text-xl group-hover:text-gold transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {item.sourceLabel}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.claim}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                Source
              </div>
            </a>
          );
        })}
      </div>
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

function MarketplaceChip({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="font-display text-lg">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function GateCta({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background/60 p-5 text-sm text-muted-foreground">
      <div className="font-display text-xl text-foreground">{title}</div>
      <p className="mt-2">{body}</p>
    </div>
  );
}

function NodeGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-gold">
      <path
        d="M5.5 15.5 12 11l6.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8.5 12 13l6.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx="5.5" cy="8.5" r="1.6" fill="currentColor" />
      <circle cx="12" cy="13" r="1.9" fill="currentColor" />
      <circle cx="18.5" cy="8.5" r="1.6" fill="currentColor" />
      <circle cx="5.5" cy="15.5" r="1.6" fill="currentColor" />
      <circle cx="18.5" cy="15.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

function SectionOrbit() {
  return (
    <svg aria-hidden="true" viewBox="0 0 96 96" className="h-16 w-16 text-gold/50">
      <circle cx="48" cy="48" r="28" fill="none" stroke="currentColor" strokeDasharray="6 6" />
      <circle cx="48" cy="48" r="6" fill="currentColor" />
      <circle cx="48" cy="20" r="4" fill="currentColor" />
      <circle cx="76" cy="48" r="4" fill="currentColor" />
      <circle cx="48" cy="76" r="4" fill="currentColor" />
      <circle cx="20" cy="48" r="4" fill="currentColor" />
    </svg>
  );
}

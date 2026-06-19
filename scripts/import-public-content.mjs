import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PUBLIC_CONTENT_SOURCE = process.env.PUBLIC_CONTENT_SOURCE ?? "https://www.dnd5eapi.co";
const SEED_PASSWORD = process.env.PUBLIC_CONTENT_SEED_PASSWORD ?? "ArcanumWikiSeed!23";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const campaignSeeds = [
  { title: "Lost Mine of Phandelver", wikiTitle: "Lost_Mine_of_Phandelver", worldName: "Sword Coast" },
  { title: "Dragon of Icespire Peak", wikiTitle: "Dragon_of_Icespire_Peak", worldName: "Sword Coast" },
  { title: "Curse of Strahd", wikiTitle: "Curse_of_Strahd", worldName: "Ravenloft" },
  { title: "Storm King's Thunder", wikiTitle: "Storm_King%27s_Thunder", worldName: "Sword Coast" },
  { title: "Waterdeep: Dragon Heist", wikiTitle: "Waterdeep:_Dragon_Heist", worldName: "Waterdeep" },
  { title: "Waterdeep: Dungeon of the Mad Mage", wikiTitle: "Waterdeep:_Dungeon_of_the_Mad_Mage", worldName: "Waterdeep" },
  { title: "The Wild Beyond the Witchlight", wikiTitle: "The_Wild_Beyond_the_Witchlight", worldName: "The Feywild" },
  { title: "Out of the Abyss", wikiTitle: "Out_of_the_Abyss", worldName: "Underdark" },
];

const curatorSeeds = [
  {
    username: "ammad",
    email: "ammad.seed@arcanumwiki.local",
    display_name: "Ammad Kiyani",
    bio: "A small-time college student building ArcanumWiki for the joy of D&D books and shared worldbuilding.",
  },
  {
    username: "mira-quill",
    email: "mira.seed@arcanumwiki.local",
    display_name: "Mira Quill",
    bio: "Cartographer and recap writer who keeps the campaign notes readable.",
  },
  {
    username: "elowen-ash",
    email: "elowen.seed@arcanumwiki.local",
    display_name: "Elowen Ash",
    bio: "Rules guide and archive editor who loves clean references.",
  },
  {
    username: "torren-vale",
    email: "torren.seed@arcanumwiki.local",
    display_name: "Torren Vale",
    bio: "Monster researcher and DM who turns raw mechanics into usable pages.",
  },
];

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function stableUuid(key) {
  const bytes = createHash("sha1").update(key).digest();
  const uuid = Buffer.from(bytes.subarray(0, 16));
  uuid[6] = (uuid[6] & 0x0f) | 0x50;
  uuid[8] = (uuid[8] & 0x3f) | 0x80;
  const hex = uuid.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function textLines(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(textLines).filter(Boolean);
  if (typeof value === "string") return [value.trim()].filter(Boolean);
  return [String(value)].filter(Boolean);
}

function firstSentence(text) {
  const clean = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return "";
  const match = clean.match(/^.*?[.!?](?=\s|$)/);
  return (match?.[0] ?? clean).slice(0, 200).trim();
}

function joinList(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- None listed";
}

function ordinal(n) {
  if (n === 0) return "Cantrip";
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function speedStr(speed) {
  if (!speed) return "Not specified";
  if (typeof speed === "number" || typeof speed === "string") return String(speed);
  return Object.entries(speed)
    .filter(([, v]) => v)
    .map(([k, v]) => (k === "walk" ? v : `${k} ${v}`))
    .join(", ");
}

function armorClassStr(ac) {
  if (!ac) return "Not specified";
  if (typeof ac === "number") return String(ac);
  if (Array.isArray(ac)) {
    return ac
      .map((entry) => (typeof entry === "object" ? entry.value ?? entry : entry))
      .join(", ");
  }
  return String(ac);
}

function makeBadgeSvg(title, subtitle, colors) {
  const [a, b, c] = colors;
  const escapeXml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="#0f1116" />
      <rect x="56" y="56" width="1088" height="563" rx="34" fill="none" stroke="url(#g)" stroke-width="8" stroke-dasharray="16 12" opacity="0.6" />
      <circle cx="230" cy="180" r="120" fill="${c}" opacity="0.18" />
      <circle cx="930" cy="470" r="170" fill="${c}" opacity="0.12" />
      <path d="M210 448 340 330 470 392 640 236 890 362" fill="none" stroke="url(#g)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />
      <path d="M260 520 H920" stroke="${b}" stroke-width="5" stroke-linecap="round" opacity="0.7" />
      <text x="90" y="120" fill="#f8edd0" font-family="Georgia, serif" font-size="46" letter-spacing="4">${escapeXml(title)}</text>
      <text x="90" y="160" fill="#c9b88c" font-family="Arial, sans-serif" font-size="24" letter-spacing="2">${escapeXml(subtitle)}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeColors(seed) {
  const palette = [
    ["#e9c46a", "#8d6e63", "#f4a261"],
    ["#8ecae6", "#219ebc", "#023047"],
    ["#ffd166", "#06d6a0", "#118ab2"],
    ["#c77dff", "#5a189a", "#e0aaff"],
  ];
  return palette[seed % palette.length];
}

async function fetchJson(path) {
  const url = path.startsWith("http")
    ? path
    : `${PUBLIC_CONTENT_SOURCE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchCollection(path) {
  const data = await fetchJson(path);
  const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
  return results;
}

async function fetchWikipediaSummary(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { accept: "application/json" } },
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function mapLimit(items, limit, iteratee) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await iteratee(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function getOrCreateAuthUser(seed) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  const existing = data.users.find((user) => user.email === seed.email);
  if (existing) return existing;
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: seed.email,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { username: seed.username, display_name: seed.display_name },
  });
  if (createError) throw createError;
  return created.user;
}

async function upsertRows(table, rows, onConflict) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) throw error;
}

async function insertRows(table, rows) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw error;
}

async function ensureRequiredTables(tables) {
  for (const table of tables) {
    const { error } = await supabase.from(table).select("id").limit(1);
    if (!error) continue;
    if (error.code === "PGRST205") {
      throw new Error(
        `Supabase table "${table}" is missing. Apply migrations in supabase/migrations and refresh the schema cache, then rerun seed:public.`,
      );
    }
    throw error;
  }
}

async function seedProfiles() {
  const users = [];
  for (const seed of curatorSeeds) {
    const user = await getOrCreateAuthUser(seed);
    users.push({ seed, user });
  }
  await upsertRows(
    "profiles",
    users.map(({ seed, user }) => ({
      id: user.id,
      username: seed.username,
      display_name: seed.display_name,
      bio: seed.bio,
      avatar_url: null,
    })),
    "id",
  );
  return users;
}

async function importPages(users) {
  console.log("Fetching D&D 5e SRD data from the API...");

  const [classes, races, backgrounds, spells, monsters, equipment, magicItems, campaignSummaries] =
    await Promise.all([
      fetchCollection("/api/2014/classes"),
      fetchCollection("/api/2014/races"),
      fetchCollection("/api/2014/backgrounds"),
      fetchCollection("/api/2014/spells"),
      fetchCollection("/api/2014/monsters"),
      fetchCollection("/api/2014/equipment"),
      fetchCollection("/api/2014/magic-items"),
      Promise.all(
        campaignSeeds.map(async (seed) => ({
          seed,
          summary: await fetchWikipediaSummary(seed.wikiTitle),
        })),
      ),
    ]);

  console.log(
    `Fetched index: ${classes.length} classes, ${races.length} races, ${backgrounds.length} backgrounds, ` +
    `${spells.length} spells, ${monsters.length} monsters, ${equipment.length} equipment, ` +
    `${magicItems.length} magic items`,
  );

  console.log("Fetching full details (this takes a moment)...");

  const [classDetails, raceDetails, backgroundDetails, spellDetails, monsterDetails, equipmentDetails, magicItemDetails] =
    await Promise.all([
      mapLimit(classes, 6, (item) => fetchJson(item.url)),
      mapLimit(races, 6, (item) => fetchJson(item.url)),
      mapLimit(backgrounds, 6, (item) => fetchJson(item.url)),
      mapLimit(spells, 8, (item) => fetchJson(item.url)),
      mapLimit(monsters.slice(0, 100), 8, (item) => fetchJson(item.url)),
      mapLimit(equipment.slice(0, 50), 8, (item) => fetchJson(item.url)),
      mapLimit(magicItems.slice(0, 80), 8, (item) => fetchJson(item.url)),
    ]);

  const pageRows = [];
  const revisionRows = [];
  const campaignRows = [];
  const campaignCharacterRows = [];
  const campaignAssetRows = [];
  const campaignRecapRows = [];
  const campaignNoteRows = [];
  const campaignSpellRows = [];

  const curatorIds = users.map(({ user }) => user.id);

  // ── Classes ──────────────────────────────────────────────────────────────
  classDetails.forEach((cls, index) => {
    const slug = `class-${cls.index}`;
    const descText = textLines(cls.desc).join(" ");
    const summary = firstSentence(descText) || `The ${cls.name} class for Dungeons & Dragons 5th Edition.`;
    const savingThrows = (cls.saving_throws ?? []).map((st) => st.name).join(", ") || "None listed";
    const proficiencies = (cls.proficiencies ?? []).map((p) => p.name).join(", ") || "None listed";
    const startingEquipment = (cls.starting_equipment ?? []).map((e) => e.equipment.name).join(", ") || "None listed";
    const subclasses = (cls.subclasses ?? []).map((s) => s.name);

    const content = [
      `# ${cls.name}`,
      "",
      ...textLines(cls.desc),
      "",
      "## Class Features",
      "",
      "| Field | Value |",
      "| --- | --- |",
      `| Hit Die | d${cls.hit_die ?? "?"} |`,
      `| Saving Throws | ${savingThrows} |`,
      `| Proficiencies | ${proficiencies} |`,
      `| Starting Equipment | ${startingEquipment} |`,
      "",
      "## Subclasses",
      "",
      joinList(subclasses),
      "",
      "## Build Notes",
      "",
      `- Primary resource: Hit Die d${cls.hit_die ?? "?"}`,
      `- Saving throw proficiencies: ${savingThrows}`,
      `- Ideal for players who enjoy: see subclass descriptions`,
    ].join("\n");

    pageRows.push({
      id: stableUuid(`page:${slug}`),
      slug,
      title: cls.name,
      summary,
      category: "Classes",
      content,
      creator_id: curatorIds[index % curatorIds.length],
      view_count: 0,
    });
    revisionRows.push({
      id: stableUuid(`revision:${slug}`),
      page_id: stableUuid(`page:${slug}`),
      editor_id: curatorIds[index % curatorIds.length],
      title: cls.name,
      summary,
      content,
      change_note: "Imported from D&D 5e SRD API",
      char_delta: content.length,
    });
  });

  // ── Races ─────────────────────────────────────────────────────────────────
  raceDetails.forEach((race, index) => {
    const slug = `race-${race.index}`;
    const descText = textLines(race.desc).join(" ");
    const summary = firstSentence(descText) || `The ${race.name} race for Dungeons & Dragons 5th Edition.`;
    const traits = (race.traits ?? []).map((t) => t.name);
    const languages = textLines(race.language_desc).join(" ");

    const content = [
      `# ${race.name}`,
      "",
      ...textLines(race.desc),
      "",
      "## Racial Traits",
      "",
      "| Trait | Detail |",
      "| --- | --- |",
      `| Speed | ${race.speed ? `${race.speed} ft.` : "Not specified"} |`,
      `| Size | ${race.size ?? "Not specified"} |`,
      `| Age | ${race.age ?? "Not specified"} |`,
      `| Alignment Tendency | ${race.alignment ?? "Not specified"} |`,
      `| Languages | ${languages || "Common"} |`,
      "",
      "## Traits",
      "",
      joinList(traits),
      "",
      "## Adventuring Hooks",
      "",
      `- Consider the cultural background described above when building a ${race.name} character`,
      "- Racial traits affect ability scores, senses, and class options",
      "- Talk with your DM about how this lineage fits into the campaign world",
    ].join("\n");

    pageRows.push({
      id: stableUuid(`page:${slug}`),
      slug,
      title: race.name,
      summary,
      category: "Races",
      content,
      creator_id: curatorIds[index % curatorIds.length],
      view_count: 0,
    });
    revisionRows.push({
      id: stableUuid(`revision:${slug}`),
      page_id: stableUuid(`page:${slug}`),
      editor_id: curatorIds[index % curatorIds.length],
      title: race.name,
      summary,
      content,
      change_note: "Imported from D&D 5e SRD API",
      char_delta: content.length,
    });
  });

  // ── Backgrounds ───────────────────────────────────────────────────────────
  backgroundDetails.forEach((bg, index) => {
    const slug = `background-${bg.index}`;
    const descText = textLines(bg.desc).join(" ");
    const summary = firstSentence(descText) || `The ${bg.name} background for D&D 5e characters.`;
    const skillProfs = (bg.skill_proficiencies ?? []).map((s) => s.name).join(", ") || "None";
    const langs = (bg.languages ?? []).map((l) => l.name).join(", ") || "None";
    const tools = (bg.tool_proficiencies ?? []).map((t) => t.name).join(", ") || "None";
    const equipment = (bg.starting_equipment ?? []).map((e) => e.equipment?.name ?? e).join(", ") || "None";

    const content = [
      `# ${bg.name}`,
      "",
      ...textLines(bg.desc),
      "",
      "## Background Features",
      "",
      "| Feature | Detail |",
      "| --- | --- |",
      `| Skill Proficiencies | ${skillProfs} |`,
      `| Languages | ${langs} |`,
      `| Tool Proficiencies | ${tools} |`,
      `| Starting Equipment | ${equipment} |`,
    ].join("\n");

    pageRows.push({
      id: stableUuid(`page:${slug}`),
      slug,
      title: bg.name,
      summary,
      category: "Lore",
      content,
      creator_id: curatorIds[index % curatorIds.length],
      view_count: 0,
    });
    revisionRows.push({
      id: stableUuid(`revision:${slug}`),
      page_id: stableUuid(`page:${slug}`),
      editor_id: curatorIds[index % curatorIds.length],
      title: bg.name,
      summary,
      content,
      change_note: "Imported from D&D 5e SRD API",
      char_delta: content.length,
    });
  });

  // ── Spells ────────────────────────────────────────────────────────────────
  spellDetails.forEach((spell, index) => {
    const slug = `spell-${spell.index}`;
    const descLines = textLines(spell.desc);
    const higherLevelLines = textLines(spell.higher_level);
    const summary = firstSentence(descLines.join(" ")) || `${spell.name} — a ${ordinal(spell.level)} spell.`;

    const levelLabel = spell.level === 0 ? "Cantrip" : `${ordinal(spell.level)}-level`;
    const components = Array.isArray(spell.components)
      ? spell.components.join(", ") + (spell.material ? ` (${spell.material})` : "")
      : String(spell.components ?? "Not specified");
    const spellClasses = (spell.classes ?? []).map((c) => c.name).join(", ") || "Not specified";

    const content = [
      `# ${spell.name}`,
      "",
      "## Spell Block",
      "",
      "| Field | Value |",
      "| --- | --- |",
      `| Level | ${levelLabel} |`,
      `| School | ${spell.school?.name ?? "Not specified"} |`,
      `| Casting Time | ${spell.casting_time ?? "Not specified"} |`,
      `| Range | ${spell.range ?? "Not specified"} |`,
      `| Components | ${components} |`,
      `| Duration | ${spell.duration ?? "Not specified"} |`,
      `| Classes | ${spellClasses} |`,
      "",
      "## Effect",
      "",
      ...descLines,
      ...(higherLevelLines.length
        ? ["", "## At Higher Levels", "", ...higherLevelLines]
        : []),
    ].join("\n");

    pageRows.push({
      id: stableUuid(`page:${slug}`),
      slug,
      title: spell.name,
      summary,
      category: "Spells",
      content,
      creator_id: curatorIds[index % curatorIds.length],
      view_count: 0,
    });
    revisionRows.push({
      id: stableUuid(`revision:${slug}`),
      page_id: stableUuid(`page:${slug}`),
      editor_id: curatorIds[index % curatorIds.length],
      title: spell.name,
      summary,
      content,
      change_note: "Imported from D&D 5e SRD API",
      char_delta: content.length,
    });
  });

  // ── Monsters ──────────────────────────────────────────────────────────────
  monsterDetails.forEach((monster, index) => {
    const slug = `monster-${monster.index}`;
    const descLines = textLines(monster.desc);
    const fallback = `${monster.name} is a ${(monster.size ?? "Medium").toLowerCase()} ${(monster.type ?? "creature").toLowerCase()}${monster.alignment ? `, ${monster.alignment.toLowerCase()}` : ""}.`;
    const summary = firstSentence(descLines.join(" ")) || fallback;

    const traits = (monster.special_abilities ?? []).map(
      (t) => `**${t.name}** — ${t.desc ?? ""}`,
    );
    const actions = (monster.actions ?? []).map(
      (a) => `**${a.name}** — ${a.desc ?? ""}`,
    );
    const legendaryActions = (monster.legendary_actions ?? []).map(
      (la) => `**${la.name}** — ${la.desc ?? ""}`,
    );

    const content = [
      `# ${monster.name}`,
      "",
      "## Stat Snapshot",
      "",
      "| Field | Value |",
      "| --- | --- |",
      `| Size | ${monster.size ?? "Not specified"} |`,
      `| Type | ${monster.type ?? "Not specified"} |`,
      `| Alignment | ${monster.alignment ?? "Not specified"} |`,
      `| Armor Class | ${armorClassStr(monster.armor_class)} |`,
      `| Hit Points | ${monster.hit_points ?? "?"} (${monster.hit_dice ?? "?"}) |`,
      `| Speed | ${speedStr(monster.speed)} |`,
      `| Challenge Rating | ${monster.challenge_rating ?? "Not specified"} |`,
      "",
      ...(descLines.length ? [...descLines, ""] : []),
      "## Traits",
      "",
      joinList(traits),
      "",
      "## Actions",
      "",
      joinList(actions),
      ...(legendaryActions.length
        ? ["", "## Legendary Actions", "", joinList(legendaryActions)]
        : []),
    ].join("\n");

    pageRows.push({
      id: stableUuid(`page:${slug}`),
      slug,
      title: monster.name,
      summary,
      category: "Monsters",
      content,
      creator_id: curatorIds[index % curatorIds.length],
      view_count: 0,
    });
    revisionRows.push({
      id: stableUuid(`revision:${slug}`),
      page_id: stableUuid(`page:${slug}`),
      editor_id: curatorIds[index % curatorIds.length],
      title: monster.name,
      summary,
      content,
      change_note: "Imported from D&D 5e SRD API",
      char_delta: content.length,
    });
  });

  // ── Equipment ─────────────────────────────────────────────────────────────
  equipmentDetails.forEach((item, index) => {
    const name = item.name ?? item.index;
    const slug = `item-${item.index}`;
    const descLines = textLines(item.desc);
    const summary = firstSentence(descLines.join(" ")) || `${name} — standard equipment.`;
    const cost = item.cost ? `${item.cost.quantity} ${item.cost.unit}` : "Not specified";
    const damage = item.damage
      ? `${item.damage.damage_dice}${item.damage.damage_type?.name ? ` ${item.damage.damage_type.name}` : ""}`
      : "Not specified";
    const properties = (item.properties ?? []).map((p) => p.name);

    const content = [
      `# ${name}`,
      "",
      "## Item Details",
      "",
      "| Field | Value |",
      "| --- | --- |",
      `| Category | ${item.equipment_category?.name ?? "Not specified"} |`,
      `| Cost | ${cost} |`,
      `| Weight | ${item.weight ? `${item.weight} lb.` : "Not specified"} |`,
      `| Damage | ${damage} |`,
      `| Range | ${item.range ?? "Not specified"} |`,
      ...(item.armor_class
        ? [`| Armor Class | ${item.armor_class.base ?? "?"} + Dex modifier |`]
        : []),
      "",
      ...(descLines.length ? [...descLines, ""] : []),
      "## Properties",
      "",
      joinList(properties),
    ].join("\n");

    pageRows.push({
      id: stableUuid(`page:${slug}`),
      slug,
      title: name,
      summary,
      category: "Items",
      content,
      creator_id: curatorIds[index % curatorIds.length],
      view_count: 0,
    });
    revisionRows.push({
      id: stableUuid(`revision:${slug}`),
      page_id: stableUuid(`page:${slug}`),
      editor_id: curatorIds[index % curatorIds.length],
      title: name,
      summary,
      content,
      change_note: "Imported from D&D 5e SRD API",
      char_delta: content.length,
    });
  });

  // ── Magic Items ───────────────────────────────────────────────────────────
  magicItemDetails.forEach((item, index) => {
    const name = item.name ?? item.index;
    const slug = `magic-item-${item.index}`;
    const descLines = textLines(item.desc);
    const rarity = item.rarity?.name ?? "Unknown";
    const summary =
      firstSentence(descLines.join(" ")) ||
      `${name} is a ${rarity.toLowerCase()} magic item.`;
    const variants = (item.variants ?? []).map((v) => v.name);
    const requiresAttunement =
      typeof item.requires_attunement === "string"
        ? item.requires_attunement
        : item.requires_attunement
        ? "Required"
        : "Not required";

    const content = [
      `# ${name}`,
      "",
      "## Item Details",
      "",
      "| Field | Value |",
      "| --- | --- |",
      `| Rarity | ${rarity} |`,
      `| Type | ${item.equipment_category?.name ?? "Wondrous Item"} |`,
      `| Attunement | ${requiresAttunement} |`,
      "",
      "## Effect",
      "",
      ...descLines,
      ...(variants.length ? ["", "## Variants", "", joinList(variants)] : []),
    ].join("\n");

    pageRows.push({
      id: stableUuid(`page:${slug}`),
      slug,
      title: name,
      summary,
      category: "Items",
      content,
      creator_id: curatorIds[index % curatorIds.length],
      view_count: 0,
    });
    revisionRows.push({
      id: stableUuid(`revision:${slug}`),
      page_id: stableUuid(`page:${slug}`),
      editor_id: curatorIds[index % curatorIds.length],
      title: name,
      summary,
      content,
      change_note: "Imported from D&D 5e SRD API — magic items",
      char_delta: content.length,
    });
  });

  // ── Campaigns (wiki pages + campaign vault entries) ───────────────────────
  campaignSummaries.forEach(({ seed, summary: wiki }, index) => {
    const slug = `campaign-${slugify(seed.title)}`;
    const extract = wiki?.extract || wiki?.description || null;
    const summary = firstSentence(extract ?? `${seed.title} is a published D&D 5e adventure.`);
    const campaignId = stableUuid(`campaign:${seed.title}`);

    // Wiki page for the campaign (Campaigns category)
    const pageContent = [
      `# ${seed.title}`,
      "",
      extract ?? `${seed.title} is a published Dungeons & Dragons adventure module.`,
      "",
      "## Campaign Notes",
      "",
      "| Field | Value |",
      "| --- | --- |",
      `| World | ${seed.worldName} |`,
      `| System | D&D 5e |`,
      `| Type | Published Adventure Module |`,
    ].join("\n");

    pageRows.push({
      id: stableUuid(`page:${slug}`),
      slug,
      title: seed.title,
      summary,
      category: "Campaigns",
      content: pageContent,
      creator_id: curatorIds[index % curatorIds.length],
      view_count: 0,
    });
    revisionRows.push({
      id: stableUuid(`revision:${slug}`),
      page_id: stableUuid(`page:${slug}`),
      editor_id: curatorIds[index % curatorIds.length],
      title: seed.title,
      summary,
      content: pageContent,
      change_note: "Imported from Wikipedia public summary",
      char_delta: pageContent.length,
    });

    // Campaign vault entry
    campaignRows.push({
      id: campaignId,
      slug,
      name: seed.title,
      summary,
      system: "D&D 5e",
      world_name: seed.worldName,
      created_by: curatorIds[index % curatorIds.length],
      is_public: true,
      session_count: 1,
      last_recap: summary,
      last_recap_at: new Date().toISOString(),
    });

    campaignRecapRows.push({
      id: stableUuid(`campaign-recap:${seed.title}`),
      campaign_id: campaignId,
      session_number: 1,
      recap: summary,
      important_points: [
        summary,
        `Setting: ${seed.worldName}`,
        "Published adventure module — reference entry",
      ],
      created_by: curatorIds[index % curatorIds.length],
    });

    campaignNoteRows.push({
      id: stableUuid(`campaign-note:${seed.title}`),
      campaign_id: campaignId,
      note_type: "lore",
      title: seed.title,
      content: pageContent,
      pinned: true,
      created_by: curatorIds[index % curatorIds.length],
    });

    campaignAssetRows.push({
      id: stableUuid(`campaign-asset:${seed.title}`),
      campaign_id: campaignId,
      uploaded_by: curatorIds[index % curatorIds.length],
      asset_type: "handout",
      title: `${seed.title} Cover`,
      description: `Campaign card for the adventure reference ${seed.title}.`,
      storage_path: `seed/${slug}/cover.svg`,
      public_url: makeBadgeSvg(seed.title, "Published D&D 5e Adventure", makeColors(index)),
    });

    campaignSpellRows.push({
      id: stableUuid(`campaign-spell:${seed.title}`),
      campaign_id: campaignId,
      created_by: curatorIds[index % curatorIds.length],
      name: `${seed.title} Sigil`,
      summary: `A signature ward tied to the events of ${seed.title}.`,
      level: `${ordinal(1 + (index % 4))}-level`,
      school: index % 2 === 0 ? "Abjuration" : "Illusion",
      casting_time: "1 action",
      range: index % 2 === 0 ? "60 feet" : "Touch",
      components: "V, S, M",
      duration: index % 3 === 0 ? "1 hour" : "Concentration, up to 10 minutes",
      content: [
        `# ${seed.title} Sigil`,
        "",
        `A warding mark inspired by the events of the ${seed.title} adventure.`,
        "",
        "## Effect",
        "",
        "Choose a creature, door, map, or handout associated with this campaign.",
        "Until the spell ends, the target glows with an arcane mark recognizable to allies.",
        "",
        "## At Higher Levels",
        "",
        "When cast using a higher-level slot, the sigil extends to one additional object or creature within range.",
      ].join("\n"),
    });
  });

  // ── Characters (one per class, spread across campaigns) ──────────────────
  const classCycle = classDetails.slice(0, Math.min(12, classDetails.length));
  const raceCycle = raceDetails.slice(0, Math.min(12, raceDetails.length));
  const bgNames = backgroundDetails.map((b) => b.name);

  if (campaignRows.length > 0 && classCycle.length > 0 && raceCycle.length > 0) {
    classCycle.forEach((cls, index) => {
      const race = raceCycle[index % raceCycle.length];
      const campaign = campaignRows[index % campaignRows.length];
      const name = `${race.name} ${cls.name}`;
      const background = bgNames[index % Math.max(bgNames.length, 1)] ?? "Adventurer";

      campaignCharacterRows.push({
        id: stableUuid(`character:${name}:${campaign.id}`),
        campaign_id: campaign.id,
        profile_id: curatorIds[index % curatorIds.length],
        name,
        race: race.name,
        class_name: cls.name,
        level: 1 + (index % 10),
        portrait_url: makeBadgeSvg(name, cls.name, makeColors(index)),
        sheet_url: null,
        sheet_data: {
          class_index: cls.index,
          race_index: race.index,
          background,
          hit_die: cls.hit_die ?? null,
          speed: race.speed ?? null,
          proficiencies: (cls.proficiencies ?? []).map((p) => p.name),
        },
      });
    });
  }

  return {
    pageRows,
    revisionRows,
    campaignRows,
    campaignCharacterRows,
    campaignAssetRows,
    campaignRecapRows,
    campaignNoteRows,
    campaignSpellRows,
  };
}

async function main() {
  console.log("ArcanumWiki — seeding public SRD content from the D&D 5e API...");
  console.log("API source:", PUBLIC_CONTENT_SOURCE);

  await ensureRequiredTables([
    "profiles",
    "pages",
    "revisions",
    "campaigns",
    "campaign_members",
    "campaign_assets",
    "campaign_recaps",
    "campaign_notes",
  ]);

  const users = await seedProfiles();
  console.log(`Created/verified ${users.length} seed profiles.`);

  const imported = await importPages(users);
  console.log(
    `Built ${imported.pageRows.length} wiki pages across all categories, ` +
    `${imported.campaignRows.length} campaigns, ${imported.campaignCharacterRows.length} characters.`,
  );

  // Upsert wiki pages
  const { error: pageError } = await supabase
    .from("pages")
    .upsert(imported.pageRows, { onConflict: "slug" });
  if (pageError) throw pageError;
  console.log(`Upserted ${imported.pageRows.length} wiki pages.`);

  // Revisions: delete existing for these pages, then insert fresh
  const { error: revDelError } = await supabase
    .from("revisions")
    .delete()
    .in("page_id", imported.pageRows.map((r) => r.id));
  if (revDelError) throw revDelError;

  const { error: revInsError } = await supabase
    .from("revisions")
    .insert(imported.revisionRows);
  if (revInsError) throw revInsError;
  console.log(`Inserted ${imported.revisionRows.length} revisions.`);

  // Upsert campaigns
  await upsertRows("campaigns", imported.campaignRows, "slug");
  console.log(`Upserted ${imported.campaignRows.length} campaigns.`);

  // For all campaign sub-tables: delete existing seed data, then insert fresh.
  // This order matters — members come before characters to satisfy FK constraints.
  const campaignIds = imported.campaignRows.map((r) => r.id);
  const subTables = [
    "campaign_members",
    "campaign_characters",
    "campaign_assets",
    "campaign_recaps",
    "campaign_notes",
    "campaign_homebrew_spells",
  ];
  for (const table of subTables) {
    const { error } = await supabase.from(table).delete().in("campaign_id", campaignIds);
    if (error) throw error;
  }

  // Build campaign member rows
  const campaignMemberRows = imported.campaignRows.flatMap((campaign, index) => {
    const dm = users[index % users.length];
    const player = users[(index + 1) % users.length];
    return [
      {
        id: stableUuid(`campaign-member:${campaign.slug}:dm`),
        campaign_id: campaign.id,
        profile_id: dm.user.id,
        role: "dm",
        display_name: dm.seed.display_name,
        character_name: `${campaign.name} Anchor`,
      },
      {
        id: stableUuid(`campaign-member:${campaign.slug}:player`),
        campaign_id: campaign.id,
        profile_id: player.user.id,
        role: "player",
        display_name: player.seed.display_name,
        character_name: `${campaign.name} Wanderer`,
      },
    ];
  });

  // Insert all sub-data fresh (members first, then everything else)
  await insertRows("campaign_members", campaignMemberRows);
  await insertRows("campaign_characters", imported.campaignCharacterRows);
  await insertRows("campaign_assets", imported.campaignAssetRows);
  await insertRows("campaign_recaps", imported.campaignRecapRows);
  await insertRows("campaign_notes", imported.campaignNoteRows);
  await insertRows("campaign_homebrew_spells", imported.campaignSpellRows);

  console.log("Done.");
  console.log(`  ${imported.pageRows.length} wiki pages`);
  console.log(`  ${imported.revisionRows.length} revisions`);
  console.log(`  ${imported.campaignRows.length} campaigns`);
  console.log(`  ${campaignMemberRows.length} campaign members`);
  console.log(`  ${imported.campaignCharacterRows.length} characters`);
  console.log(`  ${imported.campaignAssetRows.length} campaign assets`);
  console.log(`  ${imported.campaignRecapRows.length} session recaps`);
  console.log(`  ${imported.campaignNoteRows.length} campaign notes`);
  console.log(`  ${imported.campaignSpellRows.length} homebrew spells`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

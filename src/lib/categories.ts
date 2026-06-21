export const CATEGORIES = [
  "Classes",
  "Races",
  "Spells",
  "Monsters",
  "Items",
  "Lore",
  "Campaigns",
  "Homebrew",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type CategoryMeta = {
  tagline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  starter: {
    title: string;
    summary: string;
    content: string;
  };
};

export type CategoryHub = {
  path?: string;
  label: string;
  description: string;
};

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Classes: {
    tagline: "Build notes, subclass instincts, and what each class feels like at the table.",
    description: "Class pages that explain role, tempo, strengths, and where the fantasy lands.",
    seoTitle: "D&D Classes - ArcanumWiki",
    seoDescription:
      "Browse D&D classes with clean role notes, build instincts, and practical table-facing summaries.",
    starter: {
      title: "Class field notes",
      summary: "A plain answer on who this class serves and what it does well.",
      content: `# Overview

This class is strongest when the page explains the fantasy, the table role, and the decisions a player makes turn by turn.

## Core strengths

- Reliable contribution in the scenes it is built for.
- A clear party role that helps new players choose confidently.
- Build choices that change feel without hiding the basic loop.

## Watch for

- A class can feel flat if the page only lists mechanics.
- Subclass identity needs its own note once the core loop is clear.

## Party fit

- Explain who this class protects, enables, pressures, or follows up on.
`,
    },
  },
  Races: {
    tagline: "Lineage pages that care about culture, habits, and story hooks.",
    description: "Races and lineages described as people with history, not just stat blocks.",
    seoTitle: "D&D Races - ArcanumWiki",
    seoDescription:
      "Browse D&D races and lineages with culture, character hooks, and clear at-table notes.",
    starter: {
      title: "Lineage notes",
      summary: "What this lineage feels like in play and why a player might choose it.",
      content: `# Overview

This lineage page should make ancestry, culture, and story hooks feel usable during character creation.

## Traits that matter

- Highlight the traits players will remember in actual scenes.
- Explain where those traits change tactics, travel, or social play.

## Culture and customs

- Name one everyday custom that makes this people feel specific.
- Tie that custom to a place, trade, institution, or old conflict.

## Story hooks

- Give the player a reason to belong somewhere.
- Give the DM a reason this background matters in the current campaign.
`,
    },
  },
  Spells: {
    tagline: "Spell pages focused on use, timing, and why a slot is worth spending.",
    description: "Spell reference pages written for quick reading during prep or at the table.",
    seoTitle: "D&D Spells - ArcanumWiki",
    seoDescription:
      "Browse D&D spells with practical casting notes, table use, and clean reference formatting.",
    starter: {
      title: "Spell card",
      summary: "The clean version of what the spell does, when it matters, and what it costs.",
      content: `# Spell block

| Field | Value |
| --- | --- |
| Level | Confirm at table |
| School | Confirm at table |
| Casting Time | Confirm at table |
| Range | Confirm at table |
| Duration | Confirm at table |

## When it earns the slot

- Use this spell when its timing, target, or certainty solves the immediate problem.
- Call out the party plan that makes the spell better than a simple damage option.

## Watch for

- Explain the save, reaction, concentration, or component cost that players forget.
`,
    },
  },
  Monsters: {
    tagline: "Threat pages that explain behavior, pressure, and encounter shape.",
    description: "Monster pages written for people who need tactics and scene texture fast.",
    seoTitle: "D&D Monsters - ArcanumWiki",
    seoDescription:
      "Browse D&D monsters with behavior notes, tactics, and encounter-ready summaries.",
    starter: {
      title: "Monster play notes",
      summary: "What the monster does in a scene and how a DM should run it.",
      content: `# Snapshot

| Field | Value |
| --- | --- |
| Threat | Depends on party level and numbers |
| Terrain | Choose terrain that supports the monster's behavior |
| Role | Define what pressure it adds to the encounter |

## Behavior

- Describe what the creature wants before initiative starts.
- Give it one habit that changes how players read the scene.

## Tactics

- Start with the first two rounds, then explain what changes when it is hurt.
- Note when it flees, bargains, protects something, or escalates.

## Treasure or aftermath

- Leave one clue, reward, consequence, or rumor behind after the encounter.
`,
    },
  },
  Items: {
    tagline: "Gear pages that treat utility and story value like part of the same thing.",
    description: "Items, relics, and consumables with clean notes on use, rarity, and table impact.",
    seoTitle: "D&D Items - ArcanumWiki",
    seoDescription:
      "Browse D&D items, relics, and gear with rarity notes, synergies, and practical summaries.",
    starter: {
      title: "Item notes",
      summary: "What the item changes in play and why a party remembers it.",
      content: `# Item details

| Field | Value |
| --- | --- |
| Rarity | Confirm at table |
| Type | Gear, relic, consumable, or tool |
| Attunement | Yes, no, or table-specific |

## Best use

- Explain the scene where the item becomes worth tracking.
- Mention who in the party benefits most and why.

## Story hook

- Give the item a maker, previous owner, rumor, flaw, or visible mark.
`,
    },
  },
  Lore: {
    tagline: "Places, factions, and histories written to be used, not merely admired.",
    description: "Lore pages that hand DMs a few strong facts and turn them into usable prep.",
    seoTitle: "D&D Lore - ArcanumWiki",
    seoDescription:
      "Browse D&D lore with practical worldbuilding notes, timelines, factions, and hooks.",
    starter: {
      title: "Lore notes",
      summary: "What matters about this setting detail right now.",
      content: `# Overview

Explain the place, faction, myth, or history in language a DM can use during prep.

## Why it matters

- State the current pressure it creates in the world.
- Tie the detail to a choice players may actually make.

## Current pressure points

- Name who wants it protected, changed, exposed, or buried.
- Name what happens if nobody acts.

## Hooks

- Offer a social hook, a travel hook, and a danger hook.
`,
    },
  },
  Campaigns: {
    tagline: "Adventure pages built to help a group reach session one quickly.",
    description: "Campaign notes, module primers, and location pages with actual prep value.",
    seoTitle: "D&D Campaigns - ArcanumWiki",
    seoDescription:
      "Browse D&D campaign notes, module primers, and location pages built for real prep.",
    starter: {
      title: "Campaign primer",
      summary: "The premise, tone, and what a DM should prep first.",
      content: `# Premise

State the campaign promise in one paragraph: what the party does, what pressure is rising, and why the first session matters.

## Starting hook

- Give the group a clear reason to act together.
- Put a named place, person, or object in immediate trouble.

## What to prep first

- Prepare the opening scene, three useful NPCs, and one consequence if the party delays.
- Keep the first map or location small enough to run without a lore lecture.

## Tone and pressure

- Explain whether the campaign rewards caution, heroics, intrigue, horror, or discovery.
`,
    },
  },
  Homebrew: {
    tagline: "Original rules and experiments with the problem statement left visible.",
    description: "Homebrew pages that explain design goals, tradeoffs, and playtest risks honestly.",
    seoTitle: "D&D Homebrew - ArcanumWiki",
    seoDescription:
      "Browse D&D homebrew rules, items, monsters, and experiments with visible design notes.",
    starter: {
      title: "Homebrew draft",
      summary: "What the rule or creation is trying to fix, add, or sharpen.",
      content: `# Concept

Describe the rule, item, class option, spell, or subsystem in one direct paragraph.

## Problem it solves

- Name the table problem or fantasy gap this homebrew addresses.
- Say what the existing rules do not handle well enough.

## Rule text

- Write the playable rule as clearly as it would appear in a handout.
- Include costs, limits, timing, and who makes each decision.

## Playtest notes

- Record the strongest use case, the easiest abuse case, and what to watch in session.
`,
    },
  },
};

export const CATEGORY_HUBS: Partial<Record<Category, CategoryHub>> = {
  Classes: {
    path: "/dnd-classes",
    label: "D&D class hub",
    description: "Field guides for classes, subclasses, and build instincts.",
  },
  Spells: {
    path: "/dnd-spells",
    label: "D&D spell hub",
    description: "Quick spell pages built for prep and table use.",
  },
  Monsters: {
    path: "/dnd-monsters",
    label: "D&D monster hub",
    description: "Threat notes, encounter pressure, and bestiary highlights.",
  },
  Items: {
    path: "/dnd-items",
    label: "D&D item hub",
    description: "Loot, relics, and utility gear with readable summaries.",
  },
};

export const HOME_PORTALS = [
  {
    title: "Build a character",
    description: "Start with class notes, lineage pages, and spells that answer real table questions.",
    category: "Classes" as Category,
  },
  {
    title: "Prep the threat",
    description: "Open monster pages, pacing notes, and encounter-ready ideas for your next session.",
    category: "Monsters" as Category,
  },
  {
    title: "Search the setting",
    description: "Use lore pages and campaign primers as quick-reference material, not wallpaper.",
    category: "Lore" as Category,
  },
  {
    title: "Test new rules",
    description: "Keep homebrew experiments visible, credited, and easy to retest after play.",
    category: "Homebrew" as Category,
  },
] as const;

export function getCategoryHub(category: Category): CategoryHub | null {
  return CATEGORY_HUBS[category] ?? null;
}

export function getStarterTemplate(category: Category) {
  return CATEGORY_META[category].starter;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

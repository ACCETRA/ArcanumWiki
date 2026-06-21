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

Describe the class fantasy, table role, and where it shines.

## Core strengths

- 

## Watch for

- 

## Party fit

- 
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

Summarize the lineage and what it brings to the campaign.

## Traits that matter

- 

## Culture and customs

- 

## Story hooks

- 
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
| Level |  |
| School |  |
| Casting Time |  |
| Range |  |
| Duration |  |

## When it earns the slot

- 

## Watch for

- 
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
| Threat |  |
| Terrain |  |
| Role |  |

## Behavior

- 

## Tactics

- 

## Treasure or aftermath

- 
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
| Rarity |  |
| Type |  |
| Attunement |  |

## Best use

- 

## Story hook

- 
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

Explain the idea in table-ready language.

## Why it matters

- 

## Current pressure points

- 

## Hooks

- 
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

## Starting hook

- 

## What to prep first

- 

## Tone and pressure

- 
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

## Problem it solves

- 

## Rule text

- 

## Playtest notes

- 
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
    description: "Keep homebrew experiments visible, credited, and easy to revisit later.",
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

import {
  BookOpenText,
  Gem,
  MapPinned,
  ScrollText,
  Shield,
  Skull,
  Sparkles,
  Swords,
} from "lucide-react";

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
  icon: typeof ScrollText;
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
    icon: Swords,
    tagline: "Fighters, wizards, rogues, and everything in between.",
    description: "Class deep-dives, subclasses, progression notes, and combat identity.",
    seoTitle: "D&D Classes - ArcanumWiki",
    seoDescription:
      "Browse D&D classes, subclass ideas, progression notes, and build guidance in a clean editorial archive.",
    starter: {
      title: "Class name",
      summary: "A concise overview of the class role and fantasy.",
      content: `# Overview

Describe the class fantasy, role, and table niche.

## Features

| Level | Feature | Notes |
| --- | --- | --- |
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |

## Subclasses

- 

## Build Notes

- Strengths:
- Weaknesses:
- Ideal party role:
`,
    },
  },
  Races: {
    icon: Sparkles,
    tagline: "Species, lineages, cultures, and character roots.",
    description: "Species and lineage references with culture, traits, and story hooks.",
    seoTitle: "D&D Races - ArcanumWiki",
    seoDescription:
      "Browse D&D races, lineages, and ancestry pages with culture notes, traits, and story hooks.",
    starter: {
      title: "Lineage name",
      summary: "What makes this lineage distinct in play and story.",
      content: `# Overview

Summarize the lineage, ancestry, or people.

## Traits

| Trait | Detail |
| --- | --- |
| Speed |  |
| Size |  |
| Senses |  |
| Features |  |

## Culture and Society

## Adventuring Hooks

- 
`,
    },
  },
  Spells: {
    icon: BookOpenText,
    tagline: "Arcane, divine, and primal magic at a glance.",
    description: "Spell references with scaling, school, and combat-use guidance.",
    seoTitle: "D&D Spells - ArcanumWiki",
    seoDescription:
      "Browse D&D spells with level, school, casting details, and practical spellbook references.",
    starter: {
      title: "Spell name",
      summary: "The spell's effect, role, and best uses.",
      content: `# Spell Block

| Field | Value |
| --- | --- |
| Level |  |
| School |  |
| Casting Time |  |
| Range |  |
| Components |  |
| Duration |  |

## Effect

## Upcasting

## Best Uses

- 
`,
    },
  },
  Monsters: {
    icon: Skull,
    tagline: "Bestiary entries, boss fights, and encounter notes.",
    description: "Creature pages with tactics, abilities, and encounter pacing.",
    seoTitle: "D&D Monsters - ArcanumWiki",
    seoDescription:
      "Browse D&D monsters, encounter threats, and bestiary pages with tactics, role, and quick-reference notes.",
    starter: {
      title: "Monster name",
      summary: "What this creature does in a scene or encounter.",
      content: `# Stat Snapshot

| Field | Value |
| --- | --- |
| Type |  |
| Size |  |
| Alignment |  |
| Armor Class |  |
| Hit Points |  |
| Speed |  |

## Traits

## Actions

## Tactics

## Treasure
`,
    },
  },
  Items: {
    icon: Gem,
    tagline: "Magic items, relics, consumables, and gear.",
    description: "Loot entries with rarity, attunement, and story value.",
    seoTitle: "D&D Items - ArcanumWiki",
    seoDescription:
      "Browse D&D items, relics, and gear pages with rarity, attunement, lore, and table-ready summaries.",
    starter: {
      title: "Item name",
      summary: "What the item does and why adventurers chase it.",
      content: `# Item Details

| Field | Value |
| --- | --- |
| Rarity |  |
| Type |  |
| Attunement |  |

## Effect

## Lore

## Synergies
`,
    },
  },
  Lore: {
    icon: ScrollText,
    tagline: "Histories, gods, planes, and the shape of the world.",
    description: "Setting canon, timelines, factions, and deep lore references.",
    seoTitle: "D&D Lore - ArcanumWiki",
    seoDescription:
      "Browse D&D lore pages for gods, planes, timelines, factions, and worldbuilding references.",
    starter: {
      title: "Lore topic",
      summary: "The key worldbuilding idea in one line.",
      content: `# Overview

Explain the lore entry and why it matters.

## History

## Current Status

## Factions or Figures

## Related Places
`,
    },
  },
  Campaigns: {
    icon: MapPinned,
    tagline: "Adventures, modules, locations, and campaign notes.",
    description: "Adventure archives with sessions, places, and quest hooks.",
    seoTitle: "D&D Campaigns - ArcanumWiki",
    seoDescription:
      "Browse D&D campaign pages with sessions, locations, quest hooks, and adventure notes.",
    starter: {
      title: "Campaign name",
      summary: "The premise and tone of the adventure.",
      content: `# Premise

## Starting Hook

## Key Locations

## Important NPCs

## Session Zero Notes

## Quest Arc
`,
    },
  },
  Homebrew: {
    icon: Shield,
    tagline: "Original content, playtest ideas, and house rules.",
    description: "Player-made creations, variants, and experimental content.",
    seoTitle: "D&D Homebrew - ArcanumWiki",
    seoDescription:
      "Browse D&D homebrew classes, monsters, spells, items, and house rules in one archive.",
    starter: {
      title: "Homebrew idea",
      summary: "What the homebrew is trying to solve or add.",
      content: `# Concept

## Design Goals

## Mechanics

## Balance Notes

## Playtest Feedback
`,
    },
  },
};

export const CATEGORY_HUBS: Partial<Record<Category, CategoryHub>> = {
  Classes: {
    path: "/dnd-classes",
    label: "Browse the class hub",
    description: "A landing page for class build ideas, subclasses, and reading order.",
  },
  Spells: {
    path: "/dnd-spells",
    label: "Browse the spell hub",
    description: "A landing page for spell pages, schools, and casting notes.",
  },
  Monsters: {
    path: "/dnd-monsters",
    label: "Browse the monster hub",
    description: "A landing page for bestiary pages, threats, and encounter prep.",
  },
  Items: {
    path: "/dnd-items",
    label: "Browse the item hub",
    description: "A landing page for loot, relics, and gear references.",
  },
};

export function getCategoryHub(category: Category): CategoryHub | null {
  return CATEGORY_HUBS[category] ?? null;
}

export const HOME_PORTALS = [
  {
    title: "Build a character",
    description: "Jump into classes, lineages, and spells that define a hero.",
    category: "Classes" as Category,
  },
  {
    title: "Study the monsters",
    description: "Find threats, boss fights, and encounter ideas fast.",
    category: "Monsters" as Category,
  },
  {
    title: "Open the lore archive",
    description: "Browse settings, gods, factions, and world history.",
    category: "Lore" as Category,
  },
  {
    title: "Forge homebrew",
    description: "Record table rules, custom classes, and original monsters.",
    category: "Homebrew" as Category,
  },
] as const;

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

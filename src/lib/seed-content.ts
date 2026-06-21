import type { Category } from "@/lib/categories";

type SeedAuthor = {
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
};

type SeedPageSpec = {
  slug: string;
  title: string;
  summary: string;
  category: Category;
  author: keyof typeof AUTHORS;
  updatedAt: string;
  viewCount: number;
  lead: string;
  facts: Array<[string, string]>;
  useWhen: string[];
  watchFor: string[];
  related: string[];
};

type SeedPage = SeedPageSpec & {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  creator_id: string;
  profiles: SeedAuthor;
};

const AUTHORS: Record<string, SeedAuthor> = {
  ammad: {
    username: "ammad",
    display_name: "Ammad Kiyani",
    bio: "Founder note, page cleanup, and the first set of human-written entries.",
    avatar_url: null,
  },
  mira: {
    username: "mira-quill",
    display_name: "Mira Quill",
    bio: "Campaign notes, recaps, and the pages that make the archive feel lived in.",
    avatar_url: null,
  },
  elowen: {
    username: "elowen-ash",
    display_name: "Elowen Ash",
    bio: "Rules clarity, spell reference, and tidy structure work.",
    avatar_url: null,
  },
  torren: {
    username: "torren-vale",
    display_name: "Torren Vale",
    bio: "Bestiary edits, encounter prep, and gear notes with actual table use.",
    avatar_url: null,
  },
} as const;

const PAGE_SPECS: SeedPageSpec[] = [
  {
    slug: "fighter-field-guide",
    title: "Fighter Field Guide",
    summary: "A straight answer on when the Fighter feels great, and what kind of table makes it shine.",
    category: "Classes",
    author: "torren",
    updatedAt: "2026-06-18T10:15:00.000Z",
    viewCount: 126,
    lead:
      "This is the class page for players who want durable turns, simple math, and room for the battlefield to matter.",
    facts: [
      ["Role", "Frontline striker and anchor"],
      ["Best at", "Turning weapon attacks and positioning into reliable value"],
      ["Complexity", "Low on rules, high on tactical discipline"],
      ["Watch for", "Feeling plain if the party never gets hard fights or tight spaces"],
    ],
    useWhen: [
      "You want a character who is useful from level 1 without a long setup.",
      "Your table likes movement, cover, and enemies that hit back hard.",
    ],
    watchFor: [
      "A Fighter can feel samey if every encounter is a flat damage race.",
      "The subclass choice matters more than the base chassis once the campaign settles in.",
    ],
    related: ["battle-mage-wizard", "dwarf-shield-wall", "goblin-ambush-guide"],
  },
  {
    slug: "battle-mage-wizard",
    title: "Battle Mage Wizard",
    summary: "A practical wizard page for players who want control, not just fireworks.",
    category: "Classes",
    author: "elowen",
    updatedAt: "2026-06-17T08:45:00.000Z",
    viewCount: 119,
    lead:
      "The Wizard is still the sharpest tool in the room when the page explains why preparation matters and which spells actually win fights.",
    facts: [
      ["Role", "Control, utility, and burst damage"],
      ["Best at", "Solving problems before initiative even starts"],
      ["Complexity", "High, because spell choice is the whole game"],
      ["Watch for", "Preparing the wrong list and spending a session feeling thin"],
    ],
    useWhen: [
      "You enjoy planning ahead and want the widest spellbook in the party.",
      "The campaign rewards scouting, rituals, and smart battlefield control.",
    ],
    watchFor: [
      "A wizard without good preparation can feel fragile and redundant.",
      "The best notes are the ones that say when not to cast a flashy spell.",
    ],
    related: ["magic-missile", "shield", "feywild-map-legend"],
  },
  {
    slug: "rogue-side-door",
    title: "Rogue Side Door Notes",
    summary: "A page for the player who wants to be useful every round and never stop finding openings.",
    category: "Classes",
    author: "ammad",
    updatedAt: "2026-06-12T12:00:00.000Z",
    viewCount: 103,
    lead:
      "The Rogue is the class that rewards timing, target choice, and the habit of reading the room before the room reads you.",
    facts: [
      ["Role", "Skirmisher, scout, and skill specialist"],
      ["Best at", "Picking the right target and making one attack count"],
      ["Complexity", "Medium, because positioning matters every turn"],
      ["Watch for", "Feeling weak when the table never gives you a chance to move"],
    ],
    useWhen: [
      "You want strong out-of-combat skills and a clean combat loop.",
      "The campaign has doors, traps, secrets, and social scenes worth playing.",
    ],
    watchFor: [
      "Sneak Attack is easier to miss than new players expect.",
      "Rogues need the page to explain how to stay relevant without hogging the spotlight.",
    ],
    related: ["halfling-luck", "immovable-rod", "shadow-lair"],
  },
  {
    slug: "cleric-table-prayer",
    title: "Cleric Table Prayer",
    summary: "A clean cleric page that treats healing as one tool, not the whole identity.",
    category: "Classes",
    author: "mira",
    updatedAt: "2026-06-10T09:20:00.000Z",
    viewCount: 97,
    lead:
      "The Cleric works best when the page explains that it is a support class with real combat teeth, not a walking potion dispenser.",
    facts: [
      ["Role", "Support, durability, and flexible magic"],
      ["Best at", "Keeping a party moving while still threatening the enemy line"],
      ["Complexity", "Medium, because the spell list does real work"],
      ["Watch for", "Overcommitting to healing and missing the class's offensive options"],
    ],
    useWhen: [
      "You want a reliable support character who still gets to make big decisions.",
      "Your table values recovery, protection, and strong domain identity.",
    ],
    watchFor: [
      "A cleric page should say when to heal and when to end the fight.",
      "Domain choice changes the whole feel of the class, so call that out early.",
    ],
    related: ["healing-word", "potion-of-healing", "lost-mine-primer"],
  },
  {
    slug: "human-adventurer",
    title: "Human Adventurer",
    summary: "A human page that focuses on flexibility, not blandness.",
    category: "Races",
    author: "ammad",
    updatedAt: "2026-06-18T12:20:00.000Z",
    viewCount: 88,
    lead:
      "A good species page explains why the choice matters at the table and what kind of story the player gets to tell.",
    facts: [
      ["Theme", "Adaptability and plainspoken ambition"],
      ["Best at", "Fitting any class without forcing the narrative"],
      ["Story hook", "A character who leans on grit, luck, and social reach"],
      ["Watch for", "Writing the species as if it has no culture at all"],
    ],
    useWhen: [
      "You want a character concept that can go in almost any direction.",
      "The campaign needs someone who feels at home in every town and tavern.",
    ],
    watchFor: [
      "The page should not confuse flexibility with being generic.",
      "Bring a real culture, family tie, or region into the writeup.",
    ],
    related: ["halfling-luck", "waterdeep-notes", "fighter-field-guide"],
  },
  {
    slug: "elf-wood-and-starlight",
    title: "Elf, Wood and Starlight",
    summary: "A lineage page about grace, memory, and the long view.",
    category: "Races",
    author: "elowen",
    updatedAt: "2026-06-16T07:40:00.000Z",
    viewCount: 84,
    lead:
      "The elf entry works when it treats elegance as a lived tradition instead of a decorative adjective.",
    facts: [
      ["Theme", "Long memory, precise motion, and quiet confidence"],
      ["Best at", "Characters who notice more than they say"],
      ["Story hook", "A life shaped by old vows and older grudges"],
      ["Watch for", "Turning the whole ancestry into one flat fantasy stereotype"],
    ],
    useWhen: [
      "You want a character tied to history and old institutions.",
      "Your campaign benefits from people who remember what everyone else forgot.",
    ],
    watchFor: [
      "The page should say what makes this community feel real today.",
      "A lineage entry should include culture, not only traits.",
    ],
    related: ["feywild-map-legend", "shadow-lair", "battle-mage-wizard"],
  },
  {
    slug: "dwarf-shield-wall",
    title: "Dwarf Shield Wall",
    summary: "A grounded dwarf page for players who want stubborn resilience and craft pride.",
    category: "Races",
    author: "torren",
    updatedAt: "2026-06-15T11:10:00.000Z",
    viewCount: 80,
    lead:
      "The best dwarf writeups talk about labor, oaths, and the patience to outlast a bad day.",
    facts: [
      ["Theme", "Endurance, stonework, and inherited craft"],
      ["Best at", "Characters who keep going when everyone else needs a rest"],
      ["Story hook", "A maker, guard, or exile with a specific place in the world"],
      ["Watch for", "Reducing the culture to beards and ale"],
    ],
    useWhen: [
      "You want a character whose identity is tied to work and memory.",
      "The campaign includes mines, keeps, guilds, or old grudges.",
    ],
    watchFor: [
      "Make the craft or clan detail specific enough to matter in play.",
      "The page should point to practical story hooks, not just lore flavor.",
    ],
    related: ["potion-of-healing", "immovable-rod", "fighter-field-guide"],
  },
  {
    slug: "halfling-luck",
    title: "Halfling Luck",
    summary: "A page about small size, big nerve, and why the table loves a good escape.",
    category: "Races",
    author: "mira",
    updatedAt: "2026-06-09T10:00:00.000Z",
    viewCount: 77,
    lead:
      "Halflings are strongest when the writeup explains how optimism becomes a real survival tool.",
    facts: [
      ["Theme", "Luck, hospitality, and a quiet refusal to panic"],
      ["Best at", "Characters who survive trouble by refusing to be impressed by it"],
      ["Story hook", "A traveler, cook, courier, or gambler with a home they miss"],
      ["Watch for", "Treating the species as a joke instead of a culture"],
    ],
    useWhen: [
      "You want a cheerful character with real backbone.",
      "The campaign needs a grounded point of view in a world full of monsters.",
    ],
    watchFor: [
      "The page should give players a reason to care about the community, not just the trait.",
      "Small size can be a story feature, not just a combat note.",
    ],
    related: ["rogue-side-door", "potion-of-healing", "waterdeep-notes"],
  },
  {
    slug: "magic-missile",
    title: "Magic Missile",
    summary: "The reliable spell you prepare when certainty matters more than spectacle.",
    category: "Spells",
    author: "elowen",
    updatedAt: "2026-06-19T09:15:00.000Z",
    viewCount: 144,
    lead:
      "A spell page should say what the spell wins, what it costs, and why someone would reach for it twice in a row.",
    facts: [
      ["Level", "1st"],
      ["School", "Evocation"],
      ["Casting time", "1 action"],
      ["Best use", "Guaranteed damage and pressure on low-AC targets"],
    ],
    useWhen: [
      "You need a spell that simply does the thing every time.",
      "The fight rewards finishing a wounded enemy instead of gambling on a miss.",
    ],
    watchFor: [
      "It is not flashy, but that is the point.",
      "The page should explain why dependable damage still matters in a crowded spell list.",
    ],
    related: ["battle-mage-wizard", "shield", "goblin-ambush-guide"],
  },
  {
    slug: "shield",
    title: "Shield",
    summary: "A reaction spell that teaches players the value of not getting hit.",
    category: "Spells",
    author: "ammad",
    updatedAt: "2026-06-18T09:15:00.000Z",
    viewCount: 138,
    lead:
      "Some spells need no clever prose; they just need the page to say exactly how much trouble they erase.",
    facts: [
      ["Level", "1st"],
      ["School", "Abjuration"],
      ["Casting time", "Reaction"],
      ["Best use", "Turning a near miss into a clean defense"],
    ],
    useWhen: [
      "You want to make a fragile character feel much safer for one round.",
      "The table sees a lot of attack rolls and close calls.",
    ],
    watchFor: [
      "A good page should explain why the reaction economy matters.",
      "Do not bury the exact timing behind flavor text.",
    ],
    related: ["battle-mage-wizard", "cleric-table-prayer", "immovable-rod"],
  },
  {
    slug: "healing-word",
    title: "Healing Word",
    summary: "The emergency heal you keep around because standing people up is sometimes the whole job.",
    category: "Spells",
    author: "mira",
    updatedAt: "2026-06-14T13:05:00.000Z",
    viewCount: 131,
    lead:
      "Healing pages should be honest about action economy: sometimes one bonus action is the difference between losing a turn and keeping the fight alive.",
    facts: [
      ["Level", "1st"],
      ["School", "Evocation"],
      ["Casting time", "Bonus action"],
      ["Best use", "Bringing a downed ally back into the scene"],
    ],
    useWhen: [
      "You need recovery that does not eat the whole round.",
      "The party expects a support player to keep people standing without slowing the fight down.",
    ],
    watchFor: [
      "Healing is not the same as winning, so say when this spell is enough and when it is not.",
      "The page should include the practical reason it gets prepared so often.",
    ],
    related: ["cleric-table-prayer", "potion-of-healing", "lost-mine-primer"],
  },
  {
    slug: "hold-person",
    title: "Hold Person",
    summary: "A control spell that pays off when the table likes clean advantage and a sharp follow-up.",
    category: "Spells",
    author: "elowen",
    updatedAt: "2026-06-13T08:05:00.000Z",
    viewCount: 117,
    lead:
      "Control spells need a page that explains not just what they disable, but how they change the rest of the round.",
    facts: [
      ["Level", "2nd"],
      ["School", "Enchantment"],
      ["Casting time", "1 action"],
      ["Best use", "Locking down a humanoid target for a focused takedown"],
    ],
    useWhen: [
      "You expect humanoid enemies and want a clean setup spell.",
      "The party can follow up quickly with melee pressure or a save-based combo.",
    ],
    watchFor: [
      "The spell is narrow, so the page should say that plainly.",
      "A control spell gets better when the notes explain the team plan around it.",
    ],
    related: ["battle-mage-wizard", "rogue-side-door", "waterdeep-notes"],
  },
  {
    slug: "goblin-ambush-guide",
    title: "Goblin Ambush Guide",
    summary: "A small monster page that shows why weak enemies still make a fight interesting.",
    category: "Monsters",
    author: "torren",
    updatedAt: "2026-06-19T13:40:00.000Z",
    viewCount: 140,
    lead:
      "A monster writeup works best when it says how the creature behaves, not just what its stat block contains.",
    facts: [
      ["Threat", "Low to moderate in groups"],
      ["Role", "Ambusher, blocker, and annoyance piece"],
      ["Terrain", "Roads, ruins, camps, and narrow passes"],
      ["Best use", "Teaching players to respect positioning"],
    ],
    useWhen: [
      "You need enemies that reward scouting and formation.",
      "The fight should feel messy without becoming lethal by accident.",
    ],
    watchFor: [
      "A goblin page should call out how quickly the encounter swings when surprise lands.",
      "Never write tiny enemies as if they are all identical copies.",
    ],
    related: ["lost-mine-primer", "rogue-side-door", "fighter-field-guide"],
  },
  {
    slug: "owlbear-forest-brawl",
    title: "Owlbear Forest Brawl",
    summary: "A bruiser page for the creature that teaches players what a real predator feels like.",
    category: "Monsters",
    author: "mira",
    updatedAt: "2026-06-17T14:00:00.000Z",
    viewCount: 121,
    lead:
      "A good bestiary entry explains what the monster does in a room, in a chase, and in a story arc.",
    facts: [
      ["Threat", "Moderate as a solo bruiser"],
      ["Role", "Pressure, burst damage, and territorial aggression"],
      ["Terrain", "Forest edges, caves, and abandoned camps"],
      ["Best use", "A fight that feels feral rather than tactical"],
    ],
    useWhen: [
      "You want a fight that is easy to describe and hard to ignore.",
      "The scene needs a creature that feels like it belongs in the wild.",
    ],
    watchFor: [
      "This page should say that the owlbear is dangerous because it is relentless.",
      "The encounter works best when the environment matters a lot.",
    ],
    related: ["feywild-map-legend", "shield", "potion-of-healing"],
  },
  {
    slug: "mimic-treasure-trap",
    title: "Mimic Treasure Trap",
    summary: "The page every paranoid dungeon crawler secretly wants to read.",
    category: "Monsters",
    author: "ammad",
    updatedAt: "2026-06-16T15:25:00.000Z",
    viewCount: 114,
    lead:
      "The Mimic is a good test of whether the page can make caution feel fun instead of mean.",
    facts: [
      ["Threat", "Trickery first, damage second"],
      ["Role", "Ambush, surprise, and punishment for careless looting"],
      ["Terrain", "Treasuries, taverns, and suspiciously perfect furniture"],
      ["Best use", "A small scare that sticks in memory"],
    ],
    useWhen: [
      "You want a monster that rewards curiosity and table jokes at the same time.",
      "The dungeon needs one room that nobody trusts on sight.",
    ],
    watchFor: [
      "A mimic page should make the joke part of the ecology, not the whole entry.",
      "Do not overuse it or the trick loses its edge.",
    ],
    related: ["goblin-ambush-guide", "immovable-rod", "waterdeep-notes"],
  },
  {
    slug: "lich-endgame",
    title: "Lich Endgame",
    summary: "A high-level villain page that earns its menace with intent, not just hit points.",
    category: "Monsters",
    author: "elowen",
    updatedAt: "2026-06-11T09:50:00.000Z",
    viewCount: 109,
    lead:
      "The best boss pages explain the threat in story terms and in tactical terms, because a lich is both.",
    facts: [
      ["Threat", "Campaign-ending if handled badly"],
      ["Role", "Mastermind, spellcaster, and long-term antagonist"],
      ["Terrain", "Vaults, towers, tombs, and prepared sanctums"],
      ["Best use", "A villain who shapes the whole campaign"],
    ],
    useWhen: [
      "You need an endgame villain with layers of planning behind them.",
      "The story benefits from a foe who can recur without feeling repetitive.",
    ],
    watchFor: [
      "The page should explain that the fight is often not just a fight.",
      "Preparation and the lair matter as much as the stat block.",
    ],
    related: ["feywild-map-legend", "shadow-lair", "hold-person"],
  },
  {
    slug: "potion-of-healing",
    title: "Potion of Healing",
    summary: "The cleanest item entry in the book: simple, useful, and always welcome.",
    category: "Items",
    author: "torren",
    updatedAt: "2026-06-19T11:20:00.000Z",
    viewCount: 149,
    lead:
      "Item pages work when they say why the object matters in play and how often players actually reach for it.",
    facts: [
      ["Rarity", "Common"],
      ["Attunement", "None"],
      ["Best fit", "Emergency recovery and cheap table insurance"],
      ["Story hook", "A baseline potion that is only boring until someone needs it"],
    ],
    useWhen: [
      "The party needs a low-drama recovery item that everyone understands immediately.",
      "You want the item page to read like a real table tool, not a lore ornament.",
    ],
    watchFor: [
      "The page should explain that common does not mean irrelevant.",
      "Link it to support classes and downtime supply lists.",
    ],
    related: ["healing-word", "cleric-table-prayer", "dwarf-shield-wall"],
  },
  {
    slug: "bag-of-holding",
    title: "Bag of Holding",
    summary: "A relic of convenience that becomes more interesting the moment a campaign gets crowded.",
    category: "Items",
    author: "mira",
    updatedAt: "2026-06-18T11:20:00.000Z",
    viewCount: 136,
    lead:
      "The best gear pages explain how the item changes the group's habits, not only the stat line.",
    facts: [
      ["Rarity", "Uncommon"],
      ["Attunement", "None"],
      ["Best fit", "Travel-heavy parties and messy loot tables"],
      ["Story hook", "A pocket of impossible space that becomes a running joke or a serious problem"],
    ],
    useWhen: [
      "You need a logistics item that players will remember for years.",
      "The party keeps collecting props, maps, and treasure with nowhere to put them.",
    ],
    watchFor: [
      "The item page should mention pressure, weight, and how it changes problem-solving.",
      "A bag of holding is a convenience tool and a plot hook at the same time.",
    ],
    related: ["immovable-rod", "waterdeep-notes", "lost-mine-primer"],
  },
  {
    slug: "plus-one-weapon",
    title: "Plus One Weapon",
    summary: "A straightforward gear note for the item that quietly lifts a whole adventuring loop.",
    category: "Items",
    author: "ammad",
    updatedAt: "2026-06-13T12:50:00.000Z",
    viewCount: 101,
    lead:
      "Some items matter because they are exciting. Others matter because they keep the math of the game moving cleanly.",
    facts: [
      ["Rarity", "Uncommon"],
      ["Attunement", "Usually none"],
      ["Best fit", "Martial characters who need a reliable bump"],
      ["Story hook", "A weapon with a maker, a war, or a family story behind it"],
    ],
    useWhen: [
      "You want a magic item that is simple to hand out and easy to track.",
      "The campaign has enough combat to make a small bonus feel real.",
    ],
    watchFor: [
      "The page should not oversell the item; the value is consistency.",
      "Use the entry to connect the weapon to the world that made it.",
    ],
    related: ["fighter-field-guide", "rogue-side-door", "dwarf-shield-wall"],
  },
  {
    slug: "immovable-rod",
    title: "Immovable Rod",
    summary: "A strange tool item that turns every table into a place for clever nonsense.",
    category: "Items",
    author: "elowen",
    updatedAt: "2026-06-12T16:10:00.000Z",
    viewCount: 112,
    lead:
      "The best weird item pages tell the reader what kind of chaos the item unlocks and where the rules get interesting.",
    facts: [
      ["Rarity", "Uncommon"],
      ["Attunement", "None"],
      ["Best fit", "Traps, improvised climbs, and absurd problem solving"],
      ["Story hook", "A relic from builders who valued stability as a miracle"],
    ],
    useWhen: [
      "You want one item that always creates a story.",
      "The campaign rewards players who think laterally under pressure.",
    ],
    watchFor: [
      "The page should explain why the item is funny without reducing it to a gimmick.",
      "Readers need a clear sense of what it can and cannot anchor.",
    ],
    related: ["mimic-treasure-trap", "bag-of-holding", "fighter-field-guide"],
  },
  {
    slug: "lost-mine-primer",
    title: "Lost Mine of Phandelver Primer",
    summary: "A starter campaign note that reads like a useful table handout, not a placeholder.",
    category: "Campaigns",
    author: "mira",
    updatedAt: "2026-06-19T08:10:00.000Z",
    viewCount: 124,
    lead:
      "Campaign pages should help a group get from idea to session one without forcing them to hunt for the important pieces.",
    facts: [
      ["Tone", "Classic frontier adventure"],
      ["Starting hook", "A missing shipment, a dangerous road, and a small town with too much to lose"],
      ["Best for", "Groups that like simple quests and a steady reveal"],
      ["Watch for", "Letting the early intrigue fade before the party reaches the mine"],
    ],
    useWhen: [
      "You need a published adventure that teaches the cadence of a longer campaign.",
      "The table wants a clear starting town and obvious next steps.",
    ],
    watchFor: [
      "The page should tell DMs what to prep before the first session.",
      "Keep the recap section practical, not just descriptive.",
    ],
    related: ["goblin-ambush-guide", "waterdeep-notes", "potion-of-healing"],
  },
  {
    slug: "curse-of-strahd-notes",
    title: "Curse of Strahd Notes",
    summary: "A gothic campaign page that understands atmosphere only works when it still gives the DM a job.",
    category: "Campaigns",
    author: "elowen",
    updatedAt: "2026-06-17T09:00:00.000Z",
    viewCount: 118,
    lead:
      "The strongest adventure pages explain the tone, the pressure points, and the practical prep that keeps the story moving.",
    facts: [
      ["Tone", "Gothic horror and constant unease"],
      ["Starting hook", "A land that feels watched before the party knows why"],
      ["Best for", "Tables that like mood, choice, and recurring threat"],
      ["Watch for", "Too much mystery without enough actionable direction"],
    ],
    useWhen: [
      "You want a campaign where the setting itself behaves like an antagonist.",
      "The table enjoys horror, tragedy, and social pressure.",
    ],
    watchFor: [
      "The page should call out where the DM needs to keep momentum on rails and where they should not.",
      "The gothic mood should not hide the actual play advice.",
    ],
    related: ["lich-endgame", "shadow-lair", "feywild-map-legend"],
  },
  {
    slug: "waterdeep-notes",
    title: "Waterdeep: Dragon Heist Notes",
    summary: "Urban campaign notes for the rare adventure that works because the city is the adventure.",
    category: "Campaigns",
    author: "ammad",
    updatedAt: "2026-06-15T08:30:00.000Z",
    viewCount: 110,
    lead:
      "An urban campaign page should make the city feel navigable, busy, and useful the moment the players arrive.",
    facts: [
      ["Tone", "City intrigue, faction play, and buried treasure"],
      ["Starting hook", "A city-sized chase with too many people invested in the answer"],
      ["Best for", "Groups that like alliances, neighborhoods, and shifting goals"],
      ["Watch for", "Forgetting that city travel still needs clear scenes"],
    ],
    useWhen: [
      "You want a campaign where politics and street-level choices matter.",
      "The table likes named places, recurring NPCs, and faction pressure.",
    ],
    watchFor: [
      "The page should point DMs to the locations players will actually return to.",
      "Keep the city notes in a form that can be searched fast at the table.",
    ],
    related: ["bag-of-holding", "halfling-luck", "hold-person"],
  },
  {
    slug: "dragon-of-icespire-peak-notes",
    title: "Dragon of Icespire Peak Notes",
    summary: "A frontier campaign page built around short quests, clear pacing, and simple prep.",
    category: "Campaigns",
    author: "torren",
    updatedAt: "2026-06-14T08:30:00.000Z",
    viewCount: 104,
    lead:
      "A good starter campaign page makes the table feel brave without pretending prep is optional.",
    facts: [
      ["Tone", "Frontier problem-solving and escalating danger"],
      ["Starting hook", "A simple contract that opens into a larger threat"],
      ["Best for", "New players, new DMs, and groups that like modular sessions"],
      ["Watch for", "Underexplaining how one quest leads to the next"],
    ],
    useWhen: [
      "You want a campaign that can breathe between one-shots.",
      "The table prefers clear hooks over dense lore.",
    ],
    watchFor: [
      "The page should tell DMs which pieces matter if they only have one evening to prep.",
      "Keep the adventure notes practical and linked to the map of the region.",
    ],
    related: ["goblin-ambush-guide", "fighter-field-guide", "potion-of-healing"],
  },
  {
    slug: "feywild-map-legend",
    title: "Feywild Map Legend",
    summary: "A lore page for the place where beauty, danger, and memory all bend at the same time.",
    category: "Lore",
    author: "mira",
    updatedAt: "2026-06-18T07:30:00.000Z",
    viewCount: 93,
    lead:
      "Lore pages get stronger when they explain what the setting changes at the table and why that matters to a reader who is planning a session.",
    facts: [
      ["Scope", "A dreamlike reflection of the world"],
      ["Why it matters", "It changes travel, time, bargains, and consequences"],
      ["Best at", "Surprising players without breaking the story's logic"],
      ["Watch for", "Making whimsy so broad that it stops being usable"],
    ],
    useWhen: [
      "The campaign needs a place where normal rules feel bent but not broken.",
      "You want a lore page that points to adventure hooks instead of only description.",
    ],
    watchFor: [
      "The page should mention what mortal characters notice first.",
      "Link the setting to specific monsters, spells, and campaign scenes.",
    ],
    related: ["owlbear-forest-brawl", "battle-mage-wizard", "shadow-lair"],
  },
  {
    slug: "shadow-lair",
    title: "Shadow Lair",
    summary: "A darker lore note about the places that feel wrong before anyone sees the source of the problem.",
    category: "Lore",
    author: "elowen",
    updatedAt: "2026-06-16T07:55:00.000Z",
    viewCount: 89,
    lead:
      "A lore page should help DMs decide how the world changes when the players step into a place that resists the light.",
    facts: [
      ["Scope", "Underground routes, ruined sanctums, and forgotten power"],
      ["Why it matters", "It gives monsters and villains a home with rules"],
      ["Best at", "Building tension before the first die roll"],
      ["Watch for", "Confusing darkness with useful atmosphere"],
    ],
    useWhen: [
      "You need a setting detail that can support horror or intrigue.",
      "The campaign benefits from a place that feels older than the current plot.",
    ],
    watchFor: [
      "Give the reader a path through the location, not only mood words.",
      "Make the dangers specific enough to prep for.",
    ],
    related: ["lich-endgame", "curse-of-strahd-notes", "goblin-ambush-guide"],
  },
  {
    slug: "lost-kingdom-atlas",
    title: "Lost Kingdom Atlas",
    summary: "A lore page for fallen realms, broken oaths, and the reasons ruins still matter.",
    category: "Lore",
    author: "ammad",
    updatedAt: "2026-06-12T07:55:00.000Z",
    viewCount: 82,
    lead:
      "The best setting histories are useful because they hand the DM a few strong facts and then get out of the way.",
    facts: [
      ["Scope", "A vanished realm with traces still in the map"],
      ["Why it matters", "Old decisions keep shaping current politics and treasure hunts"],
      ["Best at", "Giving ruins a reason to exist beyond decoration"],
      ["Watch for", "Making the fall so old that nobody cares anymore"],
    ],
    useWhen: [
      "You want a lore page that can feed multiple adventures.",
      "The campaign needs a historical anchor for one region or faction.",
    ],
    watchFor: [
      "State the current consequence clearly or the history will feel decorative.",
      "Tie the kingdom to a real location, not just a mood.",
    ],
    related: ["waterdeep-notes", "dragon-of-icespire-peak-notes", "immovable-rod"],
  },
  {
    slug: "homebrew-rest-rule",
    title: "Homebrew Rest Rule",
    summary: "A house-rule page about changing the pace of a campaign without breaking the whole game.",
    category: "Homebrew",
    author: "torren",
    updatedAt: "2026-06-19T07:20:00.000Z",
    viewCount: 79,
    lead:
      "Homebrew pages need to say what problem they solve, what they cost, and how the table can tell if the change is working.",
    facts: [
      ["Goal", "Shift pacing without adding more bookkeeping"],
      ["Balance risk", "Short-rest and long-rest classes can drift apart"],
      ["Best use", "A campaign that wants fewer dead air moments between scenes"],
      ["Watch for", "Turning a cleanup fix into a new source of confusion"],
    ],
    useWhen: [
      "The table wants a different recovery rhythm from the default rules.",
      "You need the rule to be readable in one sitting and easy to revisit later.",
    ],
    watchFor: [
      "Write the consequence of the change right in the page.",
      "If it affects class balance, say which classes feel it most.",
    ],
    related: ["cleric-table-prayer", "fighter-field-guide", "battle-mage-wizard"],
  },
  {
    slug: "homebrew-sanity-track",
    title: "Homebrew Sanity Track",
    summary: "A playtest page for horror campaigns that need a careful, visible pressure gauge.",
    category: "Homebrew",
    author: "mira",
    updatedAt: "2026-06-17T07:20:00.000Z",
    viewCount: 75,
    lead:
      "The best homebrew writeups sound like someone actually tested the rule at the table and learned what it changes.",
    facts: [
      ["Goal", "Track fear or strain in a way players can see"],
      ["Balance risk", "Too much bookkeeping can slow the story down"],
      ["Best use", "Horror, weird magic, and high-pressure scenes"],
      ["Watch for", "Using the track as punishment instead of story texture"],
    ],
    useWhen: [
      "You want horror to have mechanical weight.",
      "The table is willing to track one extra number if it supports the tone.",
    ],
    watchFor: [
      "A homebrew page should say where the mechanic stops helping.",
      "The feedback section matters just as much as the first draft of the rule.",
    ],
    related: ["curse-of-strahd-notes", "shadow-lair", "lich-endgame"],
  },
  {
    slug: "homebrew-bloodline-spell",
    title: "Homebrew Bloodline Spell",
    summary: "A specific spell concept that needs careful wording and a very honest balance note.",
    category: "Homebrew",
    author: "elowen",
    updatedAt: "2026-06-15T07:20:00.000Z",
    viewCount: 71,
    lead:
      "Homebrew spells are most useful when the page makes the tradeoff obvious and the intended playstyle easy to see.",
    facts: [
      ["Goal", "Give a character theme-focused magic"],
      ["Balance risk", "Burst damage or free utility can outpace existing spells fast"],
      ["Best use", "A personal spell list with a strong narrative hook"],
      ["Watch for", "Writing a cool idea that would never survive a real session"],
    ],
    useWhen: [
      "You want a spell tied to a lineage, patron, or personal story.",
      "The campaign values custom content with a visible playtest history.",
    ],
    watchFor: [
      "Put the actual limits in the front half of the page.",
      "Show the test result, not just the concept pitch.",
    ],
    related: ["magic-missile", "hold-person", "battle-mage-wizard"],
  },
  {
    slug: "homebrew-downtime-craft",
    title: "Homebrew Downtime Craft",
    summary: "A house rule for giving crafting enough structure to be useful without taking over the game.",
    category: "Homebrew",
    author: "ammad",
    updatedAt: "2026-06-11T07:20:00.000Z",
    viewCount: 68,
    lead:
      "Downtime rules work best when the page keeps the process light, the inputs clear, and the reward useful.",
    facts: [
      ["Goal", "Make downtime feel productive"],
      ["Balance risk", "Too much detail can turn crafting into a second inventory game"],
      ["Best use", "Campaigns that pause between big quest arcs"],
      ["Watch for", "Overwriting the DM's ability to improvise"],
    ],
    useWhen: [
      "Players enjoy gathering materials and building things between adventures.",
      "The campaign has time skips, town phases, or long rests between missions.",
    ],
    watchFor: [
      "A good downtime page includes clear costs and deadlines.",
      "The rule should be easy to scan in the middle of a session.",
    ],
    related: ["bag-of-holding", "potion-of-healing", "dwarf-shield-wall"],
  },
];

function buildContent(spec: SeedPageSpec) {
  const factsTable = [
    "| Field | Detail |",
    "| --- | --- |",
    ...spec.facts.map(([field, detail]) => `| ${field} | ${detail} |`),
  ].join("\n");

  return [
    `# ${spec.title}`,
    "",
    spec.lead,
    "",
    "## Quick facts",
    "",
    factsTable,
    "",
    "## When to use this page",
    "",
    ...spec.useWhen.map((line) => `- ${line}`),
    "",
    "## Watch for",
    "",
    ...spec.watchFor.map((line) => `- ${line}`),
    "",
    "## Related entries",
    "",
    ...spec.related.map((line) => `- ${line}`),
  ].join("\n");
}

function toSeedPage(spec: SeedPageSpec): SeedPage {
  const author = AUTHORS[spec.author];
  return {
    ...spec,
    id: `seed:${spec.slug}`,
    content: buildContent(spec),
    created_at: spec.updatedAt,
    updated_at: spec.updatedAt,
    view_count: spec.viewCount,
    creator_id: author.username,
    profiles: author,
  };
}

export const SEED_PAGES = PAGE_SPECS.map(toSeedPage);

export function getSeedPages() {
  return SEED_PAGES.slice();
}

export function getSeedPageBySlug(slug: string) {
  return SEED_PAGES.find((page) => page.slug === slug) ?? null;
}

export function getSeedPagesByCategory(category: Category) {
  return SEED_PAGES.filter((page) => page.category === category);
}

export function searchSeedPages({
  term,
  category,
}: {
  term?: string;
  category?: Category;
}) {
  const normalized = term?.trim().toLowerCase() ?? "";
  return SEED_PAGES.filter((page) => {
    if (category && page.category !== category) return false;
    if (!normalized) return true;
    return [page.title, page.summary, page.content].some((value) =>
      value.toLowerCase().includes(normalized),
    );
  });
}

export function getSeedContributors() {
  const byAuthor = new Map<
    string,
    {
      username: string;
      display_name: string;
      avatar_url: string | null;
      bio: string;
      edit_count: number;
      pages_created: number;
    }
  >();

  for (const page of SEED_PAGES) {
    const author = page.profiles;
    const current = byAuthor.get(author.username) ?? {
      username: author.username,
      display_name: author.display_name,
      avatar_url: author.avatar_url,
      bio: author.bio,
      edit_count: 0,
      pages_created: 0,
    };
    current.pages_created += 1;
    current.edit_count += 3;
    byAuthor.set(author.username, current);
  }

  return Array.from(byAuthor.values()).sort((a, b) => b.edit_count - a.edit_count);
}

export function getSeedStats() {
  const contributors = getSeedContributors();
  return {
    pages: SEED_PAGES.length,
    edits: SEED_PAGES.length * 3,
    people: contributors.length,
  };
}

export function mergeBySlug<T extends { slug: string }>(primary: T[], fallback: T[]) {
  const seen = new Set<string>();
  const merged: T[] = [];
  for (const row of [...primary, ...fallback]) {
    if (seen.has(row.slug)) continue;
    seen.add(row.slug);
    merged.push(row);
  }
  return merged;
}

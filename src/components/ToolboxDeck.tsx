import { useState } from "preact/hooks";
import { lootTable, nameTable, npcTable } from "@/data/generators";

function pickOne<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildNpc() {
  return {
    role: pickOne(npcTable.roles),
    disposition: pickOne(npcTable.dispositions),
    tell: pickOne(npcTable.tells),
    want: pickOne(npcTable.wants),
  };
}

function buildLoot() {
  return {
    item: pickOne(lootTable.items),
    twist: pickOne(lootTable.twists),
    mood: pickOne(lootTable.moods),
  };
}

function buildName() {
  return `${pickOne(nameTable.first)} ${pickOne(nameTable.middle)} ${pickOne(nameTable.titles)}`;
}

export default function ToolboxDeck() {
  const [npc, setNpc] = useState(buildNpc);
  const [loot, setLoot] = useState(buildLoot);
  const [name, setName] = useState(buildName);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="panel p-5">
        <div className="kicker">NPC generator</div>
        <h3 className="mt-3 text-2xl text-[color:var(--color-ink)]">One useful stranger</h3>
        <div className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--color-ink-soft)]">
          <p><strong>Role:</strong> {npc.role}</p>
          <p><strong>Disposition:</strong> {npc.disposition}</p>
          <p><strong>Tell:</strong> {npc.tell}</p>
          <p><strong>Want:</strong> {npc.want}</p>
        </div>
        <button className="cta-primary mt-6 w-full" onClick={() => setNpc(buildNpc())} type="button">
          Roll another NPC
        </button>
      </section>

      <section className="panel p-5">
        <div className="kicker">Loot generator</div>
        <h3 className="mt-3 text-2xl text-[color:var(--color-ink)]">Treasure with a hook</h3>
        <div className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--color-ink-soft)]">
          <p><strong>Item:</strong> {loot.item}</p>
          <p><strong>Twist:</strong> {loot.twist}</p>
          <p><strong>Arrival:</strong> {loot.mood}</p>
        </div>
        <button className="cta-primary mt-6 w-full" onClick={() => setLoot(buildLoot())} type="button">
          Roll another reward
        </button>
      </section>

      <section className="panel p-5">
        <div className="kicker">Name generator</div>
        <h3 className="mt-3 text-2xl text-[color:var(--color-ink)]">A name worth keeping</h3>
        <p className="mt-5 rounded-2xl bg-[color:var(--color-paper-strong)] px-4 py-5 text-lg font-semibold text-[color:var(--color-clay)]">
          {name}
        </p>
        <p className="mt-4 text-sm leading-7 text-[color:var(--color-ink-soft)]">
          Use it for a patron, rival, innkeeper, courier, mercenary captain, or the person who walks into the room with the next problem.
        </p>
        <button className="cta-primary mt-6 w-full" onClick={() => setName(buildName())} type="button">
          Roll another name
        </button>
      </section>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import {
  BookOpenText,
  Gem,
  MapPinned,
  type LucideIcon,
  Skull,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-background/70">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-10 rounded-full border border-border/60" />
              <div>
                <div className="font-display text-lg font-bold">
                  Arcanum<span className="text-gold">Wiki</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                  community codex
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              A community-built codex for Dungeons & Dragons. Every page is written with context,
              credited to its author, and linked into the rest of the archive.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <FooterChip to="/wiki" label="Browse archive" icon={BookOpenText} />
              <FooterChip to="/campaigns" label="Campaign vault" icon={MapPinned} />
            </div>
          </div>

          <FooterColumn
            title="Explore"
            items={[
              { label: "Browse pages", to: "/wiki" },
              { label: "Class hub", to: "/dnd-classes" },
              { label: "Spell hub", to: "/dnd-spells" },
              { label: "Monster hub", to: "/dnd-monsters" },
              { label: "Item hub", to: "/dnd-items" },
            ]}
          />

          <FooterColumn
            title="Contribute"
            items={[
              { label: "Create a page", to: "/wiki/new" },
              { label: "Add campaign data", to: "/campaigns" },
              { label: "Sign in", to: "/auth" },
              { label: "About the project", to: "/about" },
            ]}
          />

          <div>
            <div className="mb-3 font-display text-gold">The pact</div>
            <p className="text-sm leading-7 text-muted-foreground">
              Every change is credited to its author. No gatekeepers, just a living archive of
              spells, monsters, classes, items, and campaign notes.
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-gold/20 bg-gold/5 p-4">
              <div className="text-xs uppercase tracking-[0.26em] text-gold">Featured hubs</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <FooterMiniLink to="/dnd-classes" icon={Sparkles} label="Classes" />
                <FooterMiniLink to="/dnd-spells" icon={WandSparkles} label="Spells" />
                <FooterMiniLink to="/dnd-monsters" icon={Skull} label="Monsters" />
                <FooterMiniLink to="/dnd-items" icon={Gem} label="Items" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>(c) {new Date().getFullYear()} ArcanumWiki - A fan-made D&D codex</span>
          <span>Not affiliated with Wizards of the Coast</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; to: string }>;
}) {
  return (
    <div>
      <div className="mb-3 font-display text-gold">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item.to}>
            <Link to={item.to as never} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterChip({ to, label, icon: Icon }: { to: string; label: string; icon: LucideIcon }) {
  return (
    <Link
      to={to as never}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm transition-colors hover:border-gold/60 hover:text-gold"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}

function FooterMiniLink({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      to={to as never}
      className="inline-flex items-center gap-1.5 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-gold/60 hover:text-gold"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}

import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function HubShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <section className="paper-surface relative overflow-hidden rounded-[2rem] border border-border p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-[-6rem] top-[-6rem] h-80 w-80 rounded-full bg-arcane/20 blur-3xl" />
          <div className="absolute right-[-6rem] bottom-[-6rem] h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-gold">
            {eyebrow}
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{intro}</p>
        </div>
        {children}
      </section>
    </div>
  );
}

export function HubCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
      <Icon className="h-5 w-5 text-gold" />
      <div className="mt-3 font-display text-2xl">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

export function HubPillLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to as never}
      className="rounded-full border border-border bg-background/60 px-4 py-2 text-sm hover:border-gold/60 hover:text-gold"
    >
      {label}
    </Link>
  );
}

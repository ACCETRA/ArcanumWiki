import { createFileRoute, Link } from "@tanstack/react-router";
import type { ComponentType, ReactNode } from "react";
import {
  BookOpen,
  Mail,
  Sparkles,
  Users,
  Shield,
  History,
  GitBranch,
  HeartHandshake,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteUrl } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - ArcanumWiki" },
      {
        name: "description",
        content:
          "ArcanumWiki is a D&D community codex built by a college student who wanted to make something useful, readable, and alive.",
      },
      { property: "og:title", content: "About - ArcanumWiki" },
      {
        property: "og:description",
        content: "A community-built D&D wiki. Real pages, real credit, real campaign notes.",
      },
      { property: "og:url", content: siteUrl("/about") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/about") }],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <section className="paper-surface relative overflow-hidden rounded-[2rem] border border-border p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-[-8rem] top-[-6rem] h-96 w-96 rounded-full bg-arcane/20 blur-3xl" />
          <div className="absolute right-[-8rem] bottom-[-6rem] h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-[1.2rem] border border-border/70 bg-card/80 px-3 py-3">
              <BrandMark className="h-12 w-12 rounded-full border border-border/60" />
              <div>
                <div className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                  the maker's seal
                </div>
                <div className="font-display text-lg font-bold">
                  Arcanum<span className="text-gold">Wiki</span>
                </div>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gold">
              <BrandMark className="h-4 w-4" />
              About the project
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-6xl">
              I wanted a D&D site that felt like someone actually made it.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Not a dashboard. Not a product. A reference, built like the books, with names attached
              to the pages and campaign notes that live next to the wiki.
            </p>
          </div>

          <a
            href="mailto:ammadkiyani92@gmail.com"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            <Mail className="h-4 w-4" />
            Say something
          </a>
        </div>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Feature icon={<Users className="h-5 w-5 text-gold" />} title="Community first">
          Any signed-in player can write and edit pages. The archive grows with the people actually
          using it, not just whoever set it up.
        </Feature>
        <Feature icon={<History className="h-5 w-5 text-gold" />} title="Every edit has a name">
          Every change creates a revision tied to the editor. The history is public. The authorship
          is honest.
        </Feature>
        <Feature icon={<Shield className="h-5 w-5 text-gold" />} title="Creators stay in control">
          The person who wrote a page keeps the right to delete it. Everyone else can still improve
          it. That felt like the right balance.
        </Feature>
        <Feature icon={<GitBranch className="h-5 w-5 text-gold" />} title="One place for all of it">
          Wiki, campaign vault, contributor profiles, a marketplace, all in one system instead of
          five different tools cobbled together.
        </Feature>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="paper-surface rounded-[2rem] border border-border p-6 md:p-8">
          <div className="flex items-center gap-2 font-display text-3xl">
            <Sparkles className="h-5 w-5 text-gold" />
            The creator story
          </div>
          <div className="mt-4 space-y-4 leading-7 text-muted-foreground">
            <p>
              My name is Ammad. I'm a small-time college student. I play D&D, I love the books, and
              I couldn't find a community reference that felt like it was actually built by someone
              who cared, so I built one.
            </p>
            <p>
              This is not a startup. There's no team behind it. It's me, some coffee, a Supabase
              project, and way too many hours reading the Player's Handbook instead of studying.
            </p>
            <p>
              If you love the site, that genuinely means a lot. If you think something is wrong,
              broken, ugly, or just annoying, tell me that too. I meant it when I said I'd take
              blunt feedback as constructive criticism. I'll read it either way.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-5">
            <div className="font-display text-2xl">Want to reach out?</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Love it, hate it, have an idea, spotted a bug, hit{" "}
              <a className="text-gold hover:underline" href="mailto:ammadkiyani92@gmail.com">
                ammadkiyani92@gmail.com
              </a>
              . I actually read these.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card
            icon={BookOpen}
            title="What this is trying to be"
            body="A living D&D reference that reads like it was made by the community, not a content team. Pages with authors, campaigns with notes, contributors with credit."
          />
          <Card
            icon={HeartHandshake}
            title="How to help"
            body="Add pages, fix summaries, expand campaign logs. The more real the content, the more useful it is. You don't need permission to contribute, just sign in."
          />
          <Card
            icon={GitBranch}
            title="It's just me right now"
            body="The whole site was built by one person. If something feels rough, it might be. That's part of it. It gets better as more people use it and tell me what's wrong."
          />
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-border bg-card/70 p-6 md:p-8">
        <h2 className="font-display text-3xl">Ready to write?</h2>
        <p className="mt-2 text-muted-foreground">
          Sign in and add something. Browse the codex. Drag your campaign notes in. It's yours.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-gold-soft"
          >
            Sign in
          </Link>
          <Link
            to="/wiki"
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Browse the codex
          </Link>
          <Link
            to="/campaigns"
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Open campaign vault
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/60 p-5">
      <div className="flex items-center gap-2 font-display text-lg">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/60 p-5">
      <Icon className="h-5 w-5 text-gold" />
      <div className="mt-3 font-display text-2xl">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

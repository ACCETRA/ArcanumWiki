import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpenText,
  Gem,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Skull,
  Sparkles,
  User as UserIcon,
  WandSparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/BrandMark";

export function SiteHeader() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: "/wiki", search: { q: q.trim() } as never });
    setQ("");
    setMenuOpen(false);
  }

  const hubLinks = [
    { label: "Classes", to: "/dnd-classes", icon: WandSparkles },
    { label: "Spells", to: "/dnd-spells", icon: BookOpenText },
    { label: "Monsters", to: "/dnd-monsters", icon: Skull },
    { label: "Items", to: "/dnd-items", icon: Gem },
  ] as const;

  const mainLinks = (
    <>
      <NavLink to="/wiki">Browse</NavLink>
      <NavLink to="/campaigns">Campaigns</NavLink>
      <NavLink to="/resources">Resources</NavLink>
      <NavLink to="/contributors">Contributors</NavLink>
      <NavLink to="/about">About</NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/78 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center gap-4 py-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-full border border-border/70 bg-card/85 px-3 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.14)]"
          >
            <BrandMark className="h-9 w-9 rounded-full border border-border/60" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-wide">
                Arcanum<span className="text-gold">Wiki</span>
              </span>
              <span className="block text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                community codex
              </span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            {mainLinks}
          </nav>

          <form
            onSubmit={submitSearch}
            className="relative hidden lg:flex flex-1 max-w-lg rounded-full border border-border/70 bg-card/70 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the codex..."
              className="w-full rounded-full bg-transparent pl-9 pr-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/80"
            />
          </form>

          <div className="hidden 2xl:flex items-center gap-2">
            {hubLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to as never}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/wiki/new"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
                >
                  <PlusCircle className="h-4 w-4" /> New page
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-2 py-1 transition-colors hover:border-gold/60"
                    aria-label="User menu"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-6 w-6 rounded-full" />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-arcane to-gold text-xs font-bold text-primary-foreground">
                        {profile?.display_name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm">
                      {profile?.display_name ?? "..."}
                    </span>
                  </button>
                  {open && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
                      {profile && (
                        <Link
                          to="/u/$username"
                          params={{ username: profile.username }}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                        >
                          <UserIcon className="h-4 w-4" /> My profile
                        </Link>
                      )}
                      <Link
                        to="/settings"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                      >
                        <Sparkles className="h-4 w-4" /> Settings
                      </Link>
                      <button
                        onClick={() => {
                          setOpen(false);
                          signOut();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="rounded-full border border-gold/60 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
              >
                Sign in
              </Link>
            )}
            <button
              className="rounded-full border border-border bg-card p-2.5 transition-colors hover:border-gold/60 hover:text-gold xl:hidden"
              onClick={() => setMenuOpen((m) => !m)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 border-t border-border/40 py-3 text-sm">
          <span className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            Quick chapter links
          </span>
          <div className="flex flex-wrap gap-2">
            {hubLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to as never}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          <span className="ml-auto text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            Hand-built for D&D archives
          </span>
        </div>
      </div>

      {menuOpen && (
        <div className="xl:hidden border-t border-border bg-background/95 px-4 py-4">
          <div className="mx-auto max-w-7xl space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {hubLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to as never}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-3 py-2.5 text-sm transition-colors hover:border-gold/60 hover:text-gold"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground">
              {mainLinks}
            </nav>
            <form onSubmit={submitSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the codex..."
                className="w-full rounded-2xl border border-border bg-input/70 pl-9 pr-3 py-2.5 text-sm outline-none"
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to as never}
      className="rounded-full px-3 py-2 transition-colors hover:bg-card/60 hover:text-gold"
    >
      {children}
    </Link>
  );
}

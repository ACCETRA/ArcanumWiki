import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { CATEGORIES, slugify } from "./categories";

const CategoryEnum = z.enum(CATEGORIES);

export const createPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) =>
    z
      .object({
        title: z.string().min(2).max(120),
        summary: z.string().max(280).default(""),
        category: CategoryEnum,
        content: z.string().max(100_000).default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const baseSlug = slugify(data.title) || "page";
    let slug = baseSlug;
    let n = 0;
    // ensure unique slug
    while (true) {
      const { data: existing } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!existing) break;
      n += 1;
      slug = `${baseSlug}-${n}`;
    }

    const { data: page, error } = await supabase
      .from("pages")
      .insert({
        slug,
        title: data.title,
        summary: data.summary,
        category: data.category,
        content: data.content,
        creator_id: userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await supabase.from("revisions").insert({
      page_id: page.id,
      editor_id: userId,
      title: page.title,
      summary: page.summary,
      content: page.content,
      change_note: "Created page",
      char_delta: page.content.length,
    });

    return { slug: page.slug };
  });

export const savePageEdit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) =>
    z
      .object({
        slug: z.string().min(1),
        title: z.string().min(2).max(120),
        summary: z.string().max(280).default(""),
        category: CategoryEnum,
        content: z.string().max(100_000).default(""),
        change_note: z.string().max(200).default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: page, error: getErr } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", data.slug)
      .single();
    let pageId = page?.id;
    let previousLength = page?.content.length ?? 0;

    if (getErr || !page) {
      const { data: inserted, error: insertErr } = await supabase
        .from("pages")
        .insert({
          slug: data.slug,
          title: data.title,
          summary: data.summary,
          category: data.category,
          content: data.content,
          creator_id: userId,
        })
        .select("*")
        .single();
      if (insertErr || !inserted) throw new Error(insertErr?.message ?? "Page not found");
      pageId = inserted.id;
      previousLength = 0;
    } else {
      const { error: upErr } = await supabase
        .from("pages")
        .update({
          title: data.title,
          summary: data.summary,
          category: data.category,
          content: data.content,
        })
        .eq("id", page.id);
      if (upErr) throw new Error(upErr.message);
    }

    const delta = data.content.length - previousLength;

    const { error: revErr } = await supabase.from("revisions").insert({
      page_id: pageId!,
      editor_id: userId,
      title: data.title,
      summary: data.summary,
      content: data.content,
      change_note: data.change_note || "Updated page",
      char_delta: delta,
    });
    if (revErr) throw new Error(revErr.message);

    return { ok: true };
  });

export const deleteOwnPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: page } = await supabase
      .from("pages")
      .select("creator_id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!page) throw new Error("Page not found");
    if (page.creator_id !== userId) throw new Error("Only the page creator can delete");
    const { error } = await supabase.from("pages").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input) =>
    z
      .object({
        display_name: z.string().min(1).max(60),
        bio: z.string().max(500).default(""),
        avatar_url: z.string().url().optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: data.display_name,
        bio: data.bio,
        avatar_url: data.avatar_url || null,
      })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const incrementView = createServerFn({ method: "POST" })
  .validator((input) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    // Use admin client for the increment so anonymous reads can count.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: page } = await supabaseAdmin
      .from("pages")
      .select("id, view_count")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!page) return { ok: false };
    await supabaseAdmin
      .from("pages")
      .update({ view_count: page.view_count + 1 })
      .eq("id", page.id);
    return { ok: true };
  });

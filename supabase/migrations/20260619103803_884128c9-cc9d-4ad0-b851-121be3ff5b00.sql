
-- Lock down trigger function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- Recreate view with security_invoker so it respects the caller's RLS
DROP VIEW IF EXISTS public.contributor_stats;
CREATE VIEW public.contributor_stats
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.bio,
  p.created_at,
  COALESCE(rev.edit_count, 0) AS edit_count,
  COALESCE(pg.pages_created, 0) AS pages_created
FROM public.profiles p
LEFT JOIN (
  SELECT editor_id, COUNT(*) AS edit_count FROM public.revisions GROUP BY editor_id
) rev ON rev.editor_id = p.id
LEFT JOIN (
  SELECT creator_id, COUNT(*) AS pages_created FROM public.pages GROUP BY creator_id
) pg ON pg.creator_id = p.id;
GRANT SELECT ON public.contributor_stats TO anon, authenticated;

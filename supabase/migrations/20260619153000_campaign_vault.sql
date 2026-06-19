-- CAMPAIGNS
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  system TEXT NOT NULL DEFAULT 'D&D 5e',
  world_name TEXT NOT NULL DEFAULT '',
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT true,
  session_count INTEGER NOT NULL DEFAULT 0,
  last_recap TEXT NOT NULL DEFAULT '',
  last_recap_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX campaigns_updated_at_idx ON public.campaigns(updated_at DESC);
CREATE INDEX campaigns_created_by_idx ON public.campaigns(created_by);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT SELECT ON public.campaigns TO anon;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns_public_read" ON public.campaigns FOR SELECT USING (is_public OR auth.uid() = created_by);
CREATE POLICY "campaigns_insert_auth" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "campaigns_update_owner" ON public.campaigns FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "campaigns_delete_owner" ON public.campaigns FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION public.bump_campaign_recap_summary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.campaigns
  SET
    last_recap = NEW.recap,
    last_recap_at = NEW.created_at,
    session_count = GREATEST(session_count, NEW.session_number),
    updated_at = now()
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$;

-- CAMPAIGN MEMBERS
CREATE TABLE public.campaign_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'player',
  display_name TEXT NOT NULL DEFAULT '',
  character_name TEXT NOT NULL DEFAULT '',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, profile_id)
);
CREATE INDEX campaign_members_campaign_idx ON public.campaign_members(campaign_id);
CREATE INDEX campaign_members_profile_idx ON public.campaign_members(profile_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_members TO authenticated;
GRANT SELECT ON public.campaign_members TO anon;
GRANT ALL ON public.campaign_members TO service_role;
ALTER TABLE public.campaign_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_members_public_read" ON public.campaign_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_members_insert_auth" ON public.campaign_members FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_members_update_auth" ON public.campaign_members FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND c.created_by = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND c.created_by = auth.uid()
  )
);
CREATE POLICY "campaign_members_delete_auth" ON public.campaign_members FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND c.created_by = auth.uid()
  )
);

-- CHARACTERS
CREATE TABLE public.campaign_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  race TEXT NOT NULL DEFAULT '',
  class_name TEXT NOT NULL DEFAULT '',
  level INTEGER NOT NULL DEFAULT 1,
  background TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  portrait_url TEXT,
  sheet_url TEXT,
  sheet_file_path TEXT,
  sheet_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX campaign_characters_campaign_idx ON public.campaign_characters(campaign_id);
CREATE INDEX campaign_characters_profile_idx ON public.campaign_characters(profile_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_characters TO authenticated;
GRANT SELECT ON public.campaign_characters TO anon;
GRANT ALL ON public.campaign_characters TO service_role;
ALTER TABLE public.campaign_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_characters_public_read" ON public.campaign_characters FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_characters_insert_auth" ON public.campaign_characters FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_characters_update_auth" ON public.campaign_characters FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.created_by = auth.uid() OR profile_id = auth.uid())
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.created_by = auth.uid() OR profile_id = auth.uid())
  )
);
CREATE POLICY "campaign_characters_delete_auth" ON public.campaign_characters FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.created_by = auth.uid() OR profile_id = auth.uid())
  )
);
CREATE TRIGGER campaign_characters_touch_updated_at
BEFORE UPDATE ON public.campaign_characters
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ASSETS / MAPS / SHEETS
CREATE TABLE public.campaign_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL DEFAULT 'map',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX campaign_assets_campaign_idx ON public.campaign_assets(campaign_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_assets TO authenticated;
GRANT SELECT ON public.campaign_assets TO anon;
GRANT ALL ON public.campaign_assets TO service_role;
ALTER TABLE public.campaign_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_assets_public_read" ON public.campaign_assets FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_assets_insert_auth" ON public.campaign_assets FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = uploaded_by AND EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_assets_update_auth" ON public.campaign_assets FOR UPDATE TO authenticated USING (
  auth.uid() = uploaded_by
) WITH CHECK (
  auth.uid() = uploaded_by
);
CREATE POLICY "campaign_assets_delete_auth" ON public.campaign_assets FOR DELETE TO authenticated USING (
  auth.uid() = uploaded_by
);

-- RECAPS
CREATE TABLE public.campaign_recaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL DEFAULT 1,
  recap TEXT NOT NULL DEFAULT '',
  important_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX campaign_recaps_campaign_idx ON public.campaign_recaps(campaign_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.campaign_recaps TO authenticated;
GRANT SELECT ON public.campaign_recaps TO anon;
GRANT ALL ON public.campaign_recaps TO service_role;
ALTER TABLE public.campaign_recaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_recaps_public_read" ON public.campaign_recaps FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_recaps_insert_auth" ON public.campaign_recaps FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = created_by AND EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_recaps_delete_auth" ON public.campaign_recaps FOR DELETE TO authenticated USING (
  auth.uid() = created_by
);
CREATE TRIGGER campaign_recaps_bump_summary
AFTER INSERT ON public.campaign_recaps
FOR EACH ROW EXECUTE FUNCTION public.bump_campaign_recap_summary();

-- HOMEBREW SPELLS
CREATE TABLE public.campaign_homebrew_spells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT '',
  school TEXT NOT NULL DEFAULT '',
  casting_time TEXT NOT NULL DEFAULT '',
  range TEXT NOT NULL DEFAULT '',
  components TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX campaign_homebrew_spells_campaign_idx ON public.campaign_homebrew_spells(campaign_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_homebrew_spells TO authenticated;
GRANT SELECT ON public.campaign_homebrew_spells TO anon;
GRANT ALL ON public.campaign_homebrew_spells TO service_role;
ALTER TABLE public.campaign_homebrew_spells ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_homebrew_spells_public_read" ON public.campaign_homebrew_spells FOR SELECT USING (
  campaign_id IS NULL OR EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_homebrew_spells_insert_auth" ON public.campaign_homebrew_spells FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = created_by AND (campaign_id IS NULL OR EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  ))
);
CREATE POLICY "campaign_homebrew_spells_update_auth" ON public.campaign_homebrew_spells FOR UPDATE TO authenticated USING (
  auth.uid() = created_by
) WITH CHECK (
  auth.uid() = created_by
);
CREATE POLICY "campaign_homebrew_spells_delete_auth" ON public.campaign_homebrew_spells FOR DELETE TO authenticated USING (
  auth.uid() = created_by
);
CREATE TRIGGER campaign_homebrew_spells_touch_updated_at
BEFORE UPDATE ON public.campaign_homebrew_spells
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- GENERAL NOTES / IMPORTANT POINTS
CREATE TABLE public.campaign_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'note',
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX campaign_notes_campaign_idx ON public.campaign_notes(campaign_id, pinned DESC, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_notes TO authenticated;
GRANT SELECT ON public.campaign_notes TO anon;
GRANT ALL ON public.campaign_notes TO service_role;
ALTER TABLE public.campaign_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_notes_public_read" ON public.campaign_notes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_notes_insert_auth" ON public.campaign_notes FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = created_by AND EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = campaign_id AND (c.is_public OR c.created_by = auth.uid())
  )
);
CREATE POLICY "campaign_notes_update_auth" ON public.campaign_notes FOR UPDATE TO authenticated USING (
  auth.uid() = created_by
) WITH CHECK (
  auth.uid() = created_by
);
CREATE POLICY "campaign_notes_delete_auth" ON public.campaign_notes FOR DELETE TO authenticated USING (
  auth.uid() = created_by
);
CREATE TRIGGER campaign_notes_touch_updated_at
BEFORE UPDATE ON public.campaign_notes
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- STORAGE BUCKET FOR MAPS AND SHEETS
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-assets', 'campaign-assets', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  CREATE POLICY "campaign_assets_bucket_public_read" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'campaign-assets');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "campaign_assets_bucket_insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'campaign-assets' AND owner = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "campaign_assets_bucket_update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'campaign-assets' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'campaign-assets' AND owner = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "campaign_assets_bucket_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'campaign-assets' AND owner = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

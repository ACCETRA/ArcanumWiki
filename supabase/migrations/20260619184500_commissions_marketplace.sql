-- COMMISSION MARKETPLACE
CREATE TABLE public.commission_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_type TEXT NOT NULL DEFAULT 'art',
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  starting_price_usd INTEGER NOT NULL DEFAULT 0,
  turnaround_days INTEGER NOT NULL DEFAULT 7,
  portfolio_url TEXT NOT NULL DEFAULT '',
  contact_url TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT commission_listings_type_check CHECK (listing_type IN ('art', 'maps', 'both')),
  CONSTRAINT commission_listings_price_check CHECK (starting_price_usd >= 0),
  CONSTRAINT commission_listings_turnaround_check CHECK (turnaround_days > 0)
);
CREATE INDEX commission_listings_active_idx ON public.commission_listings(active, created_at DESC);
CREATE INDEX commission_listings_profile_idx ON public.commission_listings(profile_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commission_listings TO authenticated;
GRANT SELECT ON public.commission_listings TO anon;
GRANT ALL ON public.commission_listings TO service_role;
ALTER TABLE public.commission_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "commission_listings_public_read" ON public.commission_listings FOR SELECT USING (active);
CREATE POLICY "commission_listings_insert_own" ON public.commission_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "commission_listings_update_own" ON public.commission_listings FOR UPDATE TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "commission_listings_delete_own" ON public.commission_listings FOR DELETE TO authenticated USING (auth.uid() = profile_id);
CREATE TRIGGER commission_listings_touch_updated_at
BEFORE UPDATE ON public.commission_listings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.commission_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.commission_listings(id) ON DELETE SET NULL,
  commission_type TEXT NOT NULL DEFAULT 'art',
  title TEXT NOT NULL,
  brief TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  due_date DATE,
  contact_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT commission_requests_type_check CHECK (commission_type IN ('art', 'maps', 'both')),
  CONSTRAINT commission_requests_status_check CHECK (status IN ('open', 'quoted', 'accepted', 'in_progress', 'complete', 'cancelled')),
  CONSTRAINT commission_requests_budget_check CHECK (budget_min IS NULL OR budget_min >= 0),
  CONSTRAINT commission_requests_budget_order_check CHECK (budget_max IS NULL OR budget_min IS NULL OR budget_max >= budget_min)
);
CREATE INDEX commission_requests_status_idx ON public.commission_requests(status, created_at DESC);
CREATE INDEX commission_requests_requester_idx ON public.commission_requests(requester_id, created_at DESC);
CREATE INDEX commission_requests_listing_idx ON public.commission_requests(listing_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commission_requests TO authenticated;
GRANT SELECT ON public.commission_requests TO anon;
GRANT ALL ON public.commission_requests TO service_role;
ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "commission_requests_public_read" ON public.commission_requests FOR SELECT USING (true);
CREATE POLICY "commission_requests_insert_own" ON public.commission_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "commission_requests_update_own" ON public.commission_requests FOR UPDATE TO authenticated USING (auth.uid() = requester_id) WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "commission_requests_delete_own" ON public.commission_requests FOR DELETE TO authenticated USING (auth.uid() = requester_id);
CREATE TRIGGER commission_requests_touch_updated_at
BEFORE UPDATE ON public.commission_requests
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

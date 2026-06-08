
-- 1. Tighten event_registrations INSERT policy (was WITH CHECK true)
DROP POLICY IF EXISTS "public can register" ON public.event_registrations;

CREATE POLICY "public can register with validation"
ON public.event_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_id IS NOT NULL
  AND length(btrim(event_id)) BETWEEN 1 AND 120
  AND event_title IS NOT NULL
  AND length(btrim(event_title)) BETWEEN 1 AND 200
  AND full_name IS NOT NULL
  AND length(btrim(full_name)) BETWEEN 2 AND 120
  AND email IS NOT NULL
  AND length(email) BETWEEN 5 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 40)
  AND (city IS NULL OR length(city) <= 120)
  AND (church IS NULL OR length(church) <= 160)
  AND (message IS NULL OR length(message) <= 1000)
);

-- 2. Lock down user_roles writes to admins only (explicit, not implicit)
CREATE POLICY "admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

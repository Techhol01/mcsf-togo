create table if not exists public.reader_feedback (
  id uuid primary key default gen_random_uuid(),
  book_id text not null,
  book_title text not null,
  kind text not null check (kind in ('summary','question')),
  message text not null,
  user_name text,
  user_email text,
  created_at timestamptz not null default now()
);

grant insert on public.reader_feedback to anon, authenticated;
grant select, delete on public.reader_feedback to authenticated;
grant all on public.reader_feedback to service_role;

alter table public.reader_feedback enable row level security;

drop policy if exists "reader_feedback_insert_validated" on public.reader_feedback;
create policy "reader_feedback_insert_validated"
on public.reader_feedback
for insert
to anon, authenticated
with check (
  char_length(book_id) between 1 and 200
  and char_length(book_title) between 1 and 300
  and kind in ('summary','question')
  and char_length(message) between 5 and 4000
  and (user_name is null or char_length(user_name) <= 160)
  and (user_email is null or char_length(user_email) <= 255)
);

drop policy if exists "reader_feedback_admin_select" on public.reader_feedback;
create policy "reader_feedback_admin_select"
on public.reader_feedback
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "reader_feedback_admin_delete" on public.reader_feedback;
create policy "reader_feedback_admin_delete"
on public.reader_feedback
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));
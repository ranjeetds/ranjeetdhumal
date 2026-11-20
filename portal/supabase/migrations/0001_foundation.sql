-- Township portal schema. Run this in the Supabase SQL editor or as a migration.
-- It is separate from the public ranjeetdhumal.com site.
-- Reads are enforced with row level security. Writes go through the functions below.
-- Activity and audit rows cannot be updated or deleted.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.app_role as enum (
  'platform_admin',
  'committee_admin',
  'committee',
  'developer',
  'resident'
);

create type public.issue_status as enum (
  'draft',
  'submitted',
  'under_review',
  'assigned',
  'acknowledged',
  'in_progress',
  'awaiting_information',
  'awaiting_developer',
  'resolved',
  'closed',
  'reopened'
);

create type public.issue_priority as enum ('low', 'normal', 'high', 'urgent');

create type public.comment_visibility as enum ('resident', 'committee');

create type public.comment_kind as enum ('resident', 'committee', 'developer', 'system');

create type public.record_visibility as enum ('resident', 'committee', 'developer');

create type public.development_status as enum (
  'awaiting_confirmation',
  'not_started',
  'in_progress',
  'blocked',
  'completed'
);

create type public.information_source as enum (
  'awaiting_confirmation',
  'developer_provided',
  'committee_observation',
  'confirmed'
);

create type public.meeting_status as enum ('draft', 'approved', 'published');

create type public.action_status as enum ('open', 'done', 'cancelled');

create type public.announcement_priority as enum ('normal', 'important');

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role public.app_role not null default 'resident',
  plot text,
  phase text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.permissions (
  key text primary key,
  description text not null
);

create table public.role_permissions (
  role public.app_role not null,
  permission text not null references public.permissions (key) on delete cascade,
  primary key (role, permission)
);

create table public.user_permissions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  permission text not null references public.permissions (key) on delete cascade,
  allowed boolean not null,
  primary key (user_id, permission)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  role public.app_role not null,
  token text not null unique,
  expires_at timestamptz not null,
  invited_by uuid references public.profiles (id),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.auth_attempts (
  id bigint generated always as identity primary key,
  attempt_key text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index auth_attempts_lookup
  on public.auth_attempts (attempt_key, action, created_at desc);

create table public.notification_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  email_enabled boolean not null default true,
  comments boolean not null default true,
  status_changes boolean not null default true,
  announcements boolean not null default true,
  meetings boolean not null default true
);

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  prefix text not null unique,
  sort integer not null,
  archived boolean not null default false
);

create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id),
  name text not null,
  sort integer not null,
  archived boolean not null default false,
  unique (category_id, name)
);

create table public.issue_counters (
  prefix text primary key,
  next_value integer not null
);

-- ---------------------------------------------------------------------------
-- Issues
-- ---------------------------------------------------------------------------

create table public.issues (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text not null,
  category_id uuid not null references public.categories (id),
  subcategory_id uuid references public.subcategories (id),
  priority public.issue_priority not null default 'normal',
  status public.issue_status not null default 'submitted',
  resident_visible boolean not null default true,
  raised_by uuid not null references public.profiles (id),
  raiser_name text not null,
  assigned_team text,
  assigned_to uuid references public.profiles (id),
  assignee_name text,
  expected_on date,
  resolution_notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint issues_team_check check (
    assigned_team is null or assigned_team in ('committee', 'developer')
  )
);

create index issues_status_idx on public.issues (status);
create index issues_category_idx on public.issues (category_id);
create index issues_updated_idx on public.issues (updated_at desc);
create index issues_raised_idx on public.issues (raised_by);
create index issues_team_idx on public.issues (assigned_team);
create index issues_expected_idx on public.issues (expected_on);

create table public.status_transitions (
  from_status public.issue_status not null,
  to_status public.issue_status not null,
  permission text not null references public.permissions (key),
  primary key (from_status, to_status, permission)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues (id),
  parent_id uuid references public.comments (id),
  author_id uuid not null references public.profiles (id),
  author_name text not null,
  author_role public.app_role not null,
  kind public.comment_kind not null,
  visibility public.comment_visibility not null,
  official boolean not null default false,
  body text not null,
  created_at timestamptz not null default now()
);

create index comments_issue_idx on public.comments (issue_id, created_at);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues (id),
  actor_id uuid,
  actor_name text not null,
  kind text not null,
  summary text not null,
  from_value text,
  to_value text,
  visibility public.comment_visibility not null default 'resident',
  created_at timestamptz not null default now()
);

create index activity_issue_idx on public.activity_events (issue_id, created_at);

create table public.issue_follows (
  issue_id uuid not null references public.issues (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (issue_id, user_id)
);

create table public.issue_links (
  issue_id uuid not null references public.issues (id) on delete cascade,
  related_id uuid not null references public.issues (id) on delete cascade,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  primary key (issue_id, related_id),
  constraint issue_links_distinct check (issue_id <> related_id)
);

-- ---------------------------------------------------------------------------
-- Township development
-- ---------------------------------------------------------------------------

create table public.development_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null,
  status public.development_status not null default 'awaiting_confirmation',
  responsible_party text,
  information_source public.information_source not null default 'awaiting_confirmation',
  started_on date,
  expected_on date,
  sort integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.development_items (id) on delete cascade,
  name text not null,
  sort integer not null,
  status public.development_status not null default 'awaiting_confirmation',
  information_source public.information_source not null default 'awaiting_confirmation',
  expected_on date,
  completed_on date
);

create table public.development_updates (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.development_items (id) on delete cascade,
  milestone_id uuid references public.milestones (id) on delete set null,
  author_id uuid not null references public.profiles (id),
  author_name text not null,
  author_role public.app_role not null,
  source public.information_source not null,
  body text not null,
  status public.development_status,
  expected_on date,
  created_at timestamptz not null default now()
);

create index development_updates_item_idx
  on public.development_updates (item_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Discussions, meetings, documents, correspondence, announcements
-- ---------------------------------------------------------------------------

create table public.discussions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category_id uuid references public.categories (id),
  visibility public.comment_visibility not null default 'resident',
  pinned boolean not null default false,
  locked boolean not null default false,
  created_by uuid not null references public.profiles (id),
  author_name text not null,
  converted_issue_id uuid references public.issues (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.discussion_posts (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.discussions (id) on delete cascade,
  parent_id uuid references public.discussion_posts (id),
  author_id uuid not null references public.profiles (id),
  author_name text not null,
  author_role public.app_role not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index discussion_posts_idx
  on public.discussion_posts (discussion_id, created_at);

create table public.discussion_follows (
  discussion_id uuid not null references public.discussions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  primary key (discussion_id, user_id)
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  location text,
  link text,
  status public.meeting_status not null default 'draft',
  notes text not null default '',
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meeting_attendees (
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  attended boolean,
  primary key (meeting_id, user_id)
);

create table public.agenda_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  sort integer not null,
  body text not null
);

create table public.action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  body text not null,
  owner_id uuid references public.profiles (id),
  owner_name text,
  expected_on date,
  status public.action_status not null default 'open',
  issue_id uuid references public.issues (id)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  visibility public.record_visibility not null default 'resident',
  uploaded_by uuid not null references public.profiles (id),
  uploader_name text not null,
  issue_id uuid references public.issues (id),
  meeting_id uuid references public.meetings (id),
  discussion_id uuid references public.discussions (id),
  development_item_id uuid references public.development_items (id),
  created_at timestamptz not null default now(),
  constraint documents_category_check check (
    category in (
      'infrastructure',
      'approvals',
      'society',
      'maintenance',
      'meetings',
      'correspondence',
      'guidelines',
      'other'
    )
  )
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references public.issues (id) on delete cascade,
  comment_id uuid references public.comments (id) on delete cascade,
  document_id uuid references public.documents (id) on delete cascade,
  meeting_id uuid references public.meetings (id) on delete cascade,
  discussion_id uuid references public.discussions (id) on delete cascade,
  development_item_id uuid references public.development_items (id) on delete cascade,
  visibility public.record_visibility not null default 'resident',
  storage_path text not null unique,
  file_name text not null,
  content_type text not null,
  byte_size integer not null,
  uploaded_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.correspondence (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  sent_on date,
  sender text,
  recipient text,
  body text not null default '',
  response_received boolean not null default false,
  response_on date,
  response_body text not null default '',
  follow_up_status text not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint correspondence_follow_up_check check (
    follow_up_status in ('not_started', 'waiting', 'answered', 'closed')
  )
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author_id uuid not null references public.profiles (id),
  author_name text not null,
  priority public.announcement_priority not null default 'normal',
  visibility public.comment_visibility not null default 'resident',
  published_at timestamptz not null default now(),
  expires_on date,
  issue_id uuid references public.issues (id),
  created_at timestamptz not null default now()
);

create table public.announcement_acknowledgements (
  announcement_id uuid not null references public.announcements (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (announcement_id, user_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  href text,
  dedupe_key text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, dedupe_key)
);

create index notifications_user_idx
  on public.notifications (user_id, created_at desc);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_name text not null,
  action text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create index audit_events_created_idx on public.audit_events (created_at desc);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.reject_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'This record is part of the permanent history and cannot be changed.';
end;
$$;

create trigger activity_append_only
  before update or delete on public.activity_events
  for each row execute function public.reject_mutation();

create trigger audit_append_only
  before update or delete on public.audit_events
  for each row execute function public.reject_mutation();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger issues_touch before update on public.issues
  for each row execute function public.touch_updated_at();
create trigger discussions_touch before update on public.discussions
  for each row execute function public.touch_updated_at();
create trigger meetings_touch before update on public.meetings
  for each row execute function public.touch_updated_at();
create trigger development_touch before update on public.development_items
  for each row execute function public.touch_updated_at();
create trigger correspondence_touch before update on public.correspondence
  for each row execute function public.touch_updated_at();

create or replace function public.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active
  );
$$;

create or replace function public.has_permission(target uuid, perm text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when not exists (
      select 1 from public.profiles where id = target and active
    ) then false
    when exists (
      select 1 from public.profiles
      where id = target and role = 'platform_admin'
    ) then true
    when exists (
      select 1 from public.user_permissions
      where user_id = target and permission = perm
    ) then (
      select allowed from public.user_permissions
      where user_id = target and permission = perm
    )
    else exists (
      select 1
      from public.profiles p
      join public.role_permissions rp on rp.role = p.role
      where p.id = target and rp.permission = perm
    )
  end;
$$;

create or replace function public.my_permissions()
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(p.key order by p.key), '{}')
  from public.permissions p
  where public.has_permission(auth.uid(), p.key);
$$;

create or replace function public.can_read_issue(issue public.issues)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null then
    return false;
  end if;
  if actor.role in ('platform_admin', 'committee_admin', 'committee') then
    return true;
  end if;
  if issue.raised_by = actor.id then
    return true;
  end if;
  if actor.role = 'developer' then
    return issue.assigned_team = 'developer';
  end if;
  return issue.resident_visible and issue.status <> 'draft';
end;
$$;

create or replace function public.can_read_issue_id(issue uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.issues i
    where i.id = issue and public.can_read_issue(i)
  );
$$;

create or replace function public.can_read_document(doc public.documents)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null then
    return false;
  end if;
  if doc.visibility = 'resident' then
    return true;
  end if;
  if doc.visibility = 'developer' then
    return actor.role in ('developer', 'committee', 'committee_admin', 'platform_admin');
  end if;
  return actor.role in ('committee', 'committee_admin', 'platform_admin');
end;
$$;

create or replace function public.can_read_attachment(file public.attachments)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  issue public.issues;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null then
    return false;
  end if;
  if file.visibility = 'committee'
     and actor.role not in ('committee', 'committee_admin', 'platform_admin') then
    return false;
  end if;
  if file.visibility = 'developer'
     and actor.role not in ('developer', 'committee', 'committee_admin', 'platform_admin') then
    return false;
  end if;
  if file.issue_id is not null then
    select * into issue from public.issues where id = file.issue_id;
    if issue.id is null or not public.can_read_issue(issue) then
      return false;
    end if;
  end if;
  if file.document_id is not null then
    return exists (
      select 1 from public.documents d
      where d.id = file.document_id and public.can_read_document(d)
    );
  end if;
  return true;
end;
$$;

create or replace function public.is_meeting_attendee(meeting uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.meeting_attendees
    where meeting_id = meeting and user_id = auth.uid()
  );
$$;

create or replace function public.next_issue_key(p_prefix text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  insert into public.issue_counters as c (prefix, next_value)
  values (p_prefix, 1)
  on conflict (prefix) do update
    set next_value = c.next_value + 1
  returning next_value into n;
  return p_prefix || '-' || lpad(n::text, 3, '0');
end;
$$;

create or replace function public.notify(
  p_user uuid,
  p_kind text,
  p_title text,
  p_body text,
  p_href text,
  p_dedupe text,
  p_critical boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  prefs public.notification_preferences;
begin
  if p_user is null or p_user = auth.uid() then
    return;
  end if;
  if not exists (select 1 from public.profiles where id = p_user and active) then
    return;
  end if;
  if not p_critical then
    select * into prefs from public.notification_preferences where user_id = p_user;
    if found then
      if p_kind = 'comment' and not prefs.comments then
        return;
      end if;
      if p_kind = 'announcement' and not prefs.announcements then
        return;
      end if;
      if p_kind = 'meeting' and not prefs.meetings then
        return;
      end if;
    end if;
  end if;
  insert into public.notifications (user_id, kind, title, body, href, dedupe_key)
  values (p_user, p_kind, p_title, p_body, p_href, p_dedupe)
  on conflict (user_id, dedupe_key) do nothing;
end;
$$;

create or replace function public.write_audit(
  p_actor uuid,
  p_name text,
  p_action text,
  p_summary text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_events (actor_id, actor_name, action, summary)
  values (p_actor, p_name, p_action, p_summary);
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invited public.invitations%rowtype;
  assigned public.app_role := 'resident';
  display_name text;
begin
  select * into invited
  from public.invitations
  where lower(email) = lower(coalesce(new.email, ''))
    and accepted_at is null
    and expires_at > now()
  order by created_at desc
  limit 1;

  if (select count(*) from public.profiles) = 0 and invited.id is null then
    assigned := 'platform_admin';
  elsif invited.id is not null then
    assigned := invited.role;
    update public.invitations set accepted_at = now() where id = invited.id;
  end if;

  display_name := coalesce(
    nullif(new.raw_user_meta_data->>'full_name', ''),
    invited.full_name,
    split_part(coalesce(new.email, 'member'), '@', 1)
  );

  insert into public.profiles (id, email, full_name, role)
  values (new.id, coalesce(new.email, ''), display_name, assigned);

  insert into public.notification_preferences (user_id) values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Issue workflow
-- ---------------------------------------------------------------------------

create or replace function public.create_issue(
  p_title text,
  p_description text,
  p_category_id uuid,
  p_subcategory_id uuid,
  p_priority public.issue_priority,
  p_resident_visible boolean,
  p_as_draft boolean
) returns public.issues
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  cat public.categories;
  created public.issues;
  initial public.issue_status;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null then
    raise exception 'You need an active account.';
  end if;
  if not public.has_permission(actor.id, 'issues.create')
     and not public.has_permission(actor.id, 'issues.review') then
    raise exception 'You cannot raise an issue.';
  end if;
  if char_length(trim(coalesce(p_title, ''))) < 3
     or char_length(trim(coalesce(p_description, ''))) < 3 then
    raise exception 'Add a title and a description.';
  end if;

  select * into cat from public.categories where id = p_category_id and not archived;
  if cat.id is null then
    raise exception 'Choose a category.';
  end if;
  if p_subcategory_id is not null and not exists (
    select 1 from public.subcategories
    where id = p_subcategory_id and category_id = cat.id and not archived
  ) then
    raise exception 'That subcategory does not belong to the category.';
  end if;

  initial := case
    when p_as_draft then 'draft'::public.issue_status
    else 'submitted'::public.issue_status
  end;

  insert into public.issues (
    key, title, description, category_id, subcategory_id, priority, status,
    resident_visible, raised_by, raiser_name
  ) values (
    public.next_issue_key(cat.prefix),
    trim(p_title),
    trim(p_description),
    cat.id,
    p_subcategory_id,
    coalesce(p_priority, 'normal'),
    initial,
    coalesce(p_resident_visible, true),
    actor.id,
    actor.full_name
  ) returning * into created;

  insert into public.activity_events (issue_id, actor_id, actor_name, kind, summary, to_value)
  values (
    created.id, actor.id, actor.full_name, 'created',
    'Raised this issue.', initial::text
  );

  insert into public.issue_follows (issue_id, user_id) values (created.id, actor.id);

  perform public.notify(
    p.id,
    'issue_created',
    created.key || ' raised',
    created.title,
    '/issues/' || created.key,
    'issue:' || created.id::text || ':created:' || p.id::text,
    true
  )
  from public.profiles p
  where p.active
    and p.id <> actor.id
    and public.has_permission(p.id, 'issues.review');

  perform public.write_audit(actor.id, actor.full_name, 'issue.create', created.key || ' ' || created.title);
  return created;
end;
$$;

create or replace function public.transition_issue(
  p_issue_id uuid,
  p_to public.issue_status,
  p_note text
) returns public.issues
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  issue public.issues;
  previous public.issue_status;
  note text := nullif(trim(coalesce(p_note, '')), '');
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null then
    raise exception 'You need an active account.';
  end if;
  select * into issue from public.issues where id = p_issue_id and archived_at is null;
  if issue.id is null or not public.can_read_issue(issue) then
    raise exception 'Issue not found.';
  end if;
  if not exists (
    select 1 from public.status_transitions t
    where t.from_status = issue.status
      and t.to_status = p_to
      and public.has_permission(actor.id, t.permission)
  ) then
    raise exception 'That status change is not allowed.';
  end if;
  if actor.role = 'developer' and issue.assigned_team is distinct from 'developer' then
    raise exception 'This issue is not with the Paranjape team.';
  end if;
  if actor.role = 'resident'
     and issue.raised_by <> actor.id
     and not public.has_permission(actor.id, 'issues.review') then
    raise exception 'You can only change an issue you raised.';
  end if;

  previous := issue.status;
  update public.issues
  set
    status = p_to,
    resolution_notes = case
      when p_to = 'resolved' then coalesce(note, resolution_notes)
      else resolution_notes
    end
  where id = issue.id
  returning * into issue;

  insert into public.activity_events (
    issue_id, actor_id, actor_name, kind, summary, from_value, to_value
  ) values (
    issue.id,
    actor.id,
    actor.full_name,
    'status',
    'Changed the status'
      || case when note is null then '.' else ': ' || note end,
    previous::text,
    p_to::text
  );

  perform public.notify(
    recipient,
    'status',
    issue.key || ' updated',
    'Status is now ' || replace(p_to::text, '_', ' ') || '.',
    '/issues/' || issue.key,
    'issue:' || issue.id::text || ':status:' || p_to::text || ':' || recipient::text,
    true
  )
  from (
    select issue.raised_by as recipient
    union
    select issue.assigned_to
    union
    select f.user_id from public.issue_follows f where f.issue_id = issue.id
  ) people
  where recipient is not null;

  return issue;
end;
$$;

create or replace function public.assign_issue(
  p_issue_id uuid,
  p_team text,
  p_owner uuid,
  p_expected date,
  p_note text
) returns public.issues
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  issue public.issues;
  owner public.profiles;
  owner_name text;
  previous_status public.issue_status;
  note text := nullif(trim(coalesce(p_note, '')), '');
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'issues.assign') then
    raise exception 'You cannot assign issues.';
  end if;
  if p_team is not null and p_team not in ('committee', 'developer') then
    raise exception 'Choose the committee or the Paranjape team.';
  end if;
  select * into issue from public.issues where id = p_issue_id and archived_at is null;
  if not found then
    raise exception 'Issue not found.';
  end if;
  if p_owner is not null then
    select * into owner from public.profiles where id = p_owner and active;
    if not found then
      raise exception 'That person does not have an active account.';
    end if;
    owner_name := owner.full_name;
  end if;

  previous_status := issue.status;
  update public.issues
  set
    assigned_team = p_team,
    assigned_to = p_owner,
    assignee_name = owner_name,
    expected_on = p_expected,
    status = case
      when issue.status in ('submitted', 'under_review', 'reopened') and p_team is not null
        then 'assigned'::public.issue_status
      else issue.status
    end
  where id = issue.id
  returning * into issue;

  insert into public.activity_events (
    issue_id, actor_id, actor_name, kind, summary, from_value, to_value
  ) values (
    issue.id,
    actor.id,
    actor.full_name,
    'assignment',
    'Assigned this issue'
      || coalesce(' to ' || owner_name, ' to the ' || p_team || ' team', '')
      || case when note is null then '.' else '. ' || note end,
    previous_status::text,
    issue.status::text
  );

  perform public.notify(
    p_owner,
    'assignment',
    issue.key || ' assigned to you',
    issue.title,
    '/issues/' || issue.key,
    'issue:' || issue.id::text || ':assign:' || p_owner::text,
    true
  );
  return issue;
end;
$$;

create or replace function public.update_issue_fields(
  p_issue_id uuid,
  p_category_id uuid,
  p_subcategory_id uuid,
  p_priority public.issue_priority,
  p_resident_visible boolean,
  p_note text
) returns public.issues
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  issue public.issues;
  cat public.categories;
  note text := nullif(trim(coalesce(p_note, '')), '');
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'issues.review') then
    raise exception 'You cannot review issues.';
  end if;
  select * into issue from public.issues where id = p_issue_id and archived_at is null;
  if issue.id is null then
    raise exception 'Issue not found.';
  end if;
  select * into cat from public.categories where id = p_category_id and not archived;
  if cat.id is null then
    raise exception 'Choose a category.';
  end if;
  if p_subcategory_id is not null and not exists (
    select 1 from public.subcategories
    where id = p_subcategory_id and category_id = cat.id and not archived
  ) then
    raise exception 'That subcategory does not belong to the category.';
  end if;

  update public.issues
  set
    category_id = cat.id,
    subcategory_id = p_subcategory_id,
    priority = p_priority,
    resident_visible = p_resident_visible
  where id = issue.id
  returning * into issue;

  insert into public.activity_events (issue_id, actor_id, actor_name, kind, summary)
  values (
    issue.id, actor.id, actor.full_name, 'review',
    'Updated the category, priority, or visibility.'
      || case when note is null then '' else ' ' || note end
  );
  return issue;
end;
$$;

create or replace function public.add_comment(
  p_issue_id uuid,
  p_body text,
  p_visibility public.comment_visibility,
  p_official boolean,
  p_parent uuid,
  p_mention uuid
) returns public.comments
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  issue public.issues;
  parent public.comments;
  created public.comments;
  kind public.comment_kind;
  visible public.comment_visibility;
  body text := trim(coalesce(p_body, ''));
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'issues.comment') then
    raise exception 'You cannot comment on this issue.';
  end if;
  if char_length(body) < 1 then
    raise exception 'Write a comment before sending it.';
  end if;
  select * into issue from public.issues where id = p_issue_id and archived_at is null;
  if issue.id is null or not public.can_read_issue(issue) then
    raise exception 'Issue not found.';
  end if;
  if actor.role = 'developer' and issue.assigned_team is distinct from 'developer' then
    raise exception 'This issue is not with the Paranjape team.';
  end if;

  visible := case
    when actor.role in ('committee', 'committee_admin', 'platform_admin') then coalesce(p_visibility, 'resident')
    else 'resident'::public.comment_visibility
  end;
  if visible = 'committee' and actor.role not in ('committee', 'committee_admin', 'platform_admin') then
    raise exception 'You cannot post a committee-only comment.';
  end if;
  if p_parent is not null then
    select * into parent from public.comments where id = p_parent and issue_id = issue.id;
    if parent.id is null then
      raise exception 'That reply target is not on this issue.';
    end if;
    if parent.visibility = 'committee' then
      visible := 'committee';
    end if;
  end if;

  kind := case actor.role
    when 'developer' then 'developer'::public.comment_kind
    when 'resident' then 'resident'::public.comment_kind
    else 'committee'::public.comment_kind
  end;

  if coalesce(p_official, false) then
    if not public.has_permission(actor.id, 'issues.official') or visible <> 'resident' then
      raise exception 'An official update has to be visible to residents who can see the issue.';
    end if;
  end if;

  insert into public.comments (
    issue_id, parent_id, author_id, author_name, author_role, kind, visibility, official, body
  ) values (
    issue.id, p_parent, actor.id, actor.full_name, actor.role, kind, visible,
    coalesce(p_official, false) and visible = 'resident',
    body
  ) returning * into created;

  insert into public.activity_events (
    issue_id, actor_id, actor_name, kind, summary, visibility
  ) values (
    issue.id,
    actor.id,
    actor.full_name,
    case when created.official then 'official' else 'comment' end,
    case
      when created.official then 'Posted an official update.'
      when created.visibility = 'committee' then 'Posted a committee-only comment.'
      else 'Posted a comment.'
    end,
    created.visibility
  );

  perform public.notify(
    recipient,
    case when created.official then 'official' else 'comment' end,
    issue.key || case when created.official then ' has an official update' else ' has a new comment' end,
    left(body, 180),
    '/issues/' || issue.key,
    'comment:' || created.id::text || ':' || recipient::text,
    created.official
  )
  from (
    select issue.raised_by as recipient
    union
    select issue.assigned_to
    union
    select f.user_id from public.issue_follows f where f.issue_id = issue.id
    union
    select p_mention
  ) people
  where recipient is not null
    and (visible = 'resident' or public.has_permission(recipient, 'issues.review'));

  return created;
end;
$$;

create or replace function public.follow_issue(p_issue_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  issue public.issues;
  following boolean;
begin
  if not public.is_active_member() then
    raise exception 'You need an active account.';
  end if;
  select * into issue from public.issues where id = p_issue_id;
  if issue.id is null or not public.can_read_issue(issue) then
    raise exception 'Issue not found.';
  end if;
  if exists (
    select 1 from public.issue_follows
    where issue_id = issue.id and user_id = auth.uid()
  ) then
    delete from public.issue_follows where issue_id = issue.id and user_id = auth.uid();
    following := false;
  else
    insert into public.issue_follows (issue_id, user_id) values (issue.id, auth.uid());
    following := true;
  end if;
  return following;
end;
$$;

create or replace function public.link_issues(p_issue_id uuid, p_related_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'issues.review') then
    raise exception 'You cannot link issues.';
  end if;
  if p_issue_id = p_related_id then
    raise exception 'Choose a different issue.';
  end if;
  if not public.can_read_issue_id(p_issue_id) or not public.can_read_issue_id(p_related_id) then
    raise exception 'Issue not found.';
  end if;
  insert into public.issue_links (issue_id, related_id, created_by)
  values (p_issue_id, p_related_id, actor.id)
  on conflict do nothing;
  insert into public.issue_links (issue_id, related_id, created_by)
  values (p_related_id, p_issue_id, actor.id)
  on conflict do nothing;
end;
$$;

create or replace function public.archive_issue(p_issue_id uuid, p_note text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  issue public.issues;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'issues.review') then
    raise exception 'You cannot archive issues.';
  end if;
  select * into issue from public.issues where id = p_issue_id and archived_at is null;
  if issue.id is null then
    raise exception 'Issue not found.';
  end if;
  update public.issues set archived_at = now() where id = issue.id;
  insert into public.activity_events (issue_id, actor_id, actor_name, kind, summary)
  values (
    issue.id, actor.id, actor.full_name, 'archived',
    'Archived this issue. The history is unchanged.'
      || case when nullif(trim(coalesce(p_note, '')), '') is null then ''
         else ' ' || trim(p_note) end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Discussions and meetings
-- ---------------------------------------------------------------------------

create or replace function public.create_discussion(
  p_title text,
  p_body text,
  p_category_id uuid,
  p_visibility public.comment_visibility
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  created uuid;
  visible public.comment_visibility := 'resident';
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'discussions.create') then
    raise exception 'You cannot start a discussion.';
  end if;
  if char_length(trim(coalesce(p_title, ''))) < 3 or char_length(trim(coalesce(p_body, ''))) < 3 then
    raise exception 'Add a title and an opening note.';
  end if;
  if actor.role in ('committee', 'committee_admin', 'platform_admin') then
    visible := coalesce(p_visibility, 'resident');
  end if;
  insert into public.discussions (title, body, category_id, visibility, created_by, author_name)
  values (trim(p_title), trim(p_body), p_category_id, visible, actor.id, actor.full_name)
  returning id into created;
  insert into public.discussion_follows (discussion_id, user_id) values (created, actor.id);
  return created;
end;
$$;

create or replace function public.add_discussion_post(
  p_discussion_id uuid,
  p_body text,
  p_parent uuid
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  topic public.discussions;
  created uuid;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'discussions.comment') then
    raise exception 'You cannot comment here.';
  end if;
  select * into topic from public.discussions where id = p_discussion_id;
  if topic.id is null then
    raise exception 'Discussion not found.';
  end if;
  if topic.visibility = 'committee'
     and actor.role not in ('committee', 'committee_admin', 'platform_admin') then
    raise exception 'Discussion not found.';
  end if;
  if topic.locked and not public.has_permission(actor.id, 'discussions.moderate') then
    raise exception 'This discussion is locked.';
  end if;
  if char_length(trim(coalesce(p_body, ''))) < 1 then
    raise exception 'Write a comment before sending it.';
  end if;
  insert into public.discussion_posts (discussion_id, parent_id, author_id, author_name, author_role, body)
  values (topic.id, p_parent, actor.id, actor.full_name, actor.role, trim(p_body))
  returning id into created;
  update public.discussions set updated_at = now() where id = topic.id;
  return created;
end;
$$;

create or replace function public.set_discussion_flags(
  p_discussion_id uuid,
  p_pinned boolean,
  p_locked boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'discussions.moderate') then
    raise exception 'You cannot change this discussion.';
  end if;
  update public.discussions
  set pinned = p_pinned, locked = p_locked
  where id = p_discussion_id;
end;
$$;

create or replace function public.convert_discussion(p_discussion_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  topic public.discussions;
  created public.issues;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'discussions.moderate') then
    raise exception 'You cannot turn this into an issue.';
  end if;
  select * into topic from public.discussions where id = p_discussion_id;
  if topic.id is null or topic.converted_issue_id is not null then
    raise exception 'This discussion is already an issue, or it could not be found.';
  end if;
  if topic.category_id is null then
    raise exception 'Choose a category on the discussion before turning it into an issue.';
  end if;
  created := public.create_issue(
    topic.title,
    topic.body,
    topic.category_id,
    null,
    'normal',
    topic.visibility = 'resident',
    false
  );
  update public.discussions set converted_issue_id = created.id where id = topic.id;
  return created.key;
end;
$$;

create or replace function public.create_meeting(
  p_title text,
  p_starts_at timestamptz,
  p_location text,
  p_link text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  created uuid;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'meetings.manage') then
    raise exception 'You cannot schedule a meeting.';
  end if;
  if char_length(trim(coalesce(p_title, ''))) < 3 or p_starts_at is null then
    raise exception 'Add a title and a date.';
  end if;
  insert into public.meetings (title, starts_at, location, link, created_by)
  values (
    trim(p_title), p_starts_at, nullif(trim(coalesce(p_location, '')), ''),
    nullif(trim(coalesce(p_link, '')), ''), actor.id
  )
  returning id into created;
  return created;
end;
$$;

create or replace function public.add_agenda_item(p_meeting_id uuid, p_body text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  next_sort integer;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'meetings.manage') then
    raise exception 'You cannot edit this meeting.';
  end if;
  select coalesce(max(sort), 0) + 1 into next_sort from public.agenda_items where meeting_id = p_meeting_id;
  insert into public.agenda_items (meeting_id, sort, body)
  values (p_meeting_id, next_sort, trim(p_body));
end;
$$;

create or replace function public.add_action_item(
  p_meeting_id uuid,
  p_body text,
  p_owner uuid,
  p_expected date,
  p_issue_id uuid
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  owner public.profiles;
  owner_name text;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'meetings.manage') then
    raise exception 'You cannot add an action.';
  end if;
  if char_length(trim(coalesce(p_body, ''))) < 3 then
    raise exception 'Describe the action.';
  end if;
  if p_owner is not null then
    select * into owner from public.profiles where id = p_owner and active;
    if not found then
      raise exception 'That person does not have an active account.';
    end if;
    owner_name := owner.full_name;
  end if;
  if p_issue_id is not null and not public.can_read_issue_id(p_issue_id) then
    raise exception 'Issue not found.';
  end if;
  insert into public.action_items (meeting_id, body, owner_id, owner_name, expected_on, issue_id)
  values (
    p_meeting_id, trim(p_body), p_owner, owner_name, p_expected, p_issue_id
  );
  perform public.notify(
    p_owner, 'meeting', 'A meeting action was assigned to you', trim(p_body),
    '/meetings/' || p_meeting_id::text,
    'action:' || p_meeting_id::text || ':' || coalesce(p_owner::text, 'none') || ':' || left(trim(p_body), 40),
    false
  );
end;
$$;

create or replace function public.set_action_status(p_action_id uuid, p_status public.action_status)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'meetings.manage') then
    raise exception 'You cannot update this action.';
  end if;
  update public.action_items set status = p_status where id = p_action_id;
end;
$$;

create or replace function public.set_meeting_record(
  p_meeting_id uuid,
  p_status public.meeting_status,
  p_notes text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  meeting public.meetings;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'meetings.manage') then
    raise exception 'You cannot update this meeting.';
  end if;
  update public.meetings
  set status = p_status, notes = coalesce(p_notes, '')
  where id = p_meeting_id
  returning * into meeting;
  if p_status = 'published' then
    perform public.notify(
      p.id, 'meeting', 'Meeting published: ' || meeting.title,
      to_char(meeting.starts_at, 'DD Mon YYYY HH24:MI'),
      '/meetings/' || meeting.id::text,
      'meeting:' || meeting.id::text || ':published:' || p.id::text,
      false
    )
    from public.profiles p
    where p.active and p.role = 'resident';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Development, announcements, documents, correspondence, admin
-- ---------------------------------------------------------------------------

create or replace function public.add_development_update(
  p_item_id uuid,
  p_milestone_id uuid,
  p_source public.information_source,
  p_body text,
  p_status public.development_status,
  p_expected date
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'development.update') then
    raise exception 'You cannot record a development update.';
  end if;
  if char_length(trim(coalesce(p_body, ''))) < 3 then
    raise exception 'Write what was reported, and who it came from.';
  end if;
  if not exists (select 1 from public.development_items where id = p_item_id) then
    raise exception 'Development item not found.';
  end if;
  insert into public.development_updates (
    item_id, milestone_id, author_id, author_name, author_role, source, body, status, expected_on
  ) values (
    p_item_id, p_milestone_id, actor.id, actor.full_name, actor.role,
    p_source, trim(p_body), p_status, p_expected
  );
  update public.development_items
  set
    status = coalesce(p_status, status),
    information_source = p_source,
    expected_on = coalesce(p_expected, expected_on)
  where id = p_item_id;
  if p_milestone_id is not null then
    update public.milestones
    set
      status = coalesce(p_status, status),
      information_source = p_source,
      expected_on = coalesce(p_expected, expected_on),
      completed_on = case
        when p_status = 'completed' and p_source = 'confirmed' then coalesce(completed_on, current_date)
        else completed_on
      end
    where id = p_milestone_id and item_id = p_item_id;
  end if;
end;
$$;

create or replace function public.add_milestone(p_item_id uuid, p_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  next_sort integer;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'development.update') then
    raise exception 'You cannot add a milestone.';
  end if;
  select coalesce(max(sort), 0) + 1 into next_sort from public.milestones where item_id = p_item_id;
  insert into public.milestones (item_id, name, sort)
  values (p_item_id, trim(p_name), next_sort);
end;
$$;

create or replace function public.create_announcement(
  p_title text,
  p_body text,
  p_priority public.announcement_priority,
  p_visibility public.comment_visibility,
  p_expires date,
  p_issue_id uuid default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  created uuid;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'announcements.publish') then
    raise exception 'You cannot publish an announcement.';
  end if;
  if char_length(trim(coalesce(p_title, ''))) < 3 or char_length(trim(coalesce(p_body, ''))) < 3 then
    raise exception 'Add a title and the announcement.';
  end if;
  if p_issue_id is not null and not public.can_read_issue_id(p_issue_id) then
    raise exception 'Issue not found.';
  end if;
  insert into public.announcements (
    title, body, author_id, author_name, priority, visibility, expires_on, issue_id
  ) values (
    trim(p_title), trim(p_body), actor.id, actor.full_name,
    coalesce(p_priority, 'normal'), coalesce(p_visibility, 'resident'), p_expires, p_issue_id
  ) returning id into created;

  perform public.notify(
    p.id, 'announcement', trim(p_title), left(trim(p_body), 180),
    '/announcements',
    'announcement:' || created::text || ':' || p.id::text,
    p_priority = 'important'
  )
  from public.profiles p
  where p.active
    and p.id <> actor.id
    and (
      coalesce(p_visibility, 'resident') = 'resident'
      or p.role in ('committee', 'committee_admin', 'platform_admin')
    );
  return created;
end;
$$;

create or replace function public.acknowledge_announcement(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_permission(auth.uid(), 'announcements.acknowledge')
     and not public.is_active_member() then
    raise exception 'You cannot acknowledge this announcement.';
  end if;
  if not exists (select 1 from public.announcements where id = p_id and visibility = 'resident')
     and not public.has_permission(auth.uid(), 'announcements.publish') then
    raise exception 'Announcement not found.';
  end if;
  insert into public.announcement_acknowledgements (announcement_id, user_id)
  values (p_id, auth.uid())
  on conflict do nothing;
end;
$$;

create or replace function public.register_document(
  p_title text,
  p_description text,
  p_category text,
  p_visibility public.record_visibility,
  p_issue_id uuid,
  p_meeting_id uuid,
  p_discussion_id uuid,
  p_development_item_id uuid
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  created uuid;
  visible public.record_visibility;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not (
    public.has_permission(actor.id, 'documents.upload')
    or public.has_permission(actor.id, 'documents.manage')
  ) then
    raise exception 'You cannot add a document.';
  end if;
  if p_category not in (
    'infrastructure', 'approvals', 'society', 'maintenance',
    'meetings', 'correspondence', 'guidelines', 'other'
  ) then
    raise exception 'Choose a document category.';
  end if;
  visible := case
    when public.has_permission(actor.id, 'documents.manage') then coalesce(p_visibility, 'resident')
    else 'resident'::public.record_visibility
  end;
  if p_issue_id is not null and not public.can_read_issue_id(p_issue_id) then
    raise exception 'Issue not found.';
  end if;
  insert into public.documents (
    title, description, category, visibility, uploaded_by, uploader_name,
    issue_id, meeting_id, discussion_id, development_item_id
  ) values (
    trim(p_title), coalesce(p_description, ''), p_category, visible,
    actor.id, actor.full_name, p_issue_id, p_meeting_id, p_discussion_id, p_development_item_id
  ) returning id into created;
  if p_issue_id is not null then
    insert into public.activity_events (issue_id, actor_id, actor_name, kind, summary)
    values (p_issue_id, actor.id, actor.full_name, 'document', 'Added a document: ' || trim(p_title));
  end if;
  return created;
end;
$$;

create or replace function public.record_attachment(
  p_storage_path text,
  p_file_name text,
  p_content_type text,
  p_byte_size integer,
  p_visibility public.record_visibility,
  p_issue_id uuid,
  p_comment_id uuid,
  p_document_id uuid,
  p_meeting_id uuid,
  p_discussion_id uuid,
  p_development_item_id uuid
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  created uuid;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not (
    public.has_permission(actor.id, 'documents.upload')
    or public.has_permission(actor.id, 'documents.manage')
    or public.has_permission(actor.id, 'issues.comment')
  ) then
    raise exception 'You cannot upload a file.';
  end if;
  if p_issue_id is not null and not public.can_read_issue_id(p_issue_id) then
    raise exception 'Issue not found.';
  end if;
  if p_byte_size < 1 or p_byte_size > 10485760 then
    raise exception 'Files must be between 1 byte and 10 MB.';
  end if;
  insert into public.attachments (
    issue_id, comment_id, document_id, meeting_id, discussion_id, development_item_id,
    visibility, storage_path, file_name, content_type, byte_size, uploaded_by
  ) values (
    p_issue_id, p_comment_id, p_document_id, p_meeting_id, p_discussion_id, p_development_item_id,
    coalesce(p_visibility, 'resident'), p_storage_path, p_file_name, p_content_type, p_byte_size, actor.id
  ) returning id into created;
  if p_issue_id is not null then
    insert into public.activity_events (issue_id, actor_id, actor_name, kind, summary)
    values (p_issue_id, actor.id, actor.full_name, 'file', 'Uploaded ' || p_file_name || '.');
  end if;
  return created;
end;
$$;

create or replace function public.update_correspondence(
  p_id uuid,
  p_sent_on date,
  p_sender text,
  p_recipient text,
  p_body text,
  p_response_received boolean,
  p_response_on date,
  p_response_body text,
  p_follow_up text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'correspondence.manage') then
    raise exception 'You cannot update correspondence.';
  end if;
  if coalesce(p_response_received, false) and char_length(trim(coalesce(p_response_body, ''))) < 3 then
    raise exception 'Write the response that was received before marking it received.';
  end if;
  if p_follow_up not in ('not_started', 'waiting', 'answered', 'closed') then
    raise exception 'Choose a follow-up status.';
  end if;
  update public.correspondence
  set
    sent_on = p_sent_on,
    sender = nullif(trim(coalesce(p_sender, '')), ''),
    recipient = nullif(trim(coalesce(p_recipient, '')), ''),
    body = coalesce(p_body, ''),
    response_received = coalesce(p_response_received, false),
    response_on = p_response_on,
    response_body = coalesce(p_response_body, ''),
    follow_up_status = p_follow_up
  where id = p_id;
  perform public.write_audit(actor.id, actor.full_name, 'correspondence.update', p_id::text);
end;
$$;

create or replace function public.create_invitation(
  p_email text,
  p_full_name text,
  p_role public.app_role
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  token text;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not (
    public.has_permission(actor.id, 'users.invite')
    or public.has_permission(actor.id, 'users.manage')
  ) then
    raise exception 'You cannot invite members.';
  end if;
  if actor.role <> 'platform_admin' and p_role in ('platform_admin', 'committee_admin') then
    raise exception 'Only a platform administrator can invite an administrator.';
  end if;
  if p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Enter a valid email address.';
  end if;
  token := encode(gen_random_bytes(32), 'hex');
  insert into public.invitations (email, full_name, role, token, expires_at, invited_by)
  values (
    lower(trim(p_email)), nullif(trim(coalesce(p_full_name, '')), ''), p_role,
    token, now() + interval '7 days', actor.id
  );
  perform public.write_audit(
    actor.id, actor.full_name, 'member.invite',
    lower(trim(p_email)) || ' as ' || p_role::text
  );
  return token;
end;
$$;

create or replace function public.set_member(
  p_user uuid,
  p_role public.app_role,
  p_active boolean,
  p_plot text,
  p_phase text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'users.manage') then
    raise exception 'You cannot change members.';
  end if;
  if p_user = actor.id and (not p_active or p_role <> actor.role) then
    raise exception 'Ask another administrator to change your own access.';
  end if;
  update public.profiles
  set
    role = p_role,
    active = p_active,
    plot = nullif(trim(coalesce(p_plot, '')), ''),
    phase = nullif(trim(coalesce(p_phase, '')), '')
  where id = p_user;
  perform public.write_audit(actor.id, actor.full_name, 'member.update', p_user::text);
end;
$$;

create or replace function public.set_user_permission(
  p_user uuid,
  p_permission text,
  p_allowed boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'users.manage') then
    raise exception 'You cannot change permissions.';
  end if;
  if not exists (select 1 from public.permissions where key = p_permission) then
    raise exception 'Unknown permission.';
  end if;
  insert into public.user_permissions (user_id, permission, allowed)
  values (p_user, p_permission, p_allowed)
  on conflict (user_id, permission) do update set allowed = excluded.allowed;
  perform public.write_audit(
    actor.id, actor.full_name, 'permission.update',
    p_user::text || ' ' || p_permission
  );
end;
$$;

create or replace function public.add_category(p_name text, p_prefix text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  created uuid;
  next_sort integer;
  slug text;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'categories.manage') then
    raise exception 'You cannot add a category.';
  end if;
  slug := lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g'));
  select coalesce(max(sort), 0) + 1 into next_sort from public.categories;
  insert into public.categories (slug, name, prefix, sort)
  values (slug, trim(p_name), upper(trim(p_prefix)), next_sort)
  returning id into created;
  return created;
end;
$$;

create or replace function public.add_subcategory(p_category_id uuid, p_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.profiles;
  next_sort integer;
begin
  select * into actor from public.profiles where id = auth.uid() and active;
  if actor.id is null or not public.has_permission(actor.id, 'categories.manage') then
    raise exception 'You cannot add a subcategory.';
  end if;
  select coalesce(max(sort), 0) + 1 into next_sort
  from public.subcategories where category_id = p_category_id;
  insert into public.subcategories (category_id, name, sort)
  values (p_category_id, trim(p_name), next_sort);
end;
$$;

create or replace function public.save_preferences(
  p_comments boolean,
  p_status boolean,
  p_announcements boolean,
  p_meetings boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_active_member() then
    raise exception 'You need an active account.';
  end if;
  update public.notification_preferences
  set
    comments = p_comments,
    status_changes = p_status,
    announcements = p_announcements,
    meetings = p_meetings
  where user_id = auth.uid();
end;
$$;

create or replace function public.mark_notifications_read(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notifications
  set read_at = now()
  where user_id = auth.uid()
    and read_at is null
    and (p_id is null or id = p_id);
end;
$$;

create or replace function public.member_directory()
returns table (id uuid, full_name text, role public.app_role)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.full_name, p.role
  from public.profiles p
  where p.active
    and public.has_permission(auth.uid(), 'members.view')
  order by p.full_name;
$$;

create or replace function public.admin_directory()
returns table (
  id uuid,
  email text,
  full_name text,
  role public.app_role,
  active boolean,
  plot text,
  phase text
)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.email, p.full_name, p.role, p.active, p.plot, p.phase
  from public.profiles p
  where public.has_permission(auth.uid(), 'users.manage')
  order by p.full_name;
$$;

create or replace function public.consume_auth_attempt(
  p_key text,
  p_action text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  attempts integer;
begin
  insert into public.auth_attempts (attempt_key, action) values (p_key, p_action);
  delete from public.auth_attempts where created_at < now() - interval '2 days';
  select count(*) into attempts
  from public.auth_attempts
  where attempt_key = p_key
    and action = p_action
    and created_at > now() - make_interval(secs => p_window_seconds);
  return attempts <= p_limit;
end;
$$;

create or replace function public.search_records(p_query text)
returns table (kind text, title text, href text, summary text)
language sql
stable
security invoker
set search_path = public
as $$
  select * from (
    select 'Issue'::text, i.key || ' — ' || i.title, '/issues/' || i.key, left(i.description, 160)
    from public.issues i
    where i.archived_at is null
      and (i.title ilike '%' || p_query || '%' or i.key ilike '%' || p_query || '%' or i.description ilike '%' || p_query || '%')
    union all
    select 'Discussion', d.title, '/discussions/' || d.id::text, left(d.body, 160)
    from public.discussions d
    where d.title ilike '%' || p_query || '%' or d.body ilike '%' || p_query || '%'
    union all
    select 'Meeting', m.title, '/meetings/' || m.id::text, coalesce(m.location, '')
    from public.meetings m
    where m.title ilike '%' || p_query || '%'
    union all
    select 'Document', doc.title, '/documents', left(doc.description, 160)
    from public.documents doc
    where doc.title ilike '%' || p_query || '%' or doc.description ilike '%' || p_query || '%'
    union all
    select 'Announcement', a.title, '/announcements', left(a.body, 160)
    from public.announcements a
    where a.title ilike '%' || p_query || '%' or a.body ilike '%' || p_query || '%'
    union all
    select 'Development', item.name, '/development/' || item.slug, left(item.summary, 160)
    from public.development_items item
    where item.name ilike '%' || p_query || '%' or item.summary ilike '%' || p_query || '%'
  ) found
  limit 30;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_permissions enable row level security;
alter table public.invitations enable row level security;
alter table public.auth_attempts enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.issue_counters enable row level security;
alter table public.status_transitions enable row level security;
alter table public.issues enable row level security;
alter table public.comments enable row level security;
alter table public.activity_events enable row level security;
alter table public.issue_follows enable row level security;
alter table public.issue_links enable row level security;
alter table public.development_items enable row level security;
alter table public.milestones enable row level security;
alter table public.development_updates enable row level security;
alter table public.discussions enable row level security;
alter table public.discussion_posts enable row level security;
alter table public.discussion_follows enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_attendees enable row level security;
alter table public.agenda_items enable row level security;
alter table public.action_items enable row level security;
alter table public.documents enable row level security;
alter table public.attachments enable row level security;
alter table public.correspondence enable row level security;
alter table public.announcements enable row level security;
alter table public.announcement_acknowledgements enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_permission(auth.uid(), 'users.manage'));

create policy permissions_select on public.permissions for select to authenticated
  using (public.is_active_member());

create policy role_permissions_select on public.role_permissions for select to authenticated
  using (public.is_active_member());

create policy user_permissions_select on public.user_permissions for select to authenticated
  using (user_id = auth.uid() or public.has_permission(auth.uid(), 'users.manage'));

create policy invitations_select on public.invitations for select to authenticated
  using (
    public.has_permission(auth.uid(), 'users.invite')
    or public.has_permission(auth.uid(), 'users.manage')
  );

create policy preferences_select on public.notification_preferences for select to authenticated
  using (user_id = auth.uid());

create policy categories_select on public.categories for select to authenticated
  using (public.is_active_member());

create policy subcategories_select on public.subcategories for select to authenticated
  using (public.is_active_member());

create policy transitions_select on public.status_transitions for select to authenticated
  using (public.is_active_member());

create policy issues_select on public.issues for select to authenticated
  using (public.can_read_issue(issues));

create policy comments_select on public.comments for select to authenticated
  using (
    public.can_read_issue_id(issue_id)
    and (
      visibility = 'resident'
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.role in ('committee', 'committee_admin', 'platform_admin')
      )
    )
  );

create policy activity_select on public.activity_events for select to authenticated
  using (
    public.can_read_issue_id(issue_id)
    and (
      visibility = 'resident'
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.role in ('committee', 'committee_admin', 'platform_admin')
      )
    )
  );

create policy follows_select on public.issue_follows for select to authenticated
  using (user_id = auth.uid());

create policy links_select on public.issue_links for select to authenticated
  using (
    public.can_read_issue_id(issue_id)
    and public.can_read_issue_id(related_id)
  );

create policy development_select on public.development_items for select to authenticated
  using (public.is_active_member());

create policy milestones_select on public.milestones for select to authenticated
  using (public.is_active_member());

create policy development_updates_select on public.development_updates for select to authenticated
  using (public.is_active_member());

create policy discussions_select on public.discussions for select to authenticated
  using (
    public.is_active_member()
    and (
      visibility = 'resident'
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.role in ('committee', 'committee_admin', 'platform_admin')
      )
    )
  );

create policy posts_select on public.discussion_posts for select to authenticated
  using (
    exists (select 1 from public.discussions d where d.id = discussion_id)
  );

create policy discussion_follows_select on public.discussion_follows for select to authenticated
  using (user_id = auth.uid());

create policy meetings_select on public.meetings for select to authenticated
  using (
    public.is_active_member()
    and (
      status = 'published'
      or public.is_meeting_attendee(id)
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.role in ('committee', 'committee_admin', 'platform_admin')
      )
    )
  );

create policy attendees_select on public.meeting_attendees for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('committee', 'committee_admin', 'platform_admin')
    )
    or exists (
      select 1 from public.meetings m
      where m.id = meeting_id and m.status = 'published'
    )
  );

create policy agenda_select on public.agenda_items for select to authenticated
  using (exists (select 1 from public.meetings m where m.id = meeting_id));

create policy actions_select on public.action_items for select to authenticated
  using (exists (select 1 from public.meetings m where m.id = meeting_id));

create policy documents_select on public.documents for select to authenticated
  using (public.can_read_document(documents));

create policy attachments_select on public.attachments for select to authenticated
  using (public.can_read_attachment(attachments));

create policy correspondence_select on public.correspondence for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.active
        and p.role in ('committee', 'committee_admin', 'platform_admin', 'developer')
    )
  );

create policy announcements_select on public.announcements for select to authenticated
  using (
    public.is_active_member()
    and (
      visibility = 'resident'
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.role in ('committee', 'committee_admin', 'platform_admin')
      )
    )
  );

create policy acks_select on public.announcement_acknowledgements for select to authenticated
  using (
    user_id = auth.uid()
    or public.has_permission(auth.uid(), 'announcements.publish')
  );

create policy notifications_select on public.notifications for select to authenticated
  using (user_id = auth.uid());

create policy audit_select on public.audit_events for select to authenticated
  using (public.has_permission(auth.uid(), 'audit.view'));

revoke all on all tables in schema public from public, anon, authenticated;
grant select on
  public.profiles,
  public.permissions,
  public.role_permissions,
  public.user_permissions,
  public.invitations,
  public.notification_preferences,
  public.categories,
  public.subcategories,
  public.status_transitions,
  public.issues,
  public.comments,
  public.activity_events,
  public.issue_follows,
  public.issue_links,
  public.development_items,
  public.milestones,
  public.development_updates,
  public.discussions,
  public.discussion_posts,
  public.discussion_follows,
  public.meetings,
  public.meeting_attendees,
  public.agenda_items,
  public.action_items,
  public.documents,
  public.attachments,
  public.correspondence,
  public.announcements,
  public.announcement_acknowledgements,
  public.notifications,
  public.audit_events
to authenticated;

revoke all on all functions in schema public from public, anon, authenticated;

grant execute on function
  public.is_active_member(),
  public.has_permission(uuid, text),
  public.my_permissions(),
  public.can_read_issue(public.issues),
  public.can_read_issue_id(uuid),
  public.can_read_document(public.documents),
  public.can_read_attachment(public.attachments),
  public.is_meeting_attendee(uuid),
  public.member_directory(),
  public.admin_directory(),
  public.search_records(text),
  public.create_issue(text, text, uuid, uuid, public.issue_priority, boolean, boolean),
  public.transition_issue(uuid, public.issue_status, text),
  public.assign_issue(uuid, text, uuid, date, text),
  public.update_issue_fields(uuid, uuid, uuid, public.issue_priority, boolean, text),
  public.add_comment(uuid, text, public.comment_visibility, boolean, uuid, uuid),
  public.follow_issue(uuid),
  public.link_issues(uuid, uuid),
  public.archive_issue(uuid, text),
  public.create_discussion(text, text, uuid, public.comment_visibility),
  public.add_discussion_post(uuid, text, uuid),
  public.set_discussion_flags(uuid, boolean, boolean),
  public.convert_discussion(uuid),
  public.create_meeting(text, timestamptz, text, text),
  public.add_agenda_item(uuid, text),
  public.add_action_item(uuid, text, uuid, date, uuid),
  public.set_action_status(uuid, public.action_status),
  public.set_meeting_record(uuid, public.meeting_status, text),
  public.add_development_update(uuid, uuid, public.information_source, text, public.development_status, date),
  public.add_milestone(uuid, text),
  public.create_announcement(text, text, public.announcement_priority, public.comment_visibility, date, uuid),
  public.acknowledge_announcement(uuid),
  public.register_document(text, text, text, public.record_visibility, uuid, uuid, uuid, uuid),
  public.record_attachment(text, text, text, integer, public.record_visibility, uuid, uuid, uuid, uuid, uuid, uuid),
  public.update_correspondence(uuid, date, text, text, text, boolean, date, text, text),
  public.create_invitation(text, text, public.app_role),
  public.set_member(uuid, public.app_role, boolean, text, text),
  public.set_user_permission(uuid, text, boolean),
  public.add_category(text, text),
  public.add_subcategory(uuid, text),
  public.save_preferences(boolean, boolean, boolean, boolean),
  public.mark_notifications_read(uuid)
to authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.consume_auth_attempt(text, text, integer, integer) to service_role;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Seed: permissions, categories, tracking areas, correspondence shells.
-- No issues, dates, developer responses, or progress figures.
-- ---------------------------------------------------------------------------

insert into public.permissions (key, description) values
  ('users.manage', 'Manage accounts, roles, and access'),
  ('users.invite', 'Invite residents, committee members, and developer representatives'),
  ('settings.manage', 'Change application settings'),
  ('audit.view', 'Read the audit history'),
  ('categories.manage', 'Add categories and subcategories'),
  ('issues.create', 'Raise an issue'),
  ('issues.review', 'Review, categorise, and publish issue updates'),
  ('issues.assign', 'Assign an owner and a team'),
  ('issues.respond', 'Acknowledge and update an assigned issue'),
  ('issues.resolve', 'Mark an issue resolved'),
  ('issues.reopen', 'Reopen a resolved or closed issue'),
  ('issues.comment', 'Comment on an accessible issue'),
  ('issues.official', 'Post an official resident-visible update'),
  ('issues.committee_comment', 'Post a committee-only comment'),
  ('issues.publish', 'Publish a resident-facing issue update'),
  ('development.update', 'Record a township development update'),
  ('discussions.create', 'Start a discussion'),
  ('discussions.comment', 'Comment in a discussion'),
  ('discussions.moderate', 'Pin, lock, or convert a discussion'),
  ('meetings.manage', 'Schedule meetings and record minutes'),
  ('documents.upload', 'Upload a file the member is allowed to see'),
  ('documents.manage', 'Add and classify documents'),
  ('announcements.publish', 'Publish an announcement'),
  ('announcements.acknowledge', 'Acknowledge an announcement'),
  ('correspondence.manage', 'Maintain official correspondence records'),
  ('reports.view', 'View committee reports'),
  ('members.view', 'See member names and roles');

insert into public.role_permissions (role, permission) values
  ('resident', 'issues.create'),
  ('resident', 'issues.reopen'),
  ('resident', 'issues.comment'),
  ('resident', 'discussions.create'),
  ('resident', 'discussions.comment'),
  ('resident', 'announcements.acknowledge'),
  ('resident', 'documents.upload');

insert into public.role_permissions (role, permission)
select 'committee', permission from public.role_permissions where role = 'resident';

insert into public.role_permissions (role, permission) values
  ('committee', 'issues.review'),
  ('committee', 'issues.assign'),
  ('committee', 'issues.respond'),
  ('committee', 'issues.resolve'),
  ('committee', 'issues.official'),
  ('committee', 'issues.committee_comment'),
  ('committee', 'development.update'),
  ('committee', 'discussions.moderate'),
  ('committee', 'meetings.manage'),
  ('committee', 'documents.manage'),
  ('committee', 'correspondence.manage'),
  ('committee', 'reports.view'),
  ('committee', 'members.view');

insert into public.role_permissions (role, permission)
select 'committee_admin', permission from public.role_permissions where role = 'committee';

insert into public.role_permissions (role, permission) values
  ('committee_admin', 'users.invite'),
  ('committee_admin', 'announcements.publish'),
  ('committee_admin', 'issues.publish'),
  ('committee_admin', 'categories.manage');

insert into public.role_permissions (role, permission) values
  ('developer', 'issues.respond'),
  ('developer', 'issues.resolve'),
  ('developer', 'issues.comment'),
  ('developer', 'issues.official'),
  ('developer', 'documents.upload'),
  ('developer', 'development.update'),
  ('developer', 'discussions.comment'),
  ('developer', 'members.view');

insert into public.role_permissions (role, permission)
select 'platform_admin', key from public.permissions;

insert into public.status_transitions (from_status, to_status, permission) values
  ('draft', 'submitted', 'issues.create'),
  ('submitted', 'under_review', 'issues.review'),
  ('submitted', 'awaiting_information', 'issues.review'),
  ('under_review', 'assigned', 'issues.assign'),
  ('under_review', 'awaiting_information', 'issues.review'),
  ('assigned', 'acknowledged', 'issues.respond'),
  ('assigned', 'acknowledged', 'issues.review'),
  ('assigned', 'awaiting_information', 'issues.review'),
  ('acknowledged', 'in_progress', 'issues.respond'),
  ('acknowledged', 'in_progress', 'issues.review'),
  ('acknowledged', 'awaiting_information', 'issues.respond'),
  ('acknowledged', 'awaiting_developer', 'issues.review'),
  ('in_progress', 'awaiting_information', 'issues.respond'),
  ('in_progress', 'awaiting_information', 'issues.review'),
  ('in_progress', 'awaiting_developer', 'issues.review'),
  ('in_progress', 'resolved', 'issues.resolve'),
  ('in_progress', 'resolved', 'issues.respond'),
  ('awaiting_information', 'in_progress', 'issues.review'),
  ('awaiting_information', 'in_progress', 'issues.respond'),
  ('awaiting_information', 'submitted', 'issues.create'),
  ('awaiting_developer', 'in_progress', 'issues.respond'),
  ('awaiting_developer', 'acknowledged', 'issues.respond'),
  ('resolved', 'closed', 'issues.review'),
  ('resolved', 'reopened', 'issues.reopen'),
  ('resolved', 'reopened', 'issues.review'),
  ('closed', 'reopened', 'issues.reopen'),
  ('closed', 'reopened', 'issues.review'),
  ('reopened', 'under_review', 'issues.review');

insert into public.categories (slug, name, prefix, sort) values
  ('infrastructure', 'Infrastructure & Amenities', 'INF', 1),
  ('approvals', 'Approvals & NOCs', 'APR', 2),
  ('society', 'Society & Maintenance', 'SOC', 3);

insert into public.subcategories (category_id, name, sort)
select c.id, s.name, s.sort
from public.categories c
join (values
  ('infrastructure', 'Electricity and township load approval', 1),
  ('infrastructure', 'Permanent water supply', 2),
  ('infrastructure', 'STP construction and connection requirements', 3),
  ('infrastructure', 'Clubhouse and amenities', 4),
  ('infrastructure', 'Commercial spaces', 5),
  ('infrastructure', 'Kaleidoscope Gate', 6),
  ('infrastructure', 'Fire facilities', 7),
  ('infrastructure', 'Hospital', 8),
  ('infrastructure', 'School', 9),
  ('infrastructure', 'Other infrastructure', 10),
  ('approvals', 'Construction approval process', 1),
  ('approvals', 'NOC processing timelines', 2),
  ('approvals', 'Construction guidelines', 3),
  ('approvals', 'Height restrictions', 4),
  ('approvals', 'Construction plan approvals across phases', 5),
  ('approvals', 'Individual member construction requests', 6),
  ('approvals', 'Other permissions', 7),
  ('society', 'Society formation and member signatures', 1),
  ('society', 'Maintenance collections', 2),
  ('society', 'Maintenance expenditure', 3),
  ('society', 'Available maintenance balance', 4),
  ('society', 'Maintenance management', 5),
  ('society', 'Official committee communication channel', 6),
  ('society', 'Resident interaction and meeting with management', 7),
  ('society', 'Other society matters', 8)
) as s(slug, name, sort) on s.slug = c.slug;

insert into public.development_items (slug, name, summary, sort) values
  ('electricity', 'Electricity', 'Township electricity and load approval. No date or status has been confirmed in this record.', 1),
  ('water', 'Water supply', 'Permanent water supply. No date or status has been confirmed in this record.', 2),
  ('stp', 'STP and sewage', 'STP construction and connection. No date or status has been confirmed in this record.', 3),
  ('roads', 'Roads and internal infrastructure', 'Internal roads and related infrastructure. No date or status has been confirmed in this record.', 4),
  ('clubhouse', 'Clubhouse and amenities', 'Clubhouse and amenity works. No date or status has been confirmed in this record.', 5),
  ('commercial', 'Commercial spaces', 'Commercial spaces. No date or status has been confirmed in this record.', 6),
  ('gate', 'Gate and access', 'Gate and access infrastructure, including Kaleidoscope Gate. No date or status has been confirmed in this record.', 7),
  ('fire', 'Fire safety', 'Fire facilities. No date or status has been confirmed in this record.', 8),
  ('hospital', 'Hospital', 'Hospital. No date or status has been confirmed in this record.', 9),
  ('school', 'School', 'School. No date or status has been confirmed in this record.', 10),
  ('society-formation', 'Society formation', 'Society registration and formation. No date or status has been confirmed in this record.', 11);

insert into public.milestones (item_id, name, sort)
select d.id, m.name, m.sort
from public.development_items d
join (values
  ('electricity', 'Load application submitted', 1),
  ('electricity', 'Approval received', 2),
  ('electricity', 'Infrastructure installation', 3),
  ('electricity', 'Connection and commissioning', 4),
  ('electricity', 'Supply available to residents', 5)
) as m(slug, name, sort) on m.slug = d.slug;

insert into public.correspondence (title, subject, recipient, body, follow_up_status) values
  (
    'Infrastructure & Amenities',
    'Infrastructure & Amenities',
    'Paranjape',
    'Placeholder for the infrastructure and amenities correspondence. No letter has been logged yet.',
    'not_started'
  ),
  (
    'Approvals, NOC & Guidelines',
    'Approvals, NOC & Guidelines',
    'Paranjape',
    'Placeholder for approvals, NOC, and construction-guideline correspondence. No letter has been logged yet.',
    'not_started'
  ),
  (
    'Society Formation, Maintenance & Meeting Request',
    'Society Formation, Maintenance & Meeting Request',
    'Paranjape',
    'Placeholder for society formation, maintenance, and meeting-request correspondence. No letter has been logged yet.',
    'not_started'
  );

do $$
declare
  objects_owner name;
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'storage' and table_name = 'buckets'
  ) then
    insert into storage.buckets (id, name, public)
    values ('portal', 'portal', false)
    on conflict (id) do nothing;
    -- Supabase already enables row level security, and the storage admin owns the
    -- table. Only alter it when this session is the owner.
    select r.rolname into objects_owner
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    join pg_roles r on r.oid = c.relowner
    where n.nspname = 'storage' and c.relname = 'objects';
    if objects_owner = current_user then
      execute 'alter table storage.objects enable row level security';
    end if;
    execute 'drop policy if exists portal_storage_read on storage.objects';
    execute $policy$
      create policy portal_storage_read on storage.objects
      for select to authenticated
      using (
        bucket_id = 'portal'
        and exists (
          select 1 from public.attachments a
          where a.storage_path = name
            and public.can_read_attachment(a)
        )
      )
    $policy$;
  end if;
end $$;

-- Create visitors table
create table public.visitors (
  id uuid default gen_random_uuid() primary key,
  ip_address text,
  user_agent text,
  country text,
  city text,
  device_type text,
  browser text,
  os text,
  referrer text,
  page_url text,
  session_duration integer,
  visited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create page_views table
create table public.page_views (
  id uuid default gen_random_uuid() primary key,
  visitor_id uuid references public.visitors(id),
  page_path text not null,
  time_spent integer,
  visited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- Enable RLS
alter table public.visitors enable row level security;
alter table public.page_views enable row level security;

-- Create policies to allow theoretical anonymous inserts (since this is for analytics)
-- Note: In a strict environment, you might want to restrict this further, 
-- but for a portfolio analytics tracker using the anon key, we need to allow inserts.

create policy "Allow public insert to visitors"
  on public.visitors
  for insert
  to anon
  with check (true);

create policy "Allow public insert to page_views"
  on public.page_views
  for insert
  to anon
  with check (true);

-- Allow reading stats (optional, if you want to display stats on the site publicly)
create policy "Allow public select to visitors"
  on public.visitors
  for select
  to anon
  using (true);

create policy "Allow public select to page_views"
  on public.page_views
  for select
  to anon
  using (true);

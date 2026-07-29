-- Run this once in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

create table if not exists abn_expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  category text not null,
  description text,
  amount numeric not null,
  business_use_percent numeric not null default 100,
  gst_included boolean not null default false,
  receipt_path text,
  created_at timestamptz not null default now()
);

create table if not exists abn_income (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  client text,
  invoice_number text,
  amount numeric not null,
  gst_collected boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists abn_settings (
  id int primary key,
  gst_registered boolean not null default false
);
insert into abn_settings (id, gst_registered)
values (1, false)
on conflict (id) do nothing;

-- Row Level Security stays ON (default) and no policies are added.
-- Nothing here is ever readable via the public anon key: every read/write
-- goes through Next.js API routes using the service role key, which
-- bypasses RLS on the server only. The password gate in the app is what
-- protects those API routes.
alter table abn_expenses enable row level security;
alter table abn_income enable row level security;
alter table abn_settings enable row level security;

-- After running this file:
-- 1. Go to Storage in the Supabase dashboard.
-- 2. Create a new bucket named "receipts" and set it to Private.
-- 3. No storage policies are needed either, for the same reason as above.

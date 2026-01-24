-- Supabase schema for rental app
-- Run in Supabase SQL editor

-- Extensions
create extension if not exists pgcrypto;

-- Profiles: link to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  role text check (role in ('tenant','landlord')) default 'tenant',
  created_at timestamp with time zone default now()
);

-- Function to create profile on user sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Properties
create table if not exists public.properties (
  id bigserial primary key,
  landlord_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  price numeric(10,2) not null,
  address text,
  bedrooms integer,
  bathrooms integer,
  sqft integer,
  area text,
  images text[],
  created_at timestamp with time zone default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.properties enable row level security;

-- Profiles policies
create policy profiles_select_self on public.profiles
  for select using (id = auth.uid());

-- Properties policies
create policy properties_select_all on public.properties
  for select using (true);

drop policy if exists properties_insert_landlord on public.properties;

create policy properties_insert_owner on public.properties
  for insert
  with check (
    landlord_id = auth.uid()
  );

create policy properties_update_owner on public.properties
  for update using (landlord_id = auth.uid());

create policy properties_delete_owner on public.properties
  for delete using (landlord_id = auth.uid());

create table public.players (
  id uuid not null default gen_random_uuid (),
  first_name text null,
  last_name text null,
  team text null,
  positions text null,
  matches bigint null,
  minutes bigint null,
  full_name text GENERATED ALWAYS as (((first_name || ' '::text) || last_name)) STORED null,
  yellow_cards text null,
  red_cards text null,
  constraint players_pkey1 primary key (id),
  constraint players_full_name_key unique (full_name),
  constraint players_name_team_unique unique (first_name, last_name, team)
) TABLESPACE pg_default;

create table public.teams (
  id serial not null,
  team text null,
  city text null,
  stadium text null,
  foundation_year integer null,
  nickname text null,
  team_color text null,
  team_color_darker text null,
  constraint teams_pkey primary key (id)
) TABLESPACE pg_default;

create table public.offensive (
  name text not null,
  goals bigint null default '0'::bigint,
  shots bigint null default '0'::bigint,
  xg double precision null default '0'::double precision,
  np_goals bigint null default '0'::bigint,
  np_xg double precision null default '0'::double precision,
  constraint offensive_pkey primary key (name),
  constraint offensive_name_fkey foreign KEY (name) references players (full_name)
) TABLESPACE pg_default;

create table public.league_table (
  team text not null,
  mp integer null,
  w integer null,
  d integer null,
  l integer null,
  gf integer null,
  ga integer null,
  gd integer null,
  pts integer null,
  constraint league_table_pkey primary key (team)
) TABLESPACE pg_default;

create table public.keepers (
  name text not null,
  saves bigint null default '0'::bigint,
  goals_conceded bigint null default '0'::bigint,
  punches bigint null default '0'::bigint,
  high_claims bigint null default '0'::bigint,
  recoveries bigint null default '0'::bigint,
  touches bigint null default '0'::bigint,
  passes_accurate bigint null default '0'::bigint,
  long_balls_accurate bigint null default '0'::bigint,
  goals_prevented double precision null default '0'::double precision,
  xgot_faced double precision null default '0'::double precision,
  clean_sheet bigint null,
  constraint keepers_pkey primary key (name),
  constraint keepers_name_fkey foreign KEY (name) references players (full_name)
) TABLESPACE pg_default;

create table public.defensive (
  name text not null,
  tackles_won bigint null default '0'::bigint,
  interceptions bigint null default '0'::bigint,
  duels_won bigint null default '0'::bigint,
  constraint defensive_pkey primary key (name),
  constraint defensive_name_fkey foreign KEY (name) references players (full_name)
) TABLESPACE pg_default;
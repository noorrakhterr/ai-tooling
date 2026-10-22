-- Run via the OAP dashboard SQL editor for tenant "ai-tools".
-- Column names are quoted camelCase to match the TypeScript Tool/Recording
-- shapes (src/types.ts) exactly — no snake_case<->camelCase mapping layer.
--
-- This step only creates the tables and enables RLS (locking out all
-- access until policies exist). RLS policies are added in a follow-up
-- step once the resource grant is applied and the real authenticated
-- role name is confirmed from the dashboard — see db/002_add_rls_policies.sql.

CREATE TABLE ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  link text NOT NULL,
  "phaseIds" text[] NOT NULL DEFAULT '{}',
  owner text,
  "comingSoon" boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;

CREATE TABLE gong_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  link text NOT NULL,
  customer text,
  owner text,
  "callDate" date,
  labels text[] NOT NULL DEFAULT '{}',
  transcript text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gong_recordings ENABLE ROW LEVEL SECURITY;

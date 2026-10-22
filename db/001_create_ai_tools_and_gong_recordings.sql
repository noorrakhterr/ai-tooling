-- Run via the OAP dashboard SQL editor for tenant "ai-tools".
-- Column names are quoted camelCase to match the TypeScript Tool/Recording
-- shapes (src/types.ts) exactly — no snake_case<->camelCase mapping layer.
-- Adjust the role name below if it doesn't match what the dashboard shows
-- for this tenant's authenticated role.

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

GRANT SELECT, INSERT, UPDATE, DELETE ON ai_tools TO "ai-tools_authenticated";

CREATE POLICY "authenticated read ai_tools"
  ON ai_tools FOR SELECT
  TO "ai-tools_authenticated"
  USING (true);

CREATE POLICY "authenticated write ai_tools"
  ON ai_tools FOR INSERT
  TO "ai-tools_authenticated"
  WITH CHECK (true);

CREATE POLICY "authenticated update ai_tools"
  ON ai_tools FOR UPDATE
  TO "ai-tools_authenticated"
  USING (true)
  WITH CHECK (true);

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

GRANT SELECT, INSERT, UPDATE, DELETE ON gong_recordings TO "ai-tools_authenticated";

CREATE POLICY "authenticated read gong_recordings"
  ON gong_recordings FOR SELECT
  TO "ai-tools_authenticated"
  USING (true);

CREATE POLICY "authenticated write gong_recordings"
  ON gong_recordings FOR INSERT
  TO "ai-tools_authenticated"
  WITH CHECK (true);

CREATE POLICY "authenticated update gong_recordings"
  ON gong_recordings FOR UPDATE
  TO "ai-tools_authenticated"
  USING (true)
  WITH CHECK (true);

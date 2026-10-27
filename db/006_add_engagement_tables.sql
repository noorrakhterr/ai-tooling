-- Run via the OAP dashboard SQL editor AFTER 001-005.
--
-- Adds two tables backing the Catalog engagement features: tool_usage
-- (per-teammate "I use this" toggle, one row per toolId+userEmail pair)
-- and tool_comments (free-text tips/praise, attributed to the posting
-- teammate). Column names are quoted camelCase to match the new
-- ToolUsage / ToolComment TS interfaces exactly, matching the
-- no-mapping-layer convention from 001.
--
-- Both tables get all 4 RLS policies for both role scopes up front — 005
-- exists because a prior table skipped the DELETE policy; this migration
-- does not repeat that, even though the UI doesn't expose UPDATE on
-- either table yet.
--
-- userEmail is never trusted from the browser — the server (server.js's
-- tableRoutes stampUserEmailField option) always overwrites it from the
-- OAP edge's x-iddb-user-email header before the INSERT reaches here.
--
-- IMPORTANT, learned again the hard way after shipping this: running this
-- SQL file alone is NOT enough. The RLS policies below only control what
-- Postgres allows once a query already has a grant — this app's own
-- dedicated role (iddb_a_0f9f634c5972) separately needs an OAP resource
-- grant applied for each new table, same requirement ai_tools/
-- gong_recordings had originally. Confirmed via a real deployed request
-- that failed with IDDB_GRANT_MISSING until this ran:
--   iddb grants apply app repository --table tool_usage,tool_comments \
--     --priv SELECT,INSERT,UPDATE,DELETE --tenant ai-tools

CREATE TABLE tool_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "toolId" uuid NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
  "userEmail" text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("toolId", "userEmail")
);

ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

CREATE TABLE tool_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "toolId" uuid NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
  "userEmail" text NOT NULL,
  body text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tool_comments ENABLE ROW LEVEL SECURITY;

-- App role (iddb_a_0f9f634c5972) — all 4 ops, both tables

CREATE POLICY "app role select tool_usage"
  ON tool_usage FOR SELECT TO iddb_a_0f9f634c5972 USING (true);
CREATE POLICY "app role insert tool_usage"
  ON tool_usage FOR INSERT TO iddb_a_0f9f634c5972 WITH CHECK (true);
CREATE POLICY "app role update tool_usage"
  ON tool_usage FOR UPDATE TO iddb_a_0f9f634c5972 USING (true) WITH CHECK (true);
CREATE POLICY "app role delete tool_usage"
  ON tool_usage FOR DELETE TO iddb_a_0f9f634c5972 USING (true);

CREATE POLICY "app role select tool_comments"
  ON tool_comments FOR SELECT TO iddb_a_0f9f634c5972 USING (true);
CREATE POLICY "app role insert tool_comments"
  ON tool_comments FOR INSERT TO iddb_a_0f9f634c5972 WITH CHECK (true);
CREATE POLICY "app role update tool_comments"
  ON tool_comments FOR UPDATE TO iddb_a_0f9f634c5972 USING (true) WITH CHECK (true);
CREATE POLICY "app role delete tool_comments"
  ON tool_comments FOR DELETE TO iddb_a_0f9f634c5972 USING (true);

-- Tenant roles — GRANT before policy, as established in 004

GRANT SELECT, INSERT, UPDATE, DELETE ON tool_usage TO "ai-tools_authenticated";
GRANT SELECT, INSERT, UPDATE, DELETE ON tool_usage TO "ai-tools_anon";

CREATE POLICY "tenant role select tool_usage"
  ON tool_usage FOR SELECT TO "ai-tools_authenticated", "ai-tools_anon" USING (true);
CREATE POLICY "tenant role insert tool_usage"
  ON tool_usage FOR INSERT TO "ai-tools_authenticated", "ai-tools_anon" WITH CHECK (true);
CREATE POLICY "tenant role update tool_usage"
  ON tool_usage FOR UPDATE TO "ai-tools_authenticated", "ai-tools_anon" USING (true) WITH CHECK (true);
CREATE POLICY "tenant role delete tool_usage"
  ON tool_usage FOR DELETE TO "ai-tools_authenticated", "ai-tools_anon" USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON tool_comments TO "ai-tools_authenticated";
GRANT SELECT, INSERT, UPDATE, DELETE ON tool_comments TO "ai-tools_anon";

CREATE POLICY "tenant role select tool_comments"
  ON tool_comments FOR SELECT TO "ai-tools_authenticated", "ai-tools_anon" USING (true);
CREATE POLICY "tenant role insert tool_comments"
  ON tool_comments FOR INSERT TO "ai-tools_authenticated", "ai-tools_anon" WITH CHECK (true);
CREATE POLICY "tenant role update tool_comments"
  ON tool_comments FOR UPDATE TO "ai-tools_authenticated", "ai-tools_anon" USING (true) WITH CHECK (true);
CREATE POLICY "tenant role delete tool_comments"
  ON tool_comments FOR DELETE TO "ai-tools_authenticated", "ai-tools_anon" USING (true);

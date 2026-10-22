-- Run via the OAP dashboard SQL editor AFTER 001_create_ai_tools_and_gong_recordings.sql
-- AND after applying the resource grant for the "repository" app on both
-- tables (dashboard: App detail → Manage grants → Apply a grant).
--
-- Both tables currently have RLS enabled with zero policies, which means
-- nobody can actually read or write them yet — "RLS enabled" and
-- "accessible" are different things on this platform. This file adds the
-- policies that make them accessible.
--
-- Role name confirmed from the dashboard's "Manage grants" page for the
-- "repository" app: this app's apikey authenticates as its own dedicated
-- per-resource Postgres role, iddb_a_0f9f634c5972 — NOT ai-tools_anon or
-- a shared ai-tools_authenticated role. The resource grants already applied
-- (SELECT/INSERT/UPDATE/DELETE on ai_tools and gong_recordings) cover the
-- Postgres GRANT; these policies are the separate RLS layer that actually
-- lets that role's queries through.

CREATE POLICY "app role read ai_tools"
  ON ai_tools FOR SELECT
  TO iddb_a_0f9f634c5972
  USING (true);

CREATE POLICY "app role write ai_tools"
  ON ai_tools FOR INSERT
  TO iddb_a_0f9f634c5972
  WITH CHECK (true);

CREATE POLICY "app role update ai_tools"
  ON ai_tools FOR UPDATE
  TO iddb_a_0f9f634c5972
  USING (true)
  WITH CHECK (true);

CREATE POLICY "app role read gong_recordings"
  ON gong_recordings FOR SELECT
  TO iddb_a_0f9f634c5972
  USING (true);

CREATE POLICY "app role write gong_recordings"
  ON gong_recordings FOR INSERT
  TO iddb_a_0f9f634c5972
  WITH CHECK (true);

CREATE POLICY "app role update gong_recordings"
  ON gong_recordings FOR UPDATE
  TO iddb_a_0f9f634c5972
  USING (true)
  WITH CHECK (true);

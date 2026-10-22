-- Run via the OAP dashboard SQL editor AFTER 001/002/003.
--
-- The app-specific resource grant (dashboard: Manage grants) scopes
-- privileges to this app's own dedicated Postgres role, iddb_a_0f9f634c5972
-- — that's what the app's own server-side apikey authenticates as. But a
-- direct REST call from the browser using the generic anon key
-- (VITE_IDDB_ANON_KEY) authenticates as the tenant-wide "ai-tools_anon" /
-- "ai-tools_authenticated" role instead, which has no grant on these
-- tables yet. Confirmed directly via a 403 IDDB_GRANT_MISSING response
-- from the REST API, which named the exact fix below.

GRANT SELECT, INSERT, UPDATE, DELETE ON ai_tools TO "ai-tools_authenticated";
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_tools TO "ai-tools_anon";

CREATE POLICY "tenant role read ai_tools"
  ON ai_tools FOR SELECT
  TO "ai-tools_authenticated", "ai-tools_anon"
  USING (true);

CREATE POLICY "tenant role write ai_tools"
  ON ai_tools FOR INSERT
  TO "ai-tools_authenticated", "ai-tools_anon"
  WITH CHECK (true);

CREATE POLICY "tenant role update ai_tools"
  ON ai_tools FOR UPDATE
  TO "ai-tools_authenticated", "ai-tools_anon"
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON gong_recordings TO "ai-tools_authenticated";
GRANT SELECT, INSERT, UPDATE, DELETE ON gong_recordings TO "ai-tools_anon";

CREATE POLICY "tenant role read gong_recordings"
  ON gong_recordings FOR SELECT
  TO "ai-tools_authenticated", "ai-tools_anon"
  USING (true);

CREATE POLICY "tenant role write gong_recordings"
  ON gong_recordings FOR INSERT
  TO "ai-tools_authenticated", "ai-tools_anon"
  WITH CHECK (true);

CREATE POLICY "tenant role update gong_recordings"
  ON gong_recordings FOR UPDATE
  TO "ai-tools_authenticated", "ai-tools_anon"
  USING (true)
  WITH CHECK (true);

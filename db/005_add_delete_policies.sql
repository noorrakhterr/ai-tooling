-- Run via the OAP dashboard SQL editor AFTER 001/002/003/004.
--
-- Caught before shipping edit/delete support in the app: 002 and 004 both
-- granted/policy'd SELECT, INSERT, UPDATE — DELETE was missing from the
-- RLS policy layer on both tables (the Postgres GRANT in 004 does include
-- DELETE, but a GRANT and a POLICY are separate layers; without a policy,
-- RLS blocks the delete regardless of the grant). This adds the missing
-- DELETE policies for both the app's own role and the tenant-wide roles,
-- matching the pattern already used for the other three operations.

CREATE POLICY "app role delete ai_tools"
  ON ai_tools FOR DELETE
  TO iddb_a_0f9f634c5972
  USING (true);

CREATE POLICY "app role delete gong_recordings"
  ON gong_recordings FOR DELETE
  TO iddb_a_0f9f634c5972
  USING (true);

CREATE POLICY "tenant role delete ai_tools"
  ON ai_tools FOR DELETE
  TO "ai-tools_authenticated", "ai-tools_anon"
  USING (true);

CREATE POLICY "tenant role delete gong_recordings"
  ON gong_recordings FOR DELETE
  TO "ai-tools_authenticated", "ai-tools_anon"
  USING (true);

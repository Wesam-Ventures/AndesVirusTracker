-- Missing events: May 21 → June 9, 2026
-- Run in Supabase SQL Editor after confirming no duplicates
-- These were missing because andes_events RLS blocked anon key inserts from sync-stats

INSERT INTO andes_events (event_date, event, cases, deaths, source, tag, tag_color)
VALUES
  (
    '2026-05-26',
    'ECDC update: 13 total cases (11 confirmed, 2 probable), 3 deaths — 2 new cases since May 21. No new deaths. Outbreak day 28.',
    13, 3, 'ECDC', 'OFFICIAL', '#3b82f6'
  ),
  (
    '2026-05-29',
    '18 US-exposed passengers repatriated to Nebraska federal quarantine facility — largest single US cohort monitored for Andes hantavirus',
    13, 3, 'CDC / Nebraska DHHS', 'UPDATE', '#f59e0b'
  ),
  (
    '2026-06-02',
    'CDC situation summary updated: no confirmed US cases. Risk to American public assessed as extremely low.',
    13, 3, 'CDC', 'OFFICIAL', '#3b82f6'
  ),
  (
    '2026-06-08',
    'Texas passengers complete 42-day monitoring period — first major US cohort clears quarantine without developing illness',
    13, 3, 'Spectrum News / KVUE', 'UPDATE', '#f59e0b'
  ),
  (
    '2026-06-08',
    'Doctor who treated MV Hondius patients at Nebraska quarantine facility now self-quarantining in Oregon — healthcare worker exposure monitored',
    13, 3, 'KETV', 'UPDATE', '#f59e0b'
  ),
  (
    '2026-06-08',
    'Argentina expands Andes hantavirus investigation in Ushuaia region — probe into animal reservoir and transmission chain at outbreak origin site',
    13, 3, 'OCA Academy / CIDRAP', 'UPDATE', '#f59e0b'
  ),
  (
    '2026-06-09',
    'AAFP medical journal publishes outbreak summary: 65 US passengers monitored, 42-day incubation period standard applied across all US states',
    13, 3, 'AAFP (American Academy of Family Physicians)', 'OFFICIAL', '#3b82f6'
  )
ON CONFLICT DO NOTHING;

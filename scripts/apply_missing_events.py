"""
Apply missing timeline events to Supabase.
Requires SUPABASE_SERVICE_ROLE_KEY env var (service role bypasses RLS).

Usage:
  SUPABASE_SERVICE_ROLE_KEY=<key> python3 scripts/apply_missing_events.py
"""
import os
import requests

SUPABASE_URL = "https://hymlbpapgspoytcavsub.supabase.co"
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SERVICE_KEY:
    print("ERROR: Set SUPABASE_SERVICE_ROLE_KEY env var first.")
    print("Get it from: Supabase dashboard > Project settings > API > service_role key")
    exit(1)

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal,resolution=ignore-duplicates",
}

EVENTS = [
    {
        "event_date": "2026-05-26",
        "event": "ECDC update: 13 total cases (11 confirmed, 2 probable), 3 deaths — 2 new cases since May 21. No new deaths. Outbreak day 28.",
        "cases": 13, "deaths": 3,
        "source": "ECDC", "tag": "OFFICIAL", "tag_color": "#3b82f6",
    },
    {
        "event_date": "2026-05-29",
        "event": "18 US-exposed passengers repatriated to Nebraska federal quarantine facility — largest single US cohort monitored for Andes hantavirus",
        "cases": 13, "deaths": 3,
        "source": "CDC / Nebraska DHHS", "tag": "UPDATE", "tag_color": "#f59e0b",
    },
    {
        "event_date": "2026-06-02",
        "event": "CDC situation summary updated: no confirmed US cases. Risk to American public assessed as extremely low.",
        "cases": 13, "deaths": 3,
        "source": "CDC", "tag": "OFFICIAL", "tag_color": "#3b82f6",
    },
    {
        "event_date": "2026-06-08",
        "event": "Texas passengers complete 42-day monitoring period — first major US cohort clears quarantine without developing illness",
        "cases": 13, "deaths": 3,
        "source": "Spectrum News / KVUE", "tag": "UPDATE", "tag_color": "#f59e0b",
    },
    {
        "event_date": "2026-06-08",
        "event": "Doctor who treated MV Hondius patients at Nebraska quarantine facility now self-quarantining in Oregon — healthcare worker exposure monitored",
        "cases": 13, "deaths": 3,
        "source": "KETV", "tag": "UPDATE", "tag_color": "#f59e0b",
    },
    {
        "event_date": "2026-06-08",
        "event": "Argentina expands Andes hantavirus investigation in Ushuaia region — probe into animal reservoir and transmission chain at outbreak origin site",
        "cases": 13, "deaths": 3,
        "source": "OCA Academy / CIDRAP", "tag": "UPDATE", "tag_color": "#f59e0b",
    },
    {
        "event_date": "2026-06-09",
        "event": "AAFP medical journal publishes outbreak summary: 65 US passengers monitored, 42-day incubation standard applied across all US states",
        "cases": 13, "deaths": 3,
        "source": "AAFP", "tag": "OFFICIAL", "tag_color": "#3b82f6",
    },
]

res = requests.post(
    f"{SUPABASE_URL}/rest/v1/andes_events",
    headers=HEADERS,
    json=EVENTS,
)

if res.ok:
    print(f"✓ Inserted {len(EVENTS)} events successfully.")
else:
    print(f"✗ Failed: {res.status_code} {res.text}")

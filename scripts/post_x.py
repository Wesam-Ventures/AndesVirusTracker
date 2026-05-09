"""
AndesVirusTracker — X (Twitter) Posting Script
Run: python3 scripts/post_x.py
"""
import os
import time
import requests
from requests_oauthlib import OAuth1Session

X_API_KEY      = os.environ.get("X_API_KEY", "")
X_API_SECRET   = os.environ.get("X_API_SECRET", "")
X_ACCESS_TOKEN = os.environ.get("X_ACCESS_TOKEN", "")
X_ACCESS_SECRET = os.environ.get("X_ACCESS_SECRET", "")

TWEETS = [
    # Tweet 1 — main launch
    "Built a real-time tracker for the Andes hantavirus outbreak from the MV Hondius cruise ship.\n\n8 confirmed cases · 3 deaths · 23 countries monitoring · ~40% fatality rate · no vaccine\n\nUpdates every 15 min from WHO/CDC/ECDC\n\nandesvirustracker.com 🔺",

    # Tweet 2 — visual hook
    "The only hantavirus that spreads person-to-person is now active across 4 continents.\n\nBuilt a 3D globe tracker for it → andesvirustracker.com\n\nAlready being cited by Perplexity AI alongside WHO and CDC. Wild for a 3-day-old site.",

    # Tweet 3 — data angle
    "New on the Andes virus tracker:\n\n• Suspected case: Tristan da Cunha\n• 6 US states monitoring: TX, GA, AZ, VA, CA, NJ\n• Ship (MV Hondius) arriving Tenerife May 10\n• Dutch couple confirmed as origin — contracted in Ushuaia before boarding\n\nandesvirustracker.com — updates every 15 min 🔺",

    # Tweet 4 — AI angle
    "Asked Perplexity about the hantavirus outbreak.\n\nIt cited my site alongside WHO, ECDC, BBC, CNN, and USA Today.\n\nBuilt the site 3 days ago.\n\nandesvirustracker.com",
]

THREAD = [
    "🧵 Built andesvirustracker.com — here's what the Andes virus outbreak actually looks like right now (thread)",
    "The MV Hondius cruise ship left Antarctica in April with an Andes hantavirus cluster. 8 confirmed cases. 3 dead. 40% fatality rate. The only hantavirus that spreads person-to-person.",
    "It's now in 23 countries. A Dutch couple likely caught it bird-watching in Ushuaia BEFORE boarding — meaning the ship wasn't the source, just the amplifier.",
    "There's no vaccine. No antiviral. Treatment is ICU care only. And the 9-33 day incubation window means passengers who already flew home may not know yet.",
    "The tracker updates every 15 min from WHO/CDC/ECDC. Has a personal risk checker, incubation calculator, live 3D globe, and case timeline.\n\nandesvirustracker.com 🔺",
]


def get_oauth():
    return OAuth1Session(
        X_API_KEY,
        client_secret=X_API_SECRET,
        resource_owner_key=X_ACCESS_TOKEN,
        resource_owner_secret=X_ACCESS_SECRET,
    )


def post_tweet(text: str, reply_to: str = None) -> str:
    oauth = get_oauth()
    payload = {"text": text}
    if reply_to:
        payload["reply"] = {"in_reply_to_tweet_id": reply_to}

    resp = oauth.post("https://api.x.com/2/tweets", json=payload)
    if resp.status_code == 201:
        tweet_id = resp.json()["data"]["id"]
        print(f"✅ Posted: {text[:60]}...")
        return tweet_id
    else:
        print(f"❌ Failed ({resp.status_code}): {resp.text}")
        return None


def post_thread(tweets: list[str]):
    reply_to = None
    for tweet in tweets:
        tweet_id = post_tweet(tweet, reply_to=reply_to)
        if tweet_id:
            reply_to = tweet_id
            time.sleep(2)
        else:
            break


if __name__ == "__main__":
    if not all([X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET]):
        print("❌ Set X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET")
        exit(1)

    print("🔺 AndesVirusTracker — X Posting Script")
    print("Choose:\n1. Single tweet\n2. Full thread\n3. All 4 tweets (spaced 2 hrs apart)")
    choice = input("Choice (1/2/3): ").strip()

    if choice == "1":
        print("Pick tweet (1-4):")
        for i, t in enumerate(TWEETS, 1):
            print(f"{i}. {t[:80]}...")
        n = int(input("Number: ")) - 1
        post_tweet(TWEETS[n])

    elif choice == "2":
        post_thread(THREAD)

    elif choice == "3":
        for i, tweet in enumerate(TWEETS):
            post_tweet(tweet)
            if i < len(TWEETS) - 1:
                print("⏳ Waiting 2 hours...")
                time.sleep(7200)

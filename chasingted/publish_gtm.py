from googleapiclient.discovery import build

ACCOUNT_ID = "6359578232"
CONTAINER_ID = "254774171"
WS_PATH = f"accounts/{ACCOUNT_ID}/containers/{CONTAINER_ID}/workspaces/2"

import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

with open("/Users/teddyjansen/.config/gcloud/application_default_credentials.json") as f:
    d = json.load(f)

creds = Credentials(
    token=None,
    refresh_token=d["refresh_token"],
    token_uri="https://oauth2.googleapis.com/token",
    client_id=d["client_id"],
    client_secret=d["client_secret"],
    scopes=d.get("scopes", [
        "https://www.googleapis.com/auth/tagmanager.edit.containers",
        "https://www.googleapis.com/auth/tagmanager.publish",
    ])
)
creds.refresh(Request())
service = build("tagmanager", "v2", credentials=creds)

version = service.accounts().containers().workspaces().create_version(
    path=WS_PATH,
    body={
        "name": "Conversion Tracking v1",
        "notes": "Initial conversion tracking: Apply Now, WhatsApp, Contact Form, Newsletter, Trip Pages. Implemented via Claude ADC."
    }
).execute()

version_path = version["containerVersion"]["path"]
print(f"✓ Version created: {version['containerVersion']['name']}")

result = service.accounts().containers().versions().publish(path=version_path).execute()
print(f"✓ Container published!")
print(f"  Live version: {result['containerVersion']['containerVersionId']}")
print(f"\n✅ GTM container GTM-P7V9CJF3 is now live with all conversion tracking.")

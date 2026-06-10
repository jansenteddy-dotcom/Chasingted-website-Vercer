import google.auth
from googleapiclient.discovery import build
import json

ACCOUNT_ID = "6359578232"
CONTAINER_ID = "254774171"
CONTAINER_PATH = f"accounts/{ACCOUNT_ID}/containers/{CONTAINER_ID}"

creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/tagmanager.readonly"])
service = build("tagmanager", "v2", credentials=creds)

# Get default workspace
workspaces = service.accounts().containers().workspaces().list(parent=CONTAINER_PATH).execute()
print("=== WORKSPACES ===")
for w in workspaces.get("workspace", []):
    print(f"  {w['workspaceId']}: {w['name']}")

workspace_id = workspaces["workspace"][0]["workspaceId"]
workspace_path = f"{CONTAINER_PATH}/workspaces/{workspace_id}"

# List existing tags
print("\n=== EXISTING TAGS ===")
tags = service.accounts().containers().workspaces().tags().list(parent=workspace_path).execute()
for tag in tags.get("tag", []):
    print(f"  [{tag['type']}] {tag['name']} (ID: {tag['tagId']})")
    for p in tag.get("parameter", []):
        if p.get("key") in ["measurementId", "configId", "trackingId"]:
            print(f"    -> {p['key']}: {p.get('value')}")

# List existing triggers
print("\n=== EXISTING TRIGGERS ===")
triggers = service.accounts().containers().workspaces().triggers().list(parent=workspace_path).execute()
for t in triggers.get("trigger", []):
    print(f"  [{t['type']}] {t['name']} (ID: {t['triggerId']})")

# List built-in variables
print("\n=== BUILT-IN VARIABLES ===")
bivars = service.accounts().containers().workspaces().built_in_variables().list(parent=workspace_path).execute()
for v in bivars.get("builtInVariable", []):
    print(f"  {v['type']}: {v['name']}")

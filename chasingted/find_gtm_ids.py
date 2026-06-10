import google.auth
from googleapiclient.discovery import build

creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/tagmanager.readonly"])
service = build("tagmanager", "v2", credentials=creds)

accounts = service.accounts().list().execute()
for account in accounts.get("account", []):
    account_id = account["accountId"]
    account_name = account["name"]
    containers = service.accounts().containers().list(parent=f"accounts/{account_id}").execute()
    for container in containers.get("container", []):
        print(f"Account: {account_name} | Account ID: {account_id} | Container: {container['name']} | Public ID: {container['publicId']} | Container ID: {container['containerId']}")

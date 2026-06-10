import google.auth
from googleapiclient.discovery import build

ACCOUNT_ID = "6359578232"
CONTAINER_ID = "254774171"
WS_PATH = f"accounts/{ACCOUNT_ID}/containers/{CONTAINER_ID}/workspaces/2"

creds, _ = google.auth.default(scopes=[
    "https://www.googleapis.com/auth/tagmanager.edit.containers",
])
service = build("tagmanager", "v2", credentials=creds)

# Load trigger IDs
triggers = service.accounts().containers().workspaces().triggers().list(parent=WS_PATH).execute()
trigger_map = {t["name"]: t["triggerId"] for t in triggers.get("trigger", [])}
print("Triggers found:", list(trigger_map.keys()))

def make_gtag_html(event_name, extra_params: dict) -> str:
    params_js = ", ".join(f"'{k}': '{v}'" for k, v in extra_params.items())
    return f"<script>\ngtag('event', '{event_name}', {{{params_js}}});\n</script>"

def make_tag(name, event_name, trigger_name, params=None):
    trigger_id = trigger_map[trigger_name]
    html = make_gtag_html(event_name, params or {})
    result = service.accounts().containers().workspaces().tags().create(
        parent=WS_PATH,
        body={
            "name": name,
            "type": "html",
            "parameter": [
                {"type": "template", "key": "html", "value": html},
                {"type": "boolean", "key": "supportDocumentWrite", "value": "false"}
            ],
            "firingTriggerId": [str(trigger_id)]
        }
    ).execute()
    print(f"✓ Tag created: {name}")
    return result

make_tag(
    "GA4 - apply_now_clicked", "apply_now_clicked", "Click - Apply Now",
    {"click_location": "{{Page URL}}", "button_text": "{{Click Text}}"}
)
make_tag(
    "GA4 - whatsapp_clicked", "whatsapp_clicked", "Click - WhatsApp",
    {"click_location": "{{Page URL}}", "button_label": "{{Click Text}}"}
)
make_tag(
    "GA4 - email_link_clicked", "email_link_clicked", "Click - Email",
    {"click_location": "{{Page URL}}"}
)
make_tag(
    "GA4 - application_submitted", "application_submitted", "Form Submit - Join Us",
    {"page_location": "{{Page URL}}"}
)
make_tag(
    "GA4 - contact_form_submitted", "contact_form_submitted", "Form Submit - Contact",
    {"page_location": "{{Page URL}}"}
)
make_tag(
    "GA4 - newsletter_signup", "newsletter_signup", "Form Submit - Newsletter",
    {"page_location": "{{Page URL}}"}
)
make_tag(
    "GA4 - trip_page_viewed", "trip_page_viewed", "Page View - Trip Pages",
    {"page_location": "{{Page URL}}"}
)

print("\n✅ All 7 GA4 event tags created successfully!")

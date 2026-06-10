import google.auth
from googleapiclient.discovery import build

ACCOUNT_ID = "6359578232"
CONTAINER_ID = "254774171"
GA4_ID = "G-2DEC87PY9P"
CONTAINER_PATH = f"accounts/{ACCOUNT_ID}/containers/{CONTAINER_ID}"

creds, _ = google.auth.default(scopes=[
    "https://www.googleapis.com/auth/tagmanager.edit.containers",
    "https://www.googleapis.com/auth/tagmanager.publish"
])
service = build("tagmanager", "v2", credentials=creds)

# Use Default Workspace (ID: 2)
WS_PATH = f"{CONTAINER_PATH}/workspaces/2"
print(f"Using workspace: {WS_PATH}\n")

# ── STEP 1: Enable built-in variables ────────────────────────────────────────
needed_vars = [
    "clickUrl", "clickText", "clickElement",
    "clickClasses", "clickId", "clickTarget",
    "formUrl", "formElement", "formTarget"
]
service.accounts().containers().workspaces().built_in_variables().create(
    parent=WS_PATH, type=needed_vars
).execute()
print("✓ Built-in variables enabled: Click URL, Click Text, Form URL, etc.")

# ── STEP 2: Create All Pages trigger ─────────────────────────────────────────
all_pages = service.accounts().containers().workspaces().triggers().create(
    parent=WS_PATH,
    body={"name": "All Pages", "type": "PAGEVIEW"}
).execute()
all_pages_id = all_pages["triggerId"]
print(f"✓ Trigger: All Pages (ID: {all_pages_id})")

# ── STEP 3: Create Google Tag (GA4 Configuration) ────────────────────────────
google_tag = service.accounts().containers().workspaces().tags().create(
    parent=WS_PATH,
    body={
        "name": f"Google Tag - {GA4_ID}",
        "type": "googtag",
        "parameter": [
            {"type": "template", "key": "tagId", "value": GA4_ID},
            {"type": "list", "key": "configSettingsTable", "list": []}
        ],
        "firingTriggerId": [all_pages_id]
    }
).execute()
print(f"✓ Tag: Google Tag - {GA4_ID}")

# ── STEP 4: Create conversion triggers ───────────────────────────────────────
def make_click_trigger(name, url_contains=None, text_contains=None, url_starts=None):
    conditions = []
    if url_contains:
        conditions.append({
            "type": "CONTAINS",
            "parameter": [
                {"type": "template", "key": "arg0", "value": "{{Click URL}}"},
                {"type": "template", "key": "arg1", "value": url_contains}
            ]
        })
    if text_contains:
        conditions.append({
            "type": "CONTAINS",
            "parameter": [
                {"type": "template", "key": "arg0", "value": "{{Click Text}}"},
                {"type": "template", "key": "arg1", "value": text_contains}
            ]
        })
    if url_starts:
        conditions.append({
            "type": "STARTS_WITH",
            "parameter": [
                {"type": "template", "key": "arg0", "value": "{{Click URL}}"},
                {"type": "template", "key": "arg1", "value": url_starts}
            ]
        })
    t = service.accounts().containers().workspaces().triggers().create(
        parent=WS_PATH,
        body={"name": name, "type": "LINK_CLICK", "filter": conditions,
              "waitForTags": {"type": "boolean", "key": "waitForTags", "value": "false"},
              "checkValidation": {"type": "boolean", "key": "checkValidation", "value": "false"},
              "waitForTagsTimeout": {"type": "template", "key": "waitForTagsTimeout", "value": "2000"}}
    ).execute()
    print(f"✓ Trigger: {name} (ID: {t['triggerId']})")
    return t["triggerId"]

def make_all_click_trigger(name, text_contains):
    t = service.accounts().containers().workspaces().triggers().create(
        parent=WS_PATH,
        body={
            "name": name,
            "type": "CLICK",
            "filter": [{
                "type": "CONTAINS",
                "parameter": [
                    {"type": "template", "key": "arg0", "value": "{{Click Text}}"},
                    {"type": "template", "key": "arg1", "value": text_contains}
                ]
            }],
            "waitForTags": {"type": "boolean", "key": "waitForTags", "value": "false"},
            "checkValidation": {"type": "boolean", "key": "checkValidation", "value": "false"},
            "waitForTagsTimeout": {"type": "template", "key": "waitForTagsTimeout", "value": "2000"}
        }
    ).execute()
    print(f"✓ Trigger: {name} (ID: {t['triggerId']})")
    return t["triggerId"]

def make_form_trigger(name, page_contains):
    t = service.accounts().containers().workspaces().triggers().create(
        parent=WS_PATH,
        body={
            "name": name,
            "type": "FORM_SUBMISSION",
            "filter": [{
                "type": "CONTAINS",
                "parameter": [
                    {"type": "template", "key": "arg0", "value": "{{Page URL}}"},
                    {"type": "template", "key": "arg1", "value": page_contains}
                ]
            }],
            "waitForTags": {"type": "boolean", "key": "waitForTags", "value": "false"},
            "checkValidation": {"type": "boolean", "key": "checkValidation", "value": "true"},
            "waitForTagsTimeout": {"type": "template", "key": "waitForTagsTimeout", "value": "2000"}
        }
    ).execute()
    print(f"✓ Trigger: {name} (ID: {t['triggerId']})")
    return t["triggerId"]

def make_page_trigger(name, page_contains):
    t = service.accounts().containers().workspaces().triggers().create(
        parent=WS_PATH,
        body={
            "name": name,
            "type": "PAGEVIEW",
            "filter": [{
                "type": "CONTAINS",
                "parameter": [
                    {"type": "template", "key": "arg0", "value": "{{Page URL}}"},
                    {"type": "template", "key": "arg1", "value": page_contains}
                ]
            }]
        }
    ).execute()
    print(f"✓ Trigger: {name} (ID: {t['triggerId']})")
    return t["triggerId"]

t_apply     = make_all_click_trigger("Click - Apply Now", "Apply Now")
t_whatsapp  = make_click_trigger("Click - WhatsApp", url_contains="wa.me")
t_email     = make_click_trigger("Click - Email", url_starts="mailto:")
t_joinus    = make_form_trigger("Form Submit - Join Us", "join-us")
t_contact   = make_form_trigger("Form Submit - Contact", "contact")
t_newsletter= make_form_trigger("Form Submit - Newsletter", "newsletter")
t_trips     = make_page_trigger("Page View - Trip Pages", "/trips/")

# ── STEP 5: Create GA4 Event tags ────────────────────────────────────────────
def make_ga4_tag(name, event_name, trigger_id, params=None):
    parameters = [
        {"type": "template", "key": "eventName", "value": event_name},
    ]
    if params:
        parameters.append({
            "type": "list", "key": "eventParameters",
            "list": [
                {"type": "map", "map": [
                    {"type": "template", "key": "name",  "value": k},
                    {"type": "template", "key": "value", "value": v}
                ]} for k, v in params.items()
            ]
        })
    service.accounts().containers().workspaces().tags().create(
        parent=WS_PATH,
        body={
            "name": name,
            "type": "gaawe",
            "parameter": parameters,
            "firingTriggerId": [str(trigger_id)]
        }
    ).execute()
    print(f"✓ Tag: {name}")

print()
make_ga4_tag("GA4 - apply_now_clicked",      "apply_now_clicked",      t_apply,
             {"click_location": "{{Page URL}}", "button_text": "{{Click Text}}"})

make_ga4_tag("GA4 - whatsapp_clicked",       "whatsapp_clicked",       t_whatsapp,
             {"click_location": "{{Page URL}}", "button_label": "{{Click Text}}"})

make_ga4_tag("GA4 - email_link_clicked",     "email_link_clicked",     t_email,
             {"click_location": "{{Page URL}}"})

make_ga4_tag("GA4 - application_submitted",  "application_submitted",  t_joinus,
             {"page_location": "{{Page URL}}"})

make_ga4_tag("GA4 - contact_form_submitted", "contact_form_submitted", t_contact,
             {"page_location": "{{Page URL}}"})

make_ga4_tag("GA4 - newsletter_signup",      "newsletter_signup",      t_newsletter,
             {"page_location": "{{Page URL}}"})

make_ga4_tag("GA4 - trip_page_viewed",       "trip_page_viewed",       t_trips,
             {"page_location": "{{Page URL}}"})

print("\n✅ All done! 8 tags + 8 triggers created in GTM.")
print("Next: open GTM Preview Mode to test, then publish the container.")

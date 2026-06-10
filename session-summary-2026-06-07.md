# Claude Code Session Summary — 7 June 2026

## What We Did

### 1. Installed the Marketing Skills Plugin
- **Source:** https://github.com/coreyhaines31/marketingskills
- **Author:** Corey Haines
- **Version:** 2.3.0
- **Status:** Installed and enabled

This adds 43 marketing-focused skills to Claude Code, including:
- Copywriting, CRO, and landing page optimization
- Google Ads, Meta Ads, and ad creative
- SEO, AI SEO, programmatic SEO, and site architecture
- Cold email, prospecting, and sales enablement
- Email sequences, social media, SMS, and video
- Pricing strategy, referrals, churn prevention, and more

**How it was installed:**
1. Registered `coreyhaines31/marketingskills` as a plugin marketplace
2. Installed `marketing-skills@marketingskills` via `claude plugins install`

**To use a skill:** Type `/skill-name` (e.g. `/copywriting`, `/cro`, `/ads`) in Claude Code.

---

### 2. Connected WordPress MCP Server (chasingted.com)
- **Site:** https://chasingted.com
- **Username:** jansen.teddy@gmail.com
- **MCP Package:** `@automattic/mcp-wordpress-remote@latest`
- **Status:** Added to Claude config — restart required to activate

This allows Claude Code to read and write directly to your WordPress site (posts, pages, settings, etc.) without copy-pasting.

**Config saved to:** `/Users/teddyjansen/.claude.json`

**Action needed before using:**
- Restart Claude Code to activate the WordPress connection
- Install the companion WordPress plugin on chasingted.com (required by Automattic's MCP package — search for "WP-MCP" in your WordPress plugin directory)
- Consider regenerating your WordPress Application Password (the one used today appeared in the chat — generate a new one at: chasingted.com/wp-admin → Users → Profile → Application Passwords)

---

## Things To Do After This Session

- [ ] Restart Claude Code (both plugin and WordPress MCP need a restart to load)
- [ ] Install the WP-MCP WordPress plugin on chasingted.com
- [ ] Regenerate the WordPress Application Password and update it in Claude
- [ ] Test the WordPress connection by asking Claude to list your recent posts
- [ ] Try a marketing skill — e.g. ask Claude to use `/copywriting` on a product page

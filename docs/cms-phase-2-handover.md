# CMS Phase 2 handover

This document is the handover brief for the future Code session that will activate external contributor access. It is written for that session specifically — it assumes no context from Phase 1 beyond what is written here.

---

## Phase 1 acceptance state

Phase 1 was completed on 2026-06-25. The following was validated:

- `pnpm cms:proxy` starts the Decap proxy on port 8081
- `pnpm dev` runs the Astro dev server on `localhost:4328`
- `localhost:4328/admin/` loads the Decap CMS UI with no login screen
- The proxy backend is configured in `public/admin/config.yml` with `backend.name: proxy`
- Two collections are defined: **Articles** (MDX in `src/content/articles/`) and **Contributors** (JSON in `src/data/contributors.json`)
- `pnpm build` exits 0 with the Phase 1 config
- `decap-server@3.9.1` is installed as a devDependency
- The `cms:proxy` npm script runs the proxy

**What was not validated in Phase 1:**
- End-to-end create → draft branch → merge → live flow (requires Phase 2 backend)
- Login with email/password (skipped in Phase 1 — local mode has no auth)
- Image upload in the CMS (not tested against the proxy in Phase 1 — validated by schema only)

---

## What changes in Phase 2

Two files change. Nothing else:

### 1. `public/admin/config.yml` — backend section

**Phase 1 (current):**
```yaml
backend:
  name: proxy
  proxy_url: http://localhost:8081/api/v1
  branch: main
```

**Phase 2 (replace with):**
```yaml
backend:
  name: git-gateway
  branch: main
```

Remove the `proxy_url` line. Remove the `local_backend: true` line if present. Everything else in `config.yml` stays unchanged.

### 2. `public/admin/index.html` — add Netlify Identity widget

**Phase 1 (current):**
```html
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
```

**Phase 2 (add identity widget before decap-cms.js):**
```html
<body>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
```

---

## Operator mid-session steps (Phase 2 only)

These require the operator's Netlify and GitHub accounts. They block the Code session — pause and ask the operator to complete them before continuing.

**Step O1 — Create a Netlify project as the identity provider:**
- Log in to [app.netlify.com](https://app.netlify.com) (create a free account if needed)
- Click **Add new site** → **Import an existing project** → connect GitHub
- Select `biso2005/naturalcurlyhair`
- Set build command to `echo ok` and publish directory to `dist`
- This project is the identity host — it will not be used for serving the live site

**Step O2 — Enable Netlify Identity and git-gateway:**
- On the Netlify project → **Identity** → **Enable Identity**
- Under **Registration**, set to **Invite only** (not open)
- Under **Identity** → **Services** → **Git Gateway** → **Enable Git Gateway**
- When prompted for a GitHub personal access token: generate one with `repo` scope at [github.com/settings/tokens](https://github.com/settings/tokens) and paste it in

**Step O3 — Invite the operator as the first user:**
- Identity → **Invite users** → enter your email
- Accept the invite email and set a password
- Log in at `naturalcurlyhair.co.uk/admin/` to confirm

---

## Phase 2 acceptance gate

Phase 2 is not complete until ALL of the following:

- [ ] `/admin/` loads at the live URL and shows Netlify Identity login
- [ ] Operator can log in with the email/password set during invite
- [ ] Creating a new article via Decap creates a draft branch in GitHub (`cms/articles/slug-name`)
- [ ] The branch is visible as a PR in GitHub
- [ ] Moving article to Ready updates the PR state
- [ ] Merging the PR triggers a Cloudflare Pages deployment
- [ ] Article appears on the live site within 3 minutes of merge
- [ ] Image upload works — image lands in `public/uploads/`
- [ ] Contributors collection edits write correctly to `src/data/contributors.json`
- [ ] `pnpm build` exits 0 after a test article is created and merged

---

## Decisions deferred from Phase 1 to Phase 2

**git-gateway deprecation.** Netlify deprecated git-gateway in 2024. It continues to function for existing setups. If git-gateway instability becomes a problem, the migration path is:

> Replace git-gateway + Netlify Identity with a direct GitHub OAuth backend + a Cloudflare Workers OAuth proxy. Requires: (1) a GitHub OAuth App registration, (2) a ~30-line Cloudflare Worker handling the OAuth callback, (3) updating `config.yml` `backend.name` to `github` and pointing `base_url` at the Worker URL. Contributors would log in with GitHub accounts rather than email/password. Trigger when: contributor count exceeds ~5, or Netlify Identity availability is a recurring problem.

**When to trigger Phase 2.** Phase 2 adds external auth and is needed when the first non-operator contributor is ready to start. Trigger conditions:
- First external contributor is ready to write
- Or: local-only editing becomes inconvenient (e.g., editing on a second machine)

---

## Migration risks

**In-flight drafts during cutover.** Phase 1 drafts are uncommitted MDX files in the working tree — they are not on any branch and will not be included in a Phase 2 PR flow unless committed first. Before switching the backend, commit any in-progress drafts as regular commits to `main`, or accept that they must be re-entered via Decap after Phase 2 activates.

**contributors.json shape.** The existing `contributors.json` has `initials` and `colour` fields (added by the homepage v1 session) that are not in the original spec. The Decap contributors schema in `config.yml` includes both fields as optional to match the committed shape. When adding entries via Decap, `initials` and `colour` are optional — omitting them will not break the homepage component (the EditorialSignature component reads them but falls back gracefully).

---

## Files owned by the CMS setup

```
public/admin/config.yml       — Decap config (schema + backend)
public/admin/index.html       — Decap loader
docs/cms-contributor-guide.md — Contributor onboarding
docs/cms-admin-runbook.md     — Operator reference
docs/cms-phase-2-handover.md  — This file
package.json                  — decap-server devDependency + cms:proxy script
src/content.config.ts         — Additive CMS fields (draft, confidence_grade, contributor_id)
```

Do not touch: `src/pages/index.astro`, `src/components/homepage/**`, `src/data/homepage_copy.json`, `src/lib/latestArticles.ts`, `src/lib/dynamicPanel.ts`.

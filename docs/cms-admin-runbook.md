# CMS admin runbook

Operator reference for running and managing the Decap CMS setup.

---

## Phase 1: running the CMS locally

You need two terminal windows open simultaneously.

**Terminal 1 — Decap proxy server:**
```bash
pnpm cms:proxy
```
Expected output:
```
info: Decap CMS File System Proxy Server configured with /path/to/naturalcurlyhair
info: Decap CMS Proxy Server listening on port 8081
```

**Terminal 2 — Astro dev server:**
```bash
pnpm dev
```

Then open: `http://localhost:4328/admin/`

The CMS loads with no login screen — local proxy mode skips authentication. You are editing the real working tree directly.

---

## How Decap writes files in Phase 1

- **New articles** are written to `src/content/articles/{slug}.mdx`
- **Images** are written to `public/uploads/`
- **Contributor changes** are written to `src/data/contributors.json`
- No branches are created — changes land directly on the working tree
- Run `git status` after editing to see what Decap has changed
- Review the diff (`git diff`) before committing
- Commit manually: `git add -p && git commit -m "content: [description]"`

The editorial workflow states (Draft / In Review / Ready) are visible in the UI but do not trigger Git operations in Phase 1.

---

## How to add a new contributor (Phase 1)

Edit `src/data/contributors.json` directly, or use the CMS:

1. Open `localhost:4328/admin/`
2. Click **Contributors** in the left sidebar
3. Click **All contributors**
4. Scroll to the bottom and click **Add contributors**
5. Fill in the fields (ID, Name, Role — minimum; Bio recommended)
6. Click **Save**
7. Decap writes the updated JSON to `src/data/contributors.json`
8. Run `git diff src/data/contributors.json` to review the change
9. Commit: `git add src/data/contributors.json && git commit -m "content: add contributor [name]"`

**Operator-as-first-contributor:** Before the workflow can be tested end-to-end, you need a real entry in `contributors.json` for yourself. The current file has placeholders only. Suggested record (revise before adding):

```json
{
  "id": "darren",
  "name": "Darren",
  "role": "Editor",
  "initials": "DC",
  "bio": "[write your bio here — max 300 characters]",
  "active": true
}
```

Add this via the CMS or edit `src/data/contributors.json` directly, then commit. Once committed, your name will appear in the Contributor dropdown when creating articles.

---

## How to review what Decap has written

After creating or editing content in the CMS:

```bash
git status          # see which files changed
git diff            # see the content of changes
pnpm build          # confirm the new content builds cleanly
```

If `pnpm build` fails after a Decap edit, the most likely cause is invalid frontmatter (a field type mismatch against the schema in `src/content.config.ts`). Read the error — it will name the file and the field.

---

## How to handle a draft that is not ready to publish

Leave the `draft: true` field set in frontmatter. The Astro build does not exclude drafts automatically — the `draft` field is informational in Phase 1. The article will still build and render locally.

To actually hide it from the live site: do not commit the MDX file to `main`. Keep it on a local branch or leave it uncommitted until it is ready.

---

## Troubleshooting

**The proxy is not responding / `localhost:4328/admin/` shows a config error.**
1. Check Terminal 1 — the proxy must be running and show "listening on port 8081"
2. If port 8081 is already in use: `fuser -k 8081/tcp` then restart the proxy
3. Hard-refresh the browser (Ctrl+Shift+R)

**The CMS loads but shows no collections.**
Confirm `public/admin/config.yml` has `backend.name: proxy` and `proxy_url: http://localhost:8081/api/v1`. If you see an auth error, the proxy is not running.

**An article I saved in the CMS is not appearing in `src/content/articles/`.**
Check that `pnpm cms:proxy` is still running in the terminal — if it crashed, files are not being written. Restart it and try saving again.

**`pnpm build` fails after a Decap edit.**
Read the error output. Common causes:
- Missing required field in frontmatter (e.g., `hub` is required)
- Invalid enum value (e.g., `hub` value not in the allowed list)
- Invalid date format (should be `YYYY-MM-DD`)

Fix the MDX file directly and run `pnpm build` again.

---

## Phase 2: switching to external access

Phase 2 replaces the proxy backend with git-gateway + Netlify Identity, activating external contributor access at `naturalcurlyhair.co.uk/admin/`.

The change is two files:
1. `public/admin/config.yml` — change `backend.name` from `proxy` to `git-gateway`
2. `public/admin/index.html` — add the Netlify Identity widget script tag

Everything else (the schema, the collections, the editorial workflow) stays the same.

See [docs/cms-phase-2-handover.md](cms-phase-2-handover.md) for the full migration brief.

# CMS admin runbook

This is the operator's reference for managing contributors, reviewing content, and handling incidents in the Decap CMS setup for naturalcurlyhair.co.uk.

---

## Quick reference

| Task | Where |
|---|---|
| Netlify Identity dashboard | [app.netlify.com](https://app.netlify.com) → your project → Identity |
| Cloudflare Pages deploy log | [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → naturalcurlyhair → Deployments |
| CMS interface | [naturalcurlyhair.co.uk/admin/](https://naturalcurlyhair.co.uk/admin/) |
| GitHub pull requests | [github.com/biso2005/naturalcurlyhair/pulls](https://github.com/biso2005/naturalcurlyhair/pulls) |

---

## How to invite a new contributor

1. Log in to [app.netlify.com](https://app.netlify.com)
2. Select the project you created as the identity provider (not Cloudflare Pages — the Netlify project created specifically for Identity)
3. Go to **Identity** in the left sidebar
4. Click **Invite users**
5. Enter the contributor's email address and click **Send**
6. The contributor receives an email from Netlify with a link to set their password
7. Once they have accepted, their account appears in the Identity users list

After inviting, add their contributor record to `src/data/contributors.json` via the CMS (Contributors → All contributors → Add contributors), then merge that change so their name appears in the Contributor dropdown on new articles.

---

## How to revoke a contributor

1. Log in to [app.netlify.com](https://app.netlify.com) → your project → **Identity**
2. Find the contributor in the users list
3. Click their name → click **Delete user**
4. Confirm deletion

This removes their login access immediately. Their existing articles are unaffected. Their contributor record in `src/data/contributors.json` remains — set their `active` field to `false` via the CMS if you want to hide them from byline dropdowns without deleting their record.

---

## How to review a pull request raised by Decap

When a contributor moves an article to **In Review** or **Ready**, Decap creates a branch and a pull request in GitHub.

**Branch naming:** Decap uses the pattern `cms/articles/article-slug` for editorial-workflow drafts.

**To review:**

1. Go to [github.com/biso2005/naturalcurlyhair/pulls](https://github.com/biso2005/naturalcurlyhair/pulls)
2. Open the PR — the title will match the article title
3. Click **Files changed** to see the MDX frontmatter and body
4. Read the article in full
5. Check against the voice rules and content standards (see contributor guide)
6. If approved: click **Merge pull request** → **Confirm merge**
7. Cloudflare Pages detects the push and rebuilds — the article is live within ~2 minutes

**What to check before merging:**

- [ ] Banned words absent from headings, dek, standfirst, and callouts
- [ ] Sources named — no unsourced claims
- [ ] Alt text present on any uploaded images
- [ ] `draft: false` in the frontmatter (or confirm this is intentional if `true`)
- [ ] `confidence_grade` set for diagnostic or method pieces
- [ ] `contributor_id` set and references a real contributor entry
- [ ] No hardcoded prices or product stock claims that may go stale quickly

---

## How to handle a draft that should be rejected

1. Open the pull request in GitHub
2. Leave a review comment with specific notes on what needs to change
3. Click **Close pull request** (do not merge)
4. Contact the contributor directly with your notes
5. The contributor makes edits in the CMS and moves the article back to **In Review**
6. A new PR is opened — review again from step 1

Closing a PR does not delete the draft. The contributor's work is preserved on the Decap branch.

---

## Verifying a Cloudflare Pages rebuild

After merging a PR:

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → your project → **Deployments**
2. A new deployment should appear with status **In progress**
3. Wait for status to change to **Success** (typically 1–2 minutes)
4. Open the live site and verify the article or change is present

If the deployment fails, click the deployment in the list to see the build log. Common causes: a Zod validation error in `content.config.ts` (check the new article's frontmatter), or a missing required field. Fix the MDX file directly in GitHub if needed and push — this triggers a new build.

---

## Resetting a contributor's password

You cannot do this directly — Netlify handles password resets.

Options:
1. Ask the contributor to click **Forgot password** on the Netlify Identity login screen (they will receive a reset email)
2. Or: go to Identity → find the contributor → click their name → **Send password reset email**

---

## Recovery: what to do if Netlify Identity goes down

If Netlify Identity is unavailable:

- **Readers are unaffected.** The live site on Cloudflare Pages does not depend on Netlify at runtime. Only `/admin/` is broken.
- Contributors will see an error when trying to log in to the CMS. Ask them to wait and try again.
- You can still push MDX files directly to GitHub to publish articles — the CMS is a convenience layer, not a hard dependency.

**Status page:** [netlifystatus.com](https://www.netlifystatus.com)

**If downtime becomes frequent or Netlify Identity becomes unreliable**, the migration path is:

> V2: Replace git-gateway + Netlify Identity with a direct GitHub OAuth backend backed by a Cloudflare Worker acting as the OAuth proxy. This removes the Netlify dependency entirely and requires: (1) registering a GitHub OAuth App, (2) deploying a ~30-line Cloudflare Worker to handle the OAuth callback, (3) updating `config.yml` `backend.name` from `git-gateway` to `github` and pointing `base_url` at the Worker. Contributors would then log in with GitHub accounts rather than email/password. Trigger this migration when contributor count exceeds ~5 or when Netlify Identity availability becomes a recurring issue.

**Note:** git-gateway is deprecated by Netlify as of 2024. It continues to function for existing setups. The v2 migration above is the recommended long-term path.

---

## Adding the operator as a contributor

Before the editorial workflow can be tested end-to-end, the operator needs a contributor record in `src/data/contributors.json`. The existing entries are placeholders.

Suggested record (revise as needed before adding):

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

Add this via the CMS (Contributors → All contributors → Add contributors) or directly by editing `src/data/contributors.json` in GitHub. Merge the change. Your name will then appear in the Contributor dropdown when creating articles.

---

## Acceptance gate checklist

Use this to confirm the CMS setup is working end-to-end after initial deployment:

- [ ] `/admin/` loads and shows Netlify Identity login
- [ ] Operator can log in with invited email and password
- [ ] Creating a new article via the CMS creates a draft branch in GitHub
- [ ] The branch is visible as a PR in GitHub with `cms/articles/` branch naming
- [ ] Moving the article to Ready updates the PR correctly
- [ ] Merging the PR triggers a Cloudflare Pages deployment
- [ ] The article appears on the live site within 3 minutes of merge
- [ ] Image upload works — image lands in `public/uploads/`
- [ ] Alt text field is enforced as required when an image is uploaded
- [ ] Contributors collection can be edited via the CMS and writes correctly to `src/data/contributors.json`
- [ ] `pnpm build` exits 0 after a test article is added

---

## Operator mid-session steps (initial setup only)

These steps require your Netlify and GitHub accounts. They are done once, at setup time.

**Step O1 — Create the Netlify project:**
- Log in to [app.netlify.com](https://app.netlify.com) (create a free account if needed)
- Click **Add new site** → **Import an existing project** → connect GitHub
- Select the `biso2005/naturalcurlyhair` repo
- Set build command to anything (e.g. `echo ok`) and publish directory to `dist`
- This project will not be used for hosting — it exists only as the Netlify Identity provider

**Step O2 — Enable Netlify Identity and git-gateway:**
- On the new Netlify project → **Identity** → **Enable Identity**
- Under **Registration**, set to **Invite only** (do not allow open registration)
- Under **Identity** → **Services** → **Git Gateway** → click **Enable Git Gateway**
- When prompted, provide a GitHub personal access token with `repo` scope

**Step O3 — Invite yourself:**
- Identity → **Invite users** → enter your email
- Accept the invite email and set a password
- Log in at [naturalcurlyhair.co.uk/admin/](https://naturalcurlyhair.co.uk/admin/) to confirm it works

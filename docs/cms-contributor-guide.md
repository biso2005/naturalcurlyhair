# CMS contributor guide

> **Phase 1 note:** This guide describes the production workflow. The CMS is currently running in local-only mode for development; full external access activates in Phase 2.

This guide is for contributors who write or review articles on naturalcurlyhair.co.uk. You do not need a GitHub account or any technical knowledge. Everything happens through a form-based editor.

---

## How to access the CMS

**Phase 1 (local development):** The editor needs to run two processes on their machine, then open the CMS in a browser. See the [admin runbook](cms-admin-runbook.md) for how to start them.

**Phase 2 (production):** Go to [naturalcurlyhair.co.uk/admin/](https://naturalcurlyhair.co.uk/admin/). You will receive a login invite by email before your first session.

---

## How to write a new article

From the CMS dashboard, click **Articles** in the left sidebar, then click **New Article** in the top right.

You will see a form on the left and a preview pane on the right. Fill in each field:

### Title
The article headline. Sentence case. No banned words (see [Voice rules](#voice-rules)).

### Hub
Which section of the site this article belongs to. Choose from the dropdown. Most articles will be **Hair Care**, or a specific curl type (e.g. **Coils — 4c**).

### Category
A short descriptor for the type of piece. Use one of: `Method`, `Diagnostic`, `Verdict`, `UK context`, `FAQ`. Do not invent new categories without checking with the admin.

### Dek (article summary)
One sentence that appears beneath the title in article lists. Max 160 characters.

### Published date
The date the article goes live. Set to today if publishing now.

### Updated date
Leave blank for new articles. Fill in when making significant changes to a published article.

### Read time
Optional. Write e.g. `7 min`. Leave blank otherwise.

### Featured
Leave as **false** unless the admin has asked you to feature this on the homepage.

### Tested
Tick only if you have personally tested every product mentioned.

### Draft
Leave as **true** until the article is ready to publish.

### Confidence grade
How strong is the evidence behind this piece?
- **High** — peer-reviewed research or strong professional consensus
- **Medium** — reasonable agreement among practitioners, plausible but limited evidence
- **Low** — community observation, anecdote, or early-stage evidence

If you are not sure, choose **Medium** and note the uncertainty in the article body.

### Contributor
Select your name from the dropdown. This links the article to your byline. If your name does not appear, contact the admin.

### Hero image
Upload an image for the top of the article. See [Image guidelines](#image-guidelines) below.

### Hero image alt text
Required if you upload a hero image. Describe what the image literally shows. Good: `Close-up of 4c coils with visible shrinkage, natural light.` Bad: `Beautiful natural hair.`

### Hero image credit
Credit the photographer or source if the image is not your own: `Photo: Unsplash / Ime Nse`.

### Standfirst
A 1–2 sentence intro shown beneath the title on the article page.

### Short answer
A 40–60 word direct answer to the article's main question. Shown in a highlighted box at the top of the article.

### Body
The article itself, written in Markdown. See [Writing in Markdown](#writing-in-markdown) below.

### Products
Optional. Only fill in if the article includes product verdicts. Add one entry per product with name, brand, verdict, price, and buy URL.

---

## Image guidelines

- Maximum file size: 500 KB. Compress large photos at [squoosh.app](https://squoosh.app) before uploading.
- Preferred formats: JPEG or WebP. Avoid PNG for photographs.
- Preferred dimensions: at least 1200 px on the longest side.
- All images land in `/uploads/` on the site.
- Alt text is required on every image.

---

## Writing in Markdown

The body field uses Markdown:

```
## Section heading

### Sub-heading

**Bold text**

*Italic text*

- Bullet point

1. Numbered item

[Link text](https://example.com)

> Block quote
```

Do not use `#` (H1) headings in the body — the article title is the H1. Start body sections with `##`.

---

## Voice rules

Write for a real person who is frustrated with their hair and wants a straight answer.

**Do:**
- Open with something concrete — a real scenario, a number, a specific problem
- Answer the question directly in the first paragraph
- Use the words readers actually use — if they say "shrinkage", write "shrinkage"
- Name sources and attribute claims
- Say "save your money" when a product does not earn a recommendation
- Use UK spelling, UK product availability, UK prices

**Banned words** — do not use these in headings, deks, standfirsts, or highlighted callouts:

`honest` · `trusted` · `ultimate` · `comprehensive` · `definitive` · `expert` (as a self-label) · `genuine` · `transparent` · `unbiased` · `authentic`

`honest` / `honestly` are permitted in body prose; banned in labels and headings only.

**Do not:**
- Write throat-clearing openers ("In today's world…")
- Use filler phrases: "dive in", "game-changer", "let's explore", "it's important to note"
- Both-sides an issue that has a clear answer
- Invent sources — flag gaps with `[TODO: source needed]` instead

Write in British English: `moisturiser`, `colour`, `flavour`.

---

## How drafts work

The action button is labelled **Publish now** — this writes your article to disk. It does not make it live on the site. Whether the article is live depends on the **Draft** toggle in the form.

- **Draft toggle ON (blue)** → article is saved but excluded from the live site. Use this while writing.
- **Draft toggle OFF (grey)** → article will appear on the live site after the next build and deploy.

Always check the Draft toggle before clicking "Publish now". When you are finished writing and the article is ready for review, leave Draft ON and notify the editor. The editor will turn Draft OFF and publish when ready.

**Phase 1 note:** In local mode, state changes do not create Git branches — files are written directly to the working tree. The branching behaviour activates in Phase 2.

---

## What happens after you move an article to Ready

**Phase 2 (production):**
1. Admin opens the pull request in GitHub and reads the article
2. If approved: admin merges → site rebuilds → article live within ~2 minutes
3. If changes needed: admin closes the PR and contacts you → move back to **Drafts**, revise, move to **In Review** again

---

## Common gotchas

**My article is not appearing on the live site.**
Check the `draft` field — it must be set to `false` and the article must have been merged to `main`.

**I uploaded an image but it is not showing.**
Check the hero image alt text field — it is required. Also check the file size is under 500 KB.

**The Markdown is not rendering correctly.**
Open the preview pane. Common mistakes: missing a blank line before a heading, using `#` instead of `##`, unclosed `**`.

**The Contributor dropdown shows no results.**
Your contributor record has not been added yet. Contact the admin.

**MDX vs Markdown — what is the difference?**
For most contributors, no practical difference. Write in the Body editor and use the toolbar. Custom components are added by the admin.

---

*Questions? Contact the site admin.*

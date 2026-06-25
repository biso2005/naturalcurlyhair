# CMS contributor guide

This guide is for contributors who write or review articles on naturalcurlyhair.co.uk. You do not need a GitHub account or any technical knowledge. Everything happens through a form-based editor at `/admin/`.

---

## Before you start: your invite email

The admin sends you an invite to the email address you provided. The email comes from Netlify and has a subject line like *"You've been invited to join naturalcurlyhair.co.uk"*.

Click **Accept the invite** in the email. You will be taken to a page where you set a password. Save it somewhere secure — you will use it every time you log in.

You will not receive a second invite if you lose access. Contact the admin to reset your password.

---

## How to log in

1. Go to [naturalcurlyhair.co.uk/admin/](https://naturalcurlyhair.co.uk/admin/)
2. A login prompt appears — click **Log in with Netlify Identity**
3. Enter the email address the invite was sent to and the password you set
4. You will be taken to the CMS dashboard

If the login prompt does not appear, try a hard refresh (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac). If it still does not appear, contact the admin.

---

## How to write a new article

From the dashboard, click **Articles** in the left sidebar, then click **New Article** in the top right.

You will see a form on the left and a preview pane on the right. Fill in each field:

### Title
The article headline. Sentence case. No banned words (see [Voice rules](#voice-rules)).

### Hub
Which section of the site this article belongs to. Choose from the dropdown. Most articles will be **Hair Care**, or a specific curl type (e.g. **Coils — 4c**).

### Category
A short descriptor for the type of piece. Use one of: `Method`, `Diagnostic`, `Verdict`, `UK context`, `FAQ`. Do not invent new categories without checking with the admin.

### Dek (article summary)
One sentence that appears beneath the title in article lists. Max 160 characters. This is the list-view hook — not the standfirst.

### Published date
The date the article goes live. Set to today if you are publishing now.

### Updated date
Leave blank for new articles. Update this when you make a significant change to a published article.

### Read time
Optional. Write e.g. `7 min` if you want to set it manually. Leave blank otherwise.

### Featured
Leave as **false** unless the admin has asked you to feature this on the homepage.

### Tested
Tick this only if you have personally tested every product mentioned.

### Draft
Leave as **true**. The editorial workflow controls visibility — this is an extra safeguard. Set to **false** only when the admin confirms the article is ready.

### Confidence grade
How strong is the evidence behind this piece?
- **High** — peer-reviewed research or strong professional consensus
- **Medium** — reasonable agreement among practitioners, plausible but limited evidence
- **Low** — community observation, anecdote, or early-stage evidence

If you are not sure, choose **Medium** and note the uncertainty in the article body.

### Contributor
Select your name from the dropdown. This links the article to your byline. If your name does not appear, contact the admin — your contributor record may not be set up yet.

### Hero image
Upload an image for the top of the article. See [Image guidelines](#image-guidelines) below.

### Hero image alt text
Required if you upload a hero image. Describe what the image literally shows — not what it means. Good: `Close-up of 4c coils with visible shrinkage, natural light.` Bad: `Beautiful natural hair.`

### Hero image credit
If the image is not your own, credit the photographer or source: `Photo: Unsplash / Ime Nse`.

### Standfirst
A longer opening paragraph shown beneath the title on the article page. 1–2 sentences. Set up the reader experience before the article begins.

### Short answer
A 40–60 word direct answer to the article's main question. Shown in a highlighted box at the top of the article. Write this as if answering someone who Googled the question and wants the short version before deciding whether to read on.

### Body
The article itself, written in Markdown. See [Writing in Markdown](#writing-in-markdown) below.

### Products
Optional. Only fill this in if the article includes product verdicts. Add one entry per product with name, brand, verdict (buy / skip / not yet tested), price, and buy URL.

---

## Image guidelines

- Maximum file size: 500 KB. Compress large photos at [squoosh.app](https://squoosh.app) before uploading.
- Preferred formats: JPEG or WebP. Avoid PNG for photographs.
- Preferred dimensions: at least 1200 px on the longest side.
- All images land in `/uploads/` on the site. Do not delete uploaded images — they may be in use elsewhere.
- Alt text is required on every image. Screen readers and search engines depend on it.

---

## Writing in Markdown

The body field uses Markdown. The basics:

```
## Section heading

### Sub-heading

**Bold text**

*Italic text*

- Bullet point
- Another bullet

1. Numbered list
2. Second item

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

| Banned | Reason |
|---|---|
| honest / honestly | Fine in body prose; banned in labels |
| trusted | |
| ultimate | |
| comprehensive | |
| definitive | |
| expert (as a self-label) | Fine when referencing a named third party |
| genuine | |
| transparent | |
| unbiased | |
| authentic | |

**Do not:**
- Write throat-clearing openers ("In today's world…", "If you're reading this…")
- Use AI-generated filler phrases: "dive in", "game-changer", "let's explore", "it's important to note"
- Both-sides an issue that has a clear answer
- Invent sources — flag gaps with `[TODO: source needed]` instead

Write in British English: `moisturiser` not `moisturizer`, `colour` not `color`.

---

## How drafts work

When you click **Save**, the article is saved as a draft. It is not live on the site. In the workflow view (the column panel on the dashboard), the article appears under **Drafts**.

States:
1. **Drafts** — you are still working on it
2. **In review** — you have finished writing; admin should check it
3. **Ready** — admin has approved it and it is ready to publish

Move articles between states by dragging the card in the workflow view, or by opening the article and changing the status in the top bar.

---

## What happens after you move an article to Ready

1. The admin sees the article in the **Ready** column
2. Admin opens the pull request in GitHub and reads the article
3. **If approved:** admin merges → Cloudflare Pages rebuilds → article is live within ~2 minutes
4. **If changes needed:** admin closes the PR and contacts you → move the article back to **Drafts**, make changes, move to **In Review** again

You will not receive an automatic notification when your article goes live. Check the site or ask the admin.

---

## Common gotchas

**My article is not appearing on the site.**
If the article is in Ready state, the admin may not have merged the PR yet. If the admin has merged, wait 3 minutes and check again. If it is still not live, contact the admin — the Cloudflare Pages build may have failed.

**I uploaded an image but it is not showing.**
Check the hero image alt text field — it is required. Also check the image file size is under 500 KB.

**The Markdown in my article is not rendering correctly.**
Open the preview pane (the right side of the editor). Common mistakes: missing a blank line before a heading, using `#` instead of `##`, or unclosed `**` for bold.

**I cannot log in.**
Check you are using the email address the invite was sent to. If you have forgotten your password, contact the admin — they can trigger a password reset from the Netlify Identity dashboard. You cannot reset your own password from the login screen.

**The Contributor dropdown shows no results.**
Your contributor record has not been added yet, or the admin has not merged it. Contact the admin.

**The CMS is loading slowly or showing errors.**
Try a hard refresh. If the problem persists, the Netlify Identity service may be temporarily unavailable. This does not affect the live site — readers are unaffected. Contact the admin.

**MDX vs Markdown — what is the difference?**
For most contributors, no practical difference. Write in the Body editor and use the toolbar. Custom components (like quizzes) are added by the admin, not in the article body itself.

---

*Questions? Contact the site admin.*

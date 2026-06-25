# Contributor guide — NaturalCurly CMS

This guide is for contributors who write or review articles on naturalcurlyhair.co.uk. You do not need to know how to code. Everything happens through a form-based editor at `/admin/`.

---

## Before you start

You need a GitHub account. If you do not have one, create one free at [github.com](https://github.com). Once you have an account, ask the site admin to give your GitHub username access to the repo.

---

## Logging in

1. Go to **https://naturalcurlyhair.co.uk/admin/**
2. Click **Login with GitHub**
3. A GitHub popup will open. Authorise the NaturalCurly app when prompted.
4. You will land on the CMS dashboard showing the Articles and Contributors collections.

If the popup is blocked, allow popups for `naturalcurlyhair.co.uk` in your browser settings and try again.

---

## Writing a new article

### 1. Open the Articles collection

Click **Articles** in the left-hand sidebar. You will see all existing articles listed.

Click **New Article** (top right).

### 2. Fill in the fields

Every field has a label and a hint. Here is what each one means:

| Field | What to put here |
|---|---|
| **Title** | The article headline. Write it for a reader, not for Google. |
| **Hub** | Which curl-type or topic section this article belongs to (e.g. `hair-care`, `4c`). |
| **Category** | A short descriptor: `FAQ`, `Routine`, `Diagnostic`, `Review`. |
| **Dek** | One sentence that summarises what the article does for the reader. Max ~160 characters. This appears under the title on the article page. |
| **Published date** | The date the article should show as published. Click the field and pick a date. |
| **Updated date** | Leave blank unless you are updating an existing article. |
| **Read time** | Leave blank. The site calculates this automatically from word count. |
| **Featured** | Leave this off unless the admin has asked you to feature the article on the homepage. |
| **Tested** | Tick this only if you have personally tested every product mentioned. |
| **Draft** | This is **on by default**. It means the article will not appear on the live site yet. The admin turns it off when the article is approved. |
| **Confidence grade** | For diagnostic articles only (e.g. porosity guides, hair type explainers). Pick `High`, `Medium`, or `Low` based on how strong the evidence is. Leave blank for other article types. |
| **Contributor ID** | Select your name from the dropdown. If your name is not there, ask the admin to add you to the Contributors list first. |
| **Hero image** | Optional. Upload a photo that represents the article. See image guidance below. |
| **Hero image alt text** | Required if you upload a hero image. Describe the image in plain English for screen readers. E.g. `Close-up of 4C coils after a wash day, showing shrinkage.` |
| **Hero image credit** | Photographer name or source. E.g. `Photo: Amara Osei`. |
| **Standfirst** | Optional. A 1–2 sentence intro that appears in the hero section, above the body. |
| **Short answer** | Optional but recommended for diagnostic and FAQ articles. Write a 40–60 word direct answer to the article's core question. This is used for featured snippet markup in search results. |
| **Body** | The article text. Use the toolbar for headings, bold, links, and lists. See writing guidance below. |
| **Products** | Only fill this in if the article reviews specific products. Click **Add Products** to add one at a time. Each product needs a name, brand, verdict (buy / skip / not yet tested), and a buy URL if you have one. |

### 3. Writing the body

The body editor works like a simple word processor.

- **H2 headings** (the `##` button) for main sections
- **H3 headings** for sub-sections within a section
- **Bold** for verdicts, key terms, product names on first mention
- **Links** for any product you mention that has a buy URL — paste the URL when prompted
- **Bullet lists** for ingredient lists, step-by-step routines, and quick-reference summaries

Do not use H1. The article title is already the H1.

Write as if you are talking to someone in a WhatsApp group who asked you a genuine question. You know your stuff — say it plainly. No padding, no throat-clearing, no phrases like "In today's world..." or "Great question!".

Start with the most useful thing. Answer the core question in the first paragraph, then explain the detail.

### 4. Saving a draft

Click **Save** at the top of the page. This creates a draft branch in GitHub and opens a pull request. You will see a confirmation message.

The article is now in **Draft** state. It is not live on the site.

---

## Submitting for review

When your article is ready for the admin to review:

1. Find the article in the Articles list. It will have a **Draft** label.
2. Click the article to open it.
3. At the top of the page, change the status from **Draft** to **In Review** using the status dropdown.
4. Click **Save**.

The admin will receive a notification that the article is ready. They will either:
- Merge it (article goes live within ~2 minutes), or
- Leave comments on the GitHub pull request for you to address.

If there are comments to address, make your edits in the CMS and save again. The pull request updates automatically.

---

## What happens after it goes live

Once the admin merges the pull request:

1. Cloudflare Pages detects the change and rebuilds the site.
2. The article appears on the live site within **2–3 minutes**.
3. The CMS article status changes to **Published**.

---

## Uploading images

When you add a hero image or a product image:

1. Click the image field.
2. Click **Choose an image** → **Upload**.
3. Select the file from your computer.
4. The image uploads to `/uploads/` in the repo.
5. The file path is filled in automatically.

**Image guidelines:**

- File format: JPEG or WebP preferred. PNG is fine for graphics.
- Max file size: 1 MB. Compress large photos at [squoosh.app](https://squoosh.app) before uploading.
- Hero images: landscape crop, at least 1200 × 675 px.
- Portraits (Contributors): square crop, at least 400 × 400 px.
- Alt text is **required** on every image. Describe what is in the photo. Bad: `image1.jpg`. Good: `3C curls styled in a wash-and-go, showing defined ringlets at the crown.`

---

## Editing the Contributors list

The Contributors list stores the bylines that appear on articles.

1. Click **Contributors** in the left sidebar.
2. Click **All Contributors**.
3. To add yourself: click **Add Contributors** at the bottom of the list.
4. Fill in: ID (slug format, no spaces, e.g. `amara-osei`), Name, Role, Bio (max 300 characters), Portrait (optional), Credentials (optional).
5. Click **Save**.

The admin will merge the change before your name appears in the Contributor ID dropdown on articles.

---

## Voice rules

These are the house rules for how we write. They apply to every article.

**Do:**
- Open with something concrete — a real scenario, a number, a specific problem.
- Answer the question directly in the first paragraph.
- Use the words readers actually use. If they say "shrinkage", we say "shrinkage".
- Declare every affiliate link. Use the phrase "affiliate link" — never disguise it.
- Say "save your money" when a product does not earn a recommendation.
- Use UK spelling, UK product availability, UK prices.
- Name sources. Attribute claims.

**Do not:**
- Use "honest", "trusted", "independent", "authentic", "ultimate", "definitive" in UI copy or article titles.
- Write throat-clearing openers ("In today's world…", "If you're reading this…").
- Use AI slop phrases: "dive in", "game-changer", "let's explore", "it's important to note".
- Write enthusiasm padding: "This is such a great question!"
- Both-sides an issue that has a clear answer.
- Invent sources. If you do not have a source, flag it with `[TODO: source needed]` — do not make one up.

---

## Common gotchas

**My article saved but I cannot find it in the CMS.**
It is probably on a draft branch. Check the Articles list and look for items with a Draft label.

**The image I uploaded looks blurry.**
The file was probably too small. Aim for at least 1200 px wide for hero images.

**I used markdown in the Body but it is showing as plain text.**
Make sure you are using the Body field, not the Dek or Standfirst field. Those fields do not render markdown.

**The Contributor ID dropdown shows no results.**
Your contributor entry has not been added yet, or the admin has not merged it. Ask the admin to add and merge your contributor entry first.

**I saved my article but it is live on the site — I did not want that.**
Check the **Draft** toggle. If Draft is off and the pull request was merged, the article is live. To hide it, open the article in the CMS, turn Draft on, save, and ask the admin to merge that change.

**MDX vs markdown — what is the difference?**
For most contributors, there is no practical difference. Write in the Body editor and use the toolbar. MDX allows custom components (like the porosity quiz) to be embedded, but that is done by the admin, not in the article body.

---

*Questions? Contact the site admin at dgcoker2@gmail.com.*

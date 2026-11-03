# Candidate ideology social profile — three-condition prototype

This is a complete static GitHub Pages site based on the uploaded CandidateIdeologyProfiles repository. No build process is needed.

## Preview

- `index.html?condition=policy` — 5 policy, 2 partisan, 3 general
- `index.html?condition=partisan` — 2 policy, 5 partisan, 3 general
- `index.html?condition=general` — 2 policy, 2 partisan, 6 general

Without a query parameter, the page defaults to **policy** for convenient preview. Unknown values also fall back to policy with a console warning; in a real experiment, ensure Qualtrics always passes a valid condition.

## Files

- `index.html` — candidate profile page
- `data/candidate.js` — candidate identity and profile information
- `posts/posts.js` — **single stimulus bank**, including example comments and engagement counts
- `assets/feed-generator.js` — condition templates and deterministic selection
- `assets/app.js` — UI, interactions, exposure and event logging
- `assets/styles.css` and `images/` — appearance
- `qualtrics-listener.js` — **example code for the Qualtrics parent page**, not loaded by the website

The existing first ten posts were retained. Six extra **draft** messages were added to supply sufficient partisan/general content. All stimuli need substantive review and pretesting before fielding. The bank deliberately includes some policy/partisan cues that may be inconsistent with the Democrat profile; review ideological coherence before production.

## How feeds are selected

`FEED_GENERATOR.selectFeed(condition, POSTS)` uses the ordered type template in `assets/feed-generator.js`, then takes the next unused post of each type from the stimulus bank. Selection is **deterministic**: everyone assigned the same condition sees the same post IDs in the same order. This controls wording/order within condition; it does not randomly sample individual messages. To change content, edit the bank and/or template. Every displayed post has a stable ID.

## Qualtrics setup

1. In Survey Flow, before the iframe question, add a Randomizer that presents **one of three Embedded Data elements** evenly: `condition=policy`, `condition=partisan`, or `condition=general`.
2. Embed the GitHub Pages site in a Qualtrics question using the iframe below (replace username/repository):

```html
<iframe title="Candidate profile" src="https://YOUR-USERNAME.github.io/CandidateIdeologyProfiles/?condition=${e://Field/condition}" width="100%" height="850" style="border:0" loading="eager"></iframe>
```

3. For interaction capture, adapt `qualtrics-listener.js` into the **parent Qualtrics question JavaScript**. Set `ALLOWED_ORIGIN` to your GitHub Pages origin. Create the relevant `CF_` Embedded Data fields in Survey Flow before the question. Test in a real Qualtrics preview and export a test response before fielding.
4. Note that URL parameters are visible to participants; assignment must occur in Qualtrics, and the exported assigned condition is the source of truth. The iframe is a static site and is not a secure server-side assignment mechanism.

## Event data

Every `CANDIDATE_FEED_EVENT` includes `condition` and `feedVersion`. `feed_loaded` and `session_start` include the post ID sequence. Individual engagement events include `postId` and `postType`. `post_exposed` fires on first 50% intersection (not guaranteed attention); `session_end` via unload is best-effort. Comments typed by respondents appear immediately in the thread, but their text is **not** sent to Qualtrics (only length). This is deliberate for the prototype.

**Research caveats:** A message category's raw engagement count will reflect its exposure frequency. For analysis, normalize engagement by the number of posts shown and/or actually viewed. Baseline likes/comments are illustrative and differ across stimuli, so they may independently cue salience. Qualtrics Embedded Data can truncate long logs: use a bounded summary or tested server-side logging before production. The website platform arm is not included in this ZIP.

## Local test

From the repository folder run `python3 -m http.server 8000`, then open `http://localhost:8000/?condition=partisan`. For GitHub Pages, upload the contents of this folder to the repository root and enable Pages from the main branch.

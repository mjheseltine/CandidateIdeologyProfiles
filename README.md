# Candidate Social Feed Experiment — v1

This version converts the original timeline app into an interactive hypothetical-candidate home page designed to be embedded in a Qualtrics iframe.

## Interface

The page contains:

- candidate banner
- candidate avatar
- candidate name and handle
- bio
- follower/following counts
- follow button
- a sequence of clickable candidate posts
- comments that expand inside each post
- respondent reply box inside each opened post

## Current feed design

The default condition is `policy_weighted` and uses a 10-message sequence:

1. policy
2. general
3. policy
4. general
5. policy
6. partisan
7. policy
8. general
9. policy
10. partisan

This gives 5 policy messages, 3 general political messages, and 2 partisan messages.

The sequence is stored in `data/stimuli.json`, so it can be changed without editing the interface.

## Qualtrics iframe

Embed the GitHub Pages URL in a Qualtrics iframe or the Qualtrics HTML editor.

Example URL:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/?condition=policy_weighted&candidate=alex-morgan&rid=${e://Field/ResponseID}`

The app uses URL parameters:

- `condition` — feed configuration name
- `candidate` — candidate id
- `rid` or `responseId` — optional respondent identifier, useful for event logging

## Events sent to Qualtrics

The iframe posts events to its parent window with the message shape:

```js
{
  source: "candidate-feed-v1",
  type: "EXPERIMENT_EVENT",
  event: "post_open",
  respondentId: "...",
  candidateId: "alex-morgan",
  condition: "policy_weighted",
  timestamp: 1710000000000,
  ...event-specific fields
}
```

Current event names:

- `exposure_start`
- `exposure_end`
- `post_open`
- `post_close`
- `scroll_depth`
- `follow_toggle`
- `user_comment`
- `context_received`

## Qualtrics listener example

The receiving page can listen for the events with:

```js
window.addEventListener("message", function(event) {
  if (!event.data || event.data.type !== "EXPERIMENT_EVENT") return;

  const payload = event.data;
  console.log("Candidate feed event", payload);

  // Store selected fields in Qualtrics Embedded Data or your own endpoint.
  // Example: Qualtrics.SurveyEngine.setEmbeddedData("last_feed_event", JSON.stringify(payload));
});
```

## Local testing

The app uses `fetch()` to load JSON, so opening `index.html` directly from the file system may be blocked by the browser's CORS rules.

Use a simple static server during development, for example:

`python3 -m http.server 8000`

Then open:

`http://localhost:8000/?condition=policy_weighted`

## Next-stage experimental work

The next version can add parallel feed configurations such as:

- `policy_weighted`
- `partisan_weighted`
- `general_weighted`

while holding the candidate profile, layout, posting cadence, engagement counts, and non-treatment messages constant.

## Optional Qualtrics event capture

`qualtrics-listener.js` is a ready-to-paste example for the Qualtrics question JavaScript editor. It captures the feed condition, candidate, sequence, posts opened, maximum scroll depth, exposure duration, user comments, follow state, and the full event log into Qualtrics Embedded Data.

Create the corresponding Embedded Data fields in Survey Flow before the block containing the experiment question if you want them available in the data export.

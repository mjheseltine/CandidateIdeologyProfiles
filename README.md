# Candidate Social Feed Experiment - v1

A static candidate-profile social feed for testing look and feel before Qualtrics deployment.

## Files

- `index.html` - candidate home page.
- `data/candidate.js` - candidate profile information.
- `posts/posts.js` - all feed posts and comments. This is the only file you need to edit for stimulus content right now.
- `assets/app.js` - renders the profile/feed and sends interaction events with `postMessage`.
- `assets/styles.css` - visual design.
- `qualtrics-listener.js` - example Qualtrics-side event listener.
- `images/candidate_avatar.svg` - placeholder candidate avatar.

## Run locally

Because the site uses ordinary local files and no build step, it can be hosted from any static web host. For local testing, a simple static HTTP server is preferable to opening `index.html` directly from `file://`.

## Important

The `ideology` field in `posts/posts.js` is included for development only. Remove or separate it from production-facing data before fielding so the client-side application does not expose treatment labels unnecessarily.

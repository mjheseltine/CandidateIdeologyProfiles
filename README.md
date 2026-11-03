# Candidate Ideology Profiles — two-party social feed

Static GitHub Pages site. Upload the **contents** of this folder to the root of your GitHub repository.

## Preview URLs

- `?party=dem&condition=policy`
- `?party=dem&condition=partisan`
- `?party=dem&condition=general`
- `?party=rep&condition=policy`
- `?party=rep&condition=partisan`
- `?party=rep&condition=general`

Defaults are `dem` and `policy` when omitted. Invalid values also fall back to these preview defaults and emit a console warning; in production Qualtrics should always supply valid values.

## Experiment logic

`posts/posts.js` is the shared stimulus bank, tagged `party` (`dem`/`rep`) and `type` (`policy`/`partisan`/`general`). `assets/feed-generator.js` filters by party and applies a fixed 10-post interleaving template. Counts: policy arm 5/2/3; partisan arm 2/5/3; general arm 2/2/6 (policy/partisan/general). The bank currently contains 16 posts per party: 5 policy, 5 partisan, 6 general. Selection is deterministic and the same within a party/condition.

`data/candidate.js` contains both candidate profiles. Alex Morgan is the Democrat; Jordan Ellis is the provisional Republican. The Republican portrait is **a clearly labeled placeholder** and should be replaced before a live study. The Republican banner is a distinct SVG campaign graphic.

## Qualtrics

Randomize **platform** and **condition** between respondents, and counterbalance **party order** within respondent. Both evaluations should use the same `condition`, with `party` switched between `dem` and `rep`. E.g. iframe URL:

`https://YOUR-USERNAME.github.io/YOUR-REPO/?party=${e://Field/CurrentParty}&condition=${e://Field/condition}`

Set `CurrentParty` separately before each evaluation. Keep outcome variables distinct (e.g. `DEM_Ideology`, `REP_Ideology`). The iframe emits `CANDIDATE_FEED_EVENT` messages including `party`, `condition`, and post metadata. `qualtrics-listener.js` is an example for the **parent Qualtrics question**; update `ALLOWED_ORIGIN` and configure the Embedded Data fields. Do not include the listener inside the iframe page. Test saving events across both candidate evaluations; avoid overwriting party-specific data.

## Research caveats

All posts are draft stimuli, not validated ideological cues. Review wording, equivalence, and comment effects before fielding. Interactions are in-memory and reset on reload. No backend is required for the preview. This package has static checks but has not been tested in a live Qualtrics environment.

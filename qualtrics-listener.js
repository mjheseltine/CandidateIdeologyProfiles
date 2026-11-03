/* Qualtrics-side example: paste into the iframe question's JavaScript, inside addOnload.
   Set ALLOWED_ORIGIN to your real GitHub Pages origin before fielding.
   Register Embedded Data names in Survey Flow before the question.
   Qualtrics can impose size limits; avoid storing an unlimited event log in production. */
(function () {
  "use strict";
  const ALLOWED_ORIGIN = "https://YOUR-USERNAME.github.io"; // CHANGE ME
  const events = [];
  const counts = { like: 0, repost: 0, comments_opened: 0, reply_submit: 0 };
  window.addEventListener("message", function (message) {
    if (message.origin !== ALLOWED_ORIGIN) return;
    const data = message.data;
    if (!data || data.type !== "CANDIDATE_FEED_EVENT") return;
    if (Object.prototype.hasOwnProperty.call(counts, data.event)) counts[data.event]++;
    events.push(data);
    if (typeof Qualtrics === "undefined" || !Qualtrics.SurveyEngine) return;
    const set = (key, value) => Qualtrics.SurveyEngine.setEmbeddedData(key, String(value));
    set("CF_Condition", data.condition || "");
    set("CF_FeedVersion", data.feedVersion || "");
    set("CF_LastEvent", data.event || "");
    if (data.postSequence) set("CF_PostSequence", JSON.stringify(data.postSequence));
    if (data.postId !== undefined) set("CF_LastPostId", data.postId);
    if (data.percent !== undefined) set("CF_ScrollDepth", data.percent);
    if (data.openedPostCount !== undefined) set("CF_OpenedPostCount", data.openedPostCount);
    if (data.durationSeconds !== undefined) set("CF_DurationSeconds", data.durationSeconds);
    for (const [event, n] of Object.entries(counts)) set("CF_" + event, n);
    // For small pilots only: may exceed Embedded Data limits in long sessions.
    set("CF_EventLog", JSON.stringify(events));
  });
})();

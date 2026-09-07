/*
 * Paste this into the Qualtrics JavaScript editor for the question that
 * contains the candidate-feed iframe.
 *
 * Expected Embedded Data fields:
 *   CF_CONDITION
 *   CF_CANDIDATE
 *   CF_EXPOSURE_MS
 *   CF_MAX_SCROLL
 *   CF_OPENED_POSTS
 *   CF_SEQUENCE
 *   CF_EVENT_LOG
 *   CF_USER_COMMENTS
 *   CF_FOLLOWED
 *
 * The event log is JSON so you can preserve the full interaction stream.
 */

Qualtrics.SurveyEngine.addOnload(function () {
  var eventLog = [];
  var openedPosts = [];
  var userComments = [];
  var maxScroll = 0;
  var exposureMs = 0;
  var followed = false;

  window.addEventListener("message", function (event) {
    var data = event.data;
    if (!data || data.source !== "candidate-feed-v1" || data.type !== "EXPERIMENT_EVENT") return;

    eventLog.push(data);

    Qualtrics.SurveyEngine.setEmbeddedData("CF_CONDITION", data.condition || "");
    Qualtrics.SurveyEngine.setEmbeddedData("CF_CANDIDATE", data.candidateId || "");

    if (data.event === "exposure_start") {
      Qualtrics.SurveyEngine.setEmbeddedData("CF_SEQUENCE", JSON.stringify(data.sequence || []));
    }

    if (data.event === "post_open") {
      if (openedPosts.indexOf(data.postId) === -1) openedPosts.push(data.postId);
      Qualtrics.SurveyEngine.setEmbeddedData("CF_OPENED_POSTS", JSON.stringify(openedPosts));
    }

    if (data.event === "scroll_depth") {
      maxScroll = Math.max(maxScroll, Number(data.depth) || 0);
      Qualtrics.SurveyEngine.setEmbeddedData("CF_MAX_SCROLL", String(maxScroll));
    }

    if (data.event === "exposure_end") {
      exposureMs = Number(data.durationMs) || 0;
      Qualtrics.SurveyEngine.setEmbeddedData("CF_EXPOSURE_MS", String(exposureMs));
    }

    if (data.event === "user_comment") {
      userComments.push({
        postId: data.postId,
        messageType: data.messageType,
        text: data.text,
        timestamp: data.timestamp
      });
      Qualtrics.SurveyEngine.setEmbeddedData("CF_USER_COMMENTS", JSON.stringify(userComments));
    }

    if (data.event === "follow_toggle") {
      followed = Boolean(data.followed);
      Qualtrics.SurveyEngine.setEmbeddedData("CF_FOLLOWED", followed ? "1" : "0");
    }

    Qualtrics.SurveyEngine.setEmbeddedData("CF_EVENT_LOG", JSON.stringify(eventLog));
  });
});

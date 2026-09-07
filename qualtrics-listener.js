/*
  Add this to the Qualtrics page (outside the iframe) if you want to
  capture events as Embedded Data.

  In Qualtrics, create Embedded Data fields matching the names below.
  Because a participant can generate many events, this example stores
  a compact JSON event log plus a few summary fields.
*/

(function () {
  const events = [];
  let lastEvent = null;

  window.addEventListener("message", function (message) {
    const data = message.data;
    if (!data || data.type !== "CANDIDATE_FEED_EVENT") return;

    events.push(data);
    lastEvent = data;

    if (typeof Qualtrics === "undefined" || !Qualtrics.SurveyEngine) return;

    try {
      const api = Qualtrics.SurveyEngine.getInstance();
      api.setEmbeddedData("CF_LastEvent", data.event || "");
      api.setEmbeddedData("CF_EventLog", JSON.stringify(events));

      if (data.postType) api.setEmbeddedData("CF_LastPostType", data.postType);
      if (data.postId !== undefined) api.setEmbeddedData("CF_LastPostId", String(data.postId));
      if (data.percent !== undefined) api.setEmbeddedData("CF_ScrollDepth", String(data.percent));
      if (data.openedPostCount !== undefined) api.setEmbeddedData("CF_OpenedPostCount", String(data.openedPostCount));
      if (data.durationSeconds !== undefined) api.setEmbeddedData("CF_DurationSeconds", String(data.durationSeconds));
    } catch (error) {
      console.warn("Qualtrics Embedded Data update failed", error);
    }
  });
})();

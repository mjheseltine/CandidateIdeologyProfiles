/* Deterministic, preregistration-friendly feed selection. */
(function (root) {
  "use strict";
  const FEED_VERSION = "social-v1.1";
  const TEMPLATES = Object.freeze({
    policy:   ["policy", "general", "policy", "partisan", "policy", "general", "policy", "partisan", "policy", "general"],
    partisan: ["partisan", "general", "partisan", "policy", "partisan", "general", "partisan", "policy", "partisan", "general"],
    general:  ["general", "policy", "general", "partisan", "general", "general", "policy", "general", "partisan", "general"]
  });
  function selectFeed(condition, bank) {
    if (!Object.prototype.hasOwnProperty.call(TEMPLATES, condition)) {
      throw new Error("Invalid condition: " + condition);
    }
    if (!Array.isArray(bank)) throw new Error("Post bank is unavailable");
    const pools = { policy: [], partisan: [], general: [] };
    const seen = new Set();
    bank.forEach(post => {
      if (seen.has(String(post.id))) throw new Error("Duplicate post ID: " + post.id);
      seen.add(String(post.id));
      if (pools[post.type]) pools[post.type].push(post);
    });
    const cursors = { policy: 0, partisan: 0, general: 0 };
    const selected = TEMPLATES[condition].map(type => {
      const post = pools[type][cursors[type]++];
      if (!post) throw new Error("Not enough " + type + " posts for " + condition);
      return post;
    });
    return { condition, version: FEED_VERSION, posts: selected, sequence: selected.map(p => p.id), counts: { ...cursors } };
  }
  root.FEED_GENERATOR = Object.freeze({ selectFeed, TEMPLATES, FEED_VERSION });
})(typeof window !== "undefined" ? window : globalThis);

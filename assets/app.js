const APP_VERSION = "candidate-feed-v1";
const app = document.getElementById("app");
const params = new URLSearchParams(window.location.search);
const requestedCondition = params.get("condition") || "policy_weighted";
const respondentId = params.get("rid") || params.get("responseId") || `local-${Math.random().toString(36).slice(2, 9)}`;
const candidateId = params.get("candidate") || "alex-morgan";

let candidate = null;
let posts = [];
let state = {
  startedAt: Date.now(),
  openPosts: {},
  comments: {},
  followed: false
};

function postToQualtrics(event, payload = {}) {
  window.parent.postMessage({
    source: APP_VERSION,
    type: "EXPERIMENT_EVENT",
    event,
    respondentId,
    candidateId,
    condition: activeCondition,
    timestamp: Date.now(),
    ...payload
  }, "*");
}

function safeText(value) {
  return String(value ?? "");
}

function initials(name) {
  return safeText(name)
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function colorFromName(name) {
  const colors = [
    "linear-gradient(135deg,#2457d6,#6d8fe8)",
    "linear-gradient(135deg,#345c9f,#7aa0d8)",
    "linear-gradient(135deg,#4b5563,#94a3b8)",
    "linear-gradient(135deg,#7a4f9b,#ba85d1)",
    "linear-gradient(135deg,#8d5c35,#d09c6b)"
  ];
  return colors[(safeText(name).charCodeAt(0) || 0) % colors.length];
}

function escapeHtml(value) {
  return safeText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getConfigForCondition(postsData, condition) {
  const configs = postsData.feeds || {};
  return configs[condition] || configs.policy_weighted || Object.keys(configs)[0];
}

function getPostById(id) {
  return posts.find(p => p.id === id);
}

let activeCondition = requestedCondition;

async function boot() {
  try {
    const [candidateResp, stimuliResp] = await Promise.all([
      fetch("data/candidate.json"),
      fetch("data/stimuli.json")
    ]);

    if (!candidateResp.ok || !stimuliResp.ok) throw new Error("Unable to load experiment data.");

    const candidateData = await candidateResp.json();
    const stimuliData = await stimuliResp.json();

    candidate = candidateData.candidates.find(c => c.id === candidateId) || candidateData.candidates[0];
    const feedConfig = getConfigForCondition(stimuliData, activeCondition);
    activeCondition = feedConfig.condition;

    const byId = new Map(stimuliData.messages.map(p => [p.id, p]));
    posts = feedConfig.sequence.map(id => byId.get(id)).filter(Boolean);

    renderPage();
    postToQualtrics("exposure_start", {
      feedMessageCount: posts.length,
      sequence: posts.map(p => p.id),
      sequenceTypes: posts.map(p => p.type)
    });
  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="loading">This page could not load. Please return to the survey and try again.</div>`;
  }
}

function renderPage() {
  app.innerHTML = "";

  const profile = document.createElement("section");
  profile.className = "profile-card";
  profile.innerHTML = `
    <div class="banner"></div>
    <div class="profile-main">
      <div class="avatar-wrap">
        ${candidate.avatar
          ? `<img class="avatar" src="${escapeHtml(candidate.avatar)}" alt="${escapeHtml(candidate.name)}" />`
          : `<div class="avatar" style="background:${colorFromName(candidate.name)}">${escapeHtml(initials(candidate.name))}</div>`}
      </div>
      <div class="profile-actions">
        <button class="follow-btn" id="followBtn" type="button">Follow</button>
      </div>
      <div class="profile-copy">
        <div class="name-row">
          <span class="name">${escapeHtml(candidate.name)}</span>
          <span class="handle">${escapeHtml(candidate.handle)}</span>
        </div>
        <div class="bio">${escapeHtml(candidate.bio)}</div>
        <div class="profile-meta">
          <span>${escapeHtml(candidate.location)}</span>
          <span><strong>${escapeHtml(candidate.followers)}</strong> followers</span>
          <span><strong>${escapeHtml(candidate.following)}</strong> following</span>
        </div>
        <div class="experiment-badge">Candidate page</div>
      </div>
    </div>
  `;
  app.appendChild(profile);

  const followBtn = profile.querySelector("#followBtn");
  followBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    state.followed = !state.followed;
    followBtn.classList.toggle("following", state.followed);
    followBtn.textContent = state.followed ? "Following" : "Follow";
    postToQualtrics("follow_toggle", { followed: state.followed });
  });

  const feed = document.createElement("section");
  feed.className = "feed";
  feed.innerHTML = `<div class="feed-heading">Posts</div>`;
  posts.forEach(post => feed.appendChild(createPost(post)));
  app.appendChild(feed);
}

function createPost(post) {
  const article = document.createElement("article");
  article.className = "post";
  article.dataset.postId = post.id;

  const open = !!state.openPosts[post.id];

  article.innerHTML = `
    <button class="post-button" type="button" aria-expanded="${open}">
      <div class="post-head">
        <div class="mini-avatar" style="background:${colorFromName(candidate.name)}">${escapeHtml(initials(candidate.name))}</div>
        <div class="post-meta">
          <span class="post-author">${escapeHtml(candidate.name)}</span>
          <span class="post-handle">${escapeHtml(candidate.handle)}</span>
          <span class="post-time">· ${escapeHtml(post.timestamp)}</span>
        </div>
      </div>
      <div class="post-text">${escapeHtml(post.text)}</div>
      ${post.image ? `<img class="post-image" src="${escapeHtml(post.image)}" alt="" />` : ""}
      <div class="post-footer">
        <span>💬 ${escapeHtml(post.comments?.length || 0)}</span>
        <span>🔁 ${escapeHtml(post.retweets || 0)}</span>
        <span>♥ ${escapeHtml(post.likes || 0)}</span>
      </div>
    </button>
  `;

  const button = article.querySelector(".post-button");
  button.addEventListener("click", () => {
    const nowOpen = !state.openPosts[post.id];
    state.openPosts[post.id] = nowOpen;
    button.setAttribute("aria-expanded", String(nowOpen));
    article.querySelectorAll(".thread").forEach(el => el.remove());
    if (nowOpen) {
      article.appendChild(createThread(post));
      postToQualtrics("post_open", {
        postId: post.id,
        messageType: post.type,
        position: posts.findIndex(p => p.id === post.id) + 1
      });
    } else {
      postToQualtrics("post_close", { postId: post.id });
    }
  });

  return article;
}

function createThread(post) {
  const thread = document.createElement("div");
  thread.className = "thread";

  const comments = [...(post.comments || []), ...(state.comments[post.id] || []).map(text => ({
    author: "You",
    handle: "",
    text,
    user: true
  }))];

  const commentsHtml = comments.length
    ? comments.map(c => `
        <div class="comment">
          <div class="comment-avatar" style="background:${c.user ? "#2457d6" : colorFromName(c.author)}">${escapeHtml(c.user ? "YOU" : initials(c.author))}</div>
          <div class="comment-body">
            <div><span class="comment-author">${escapeHtml(c.author)}</span> ${c.handle ? `<span class="comment-handle">${escapeHtml(c.handle)}</span>` : ""}</div>
            <div class="comment-text">${escapeHtml(c.text)}</div>
          </div>
        </div>
      `).join("")
    : `<div class="empty-comments">No comments yet.</div>`;

  thread.innerHTML = `
    <div class="thread-label">Comments</div>
    <div class="thread-comments">${commentsHtml}</div>
    <form class="reply-box">
      <textarea placeholder="Write a reply…" aria-label="Write a reply"></textarea>
      <div class="reply-row"><button class="reply-btn" type="submit">Reply</button></div>
    </form>
  `;

  thread.querySelector(".reply-box").addEventListener("submit", (event) => {
    event.preventDefault();
    const textarea = thread.querySelector("textarea");
    const text = textarea.value.trim();
    if (!text) return;

    state.comments[post.id] ||= [];
    state.comments[post.id].push(text);
    textarea.value = "";

    const refreshed = createThread(post);
    thread.replaceWith(refreshed);
    postToQualtrics("user_comment", {
      postId: post.id,
      messageType: post.type,
      text
    });
  });

  return thread;
}

window.addEventListener("scroll", () => {
  const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const depth = Math.max(0, Math.min(100, Math.round(window.scrollY / total * 100)));
  if (!window._lastDepth || depth >= window._lastDepth + 10) {
    window._lastDepth = depth;
    postToQualtrics("scroll_depth", { depth });
  }
});

window.addEventListener("beforeunload", () => {
  postToQualtrics("exposure_end", {
    durationMs: Date.now() - state.startedAt,
    openedPosts: Object.keys(state.openPosts).filter(id => state.openPosts[id])
  });
});

window.addEventListener("message", (event) => {
  if (event.data?.type === "QUALTRICS_SET_CONTEXT") {
    const next = event.data.payload || {};
    postToQualtrics("context_received", { keys: Object.keys(next) });
  }
});

boot();

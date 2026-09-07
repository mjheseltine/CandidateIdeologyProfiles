(function () {
  "use strict";

  const state = {
    sessionId: "session-" + Math.random().toString(36).slice(2, 11),
    startTime: Date.now(),
    openedPosts: new Set(),
    followed: false,
    events: []
  };

  function sendEvent(event, details = {}) {
    const payload = {
      type: "CANDIDATE_FEED_EVENT",
      event,
      sessionId: state.sessionId,
      timestamp: new Date().toISOString(),
      ...details
    };

    state.events.push(payload);

    try {
      window.parent.postMessage(payload, "*");
    } catch (error) {
      console.warn("Unable to send event to parent frame", error);
    }
  }

  function renderCandidate() {
    document.title = `${CANDIDATE.name} | Candidate Profile`;
    document.getElementById("candidateAvatar").src = CANDIDATE.avatar;
    document.getElementById("candidateAvatar").alt = CANDIDATE.name;
    document.getElementById("candidateName").textContent = CANDIDATE.name;
    document.getElementById("candidateHandle").textContent = CANDIDATE.handle;
    document.getElementById("candidateBio").textContent = CANDIDATE.bio;
    document.getElementById("followingCount").textContent = CANDIDATE.following;
    document.getElementById("followersCount").textContent = CANDIDATE.followers;
    document.getElementById("postCount").textContent = POSTS.length;

    const meta = document.getElementById("candidateMeta");
    meta.innerHTML = "";

    const location = document.createElement("span");
    location.textContent = `📍 ${CANDIDATE.location}`;
    meta.appendChild(location);

    const website = document.createElement("span");
    website.textContent = `🌐 ${CANDIDATE.website}`;
    meta.appendChild(website);
  }

  function postCard(post) {
    const article = document.createElement("article");
    article.className = "post-card";
    article.dataset.postId = post.id;
    article.dataset.postType = post.type;

    const header = document.createElement("div");
    header.className = "post-header";

    const avatar = document.createElement("img");
    avatar.className = "post-avatar";
    avatar.src = CANDIDATE.avatar;
    avatar.alt = CANDIDATE.name;

    const author = document.createElement("div");
    author.className = "post-author";
    author.innerHTML = `<strong>${post.author}</strong>${post.verified ? '<span class="verified small">✓</span>' : ''}<span class="handle">${post.handle} · ${post.timestamp}</span>`;

    header.appendChild(avatar);
    header.appendChild(author);

    const body = document.createElement("div");
    body.className = "post-body";
    const text = document.createElement("p");
    text.textContent = post.text;
    body.appendChild(text);

    const actions = document.createElement("div");
    actions.className = "post-actions";

    const commentButton = makeActionButton(`💬 ${post.comments}`, "comment", post);
    const repostButton = makeActionButton(`↻ ${post.reposts}`, "repost", post);
    const likeButton = makeActionButton(`♡ ${post.likes}`, "like", post);
    const expandButton = makeActionButton("View comments", "open_comments", post);

    actions.append(commentButton, repostButton, likeButton, expandButton);

    const comments = document.createElement("div");
    comments.className = "comments-panel";
    comments.hidden = true;

    const commentsInner = document.createElement("div");
    commentsInner.className = "comments-inner";
    const commentsHeading = document.createElement("h3");
    commentsHeading.textContent = "Comments";
    commentsInner.appendChild(commentsHeading);

    (post.commentList || []).forEach((comment) => {
      const item = document.createElement("div");
      item.className = "comment";
      item.innerHTML = `<strong>${escapeHtml(comment.author)}</strong><p>${escapeHtml(comment.text)}</p>`;
      commentsInner.appendChild(item);
    });

    const reply = document.createElement("div");
    reply.className = "reply-box";
    reply.innerHTML = '<input type="text" placeholder="Reply to this post" aria-label="Reply to this post"><button type="button">Reply</button>';
    const replyInput = reply.querySelector("input");
    const replyButton = reply.querySelector("button");
    replyButton.addEventListener("click", () => {
      const value = replyInput.value.trim();
      if (!value) return;
      sendEvent("reply_submit", { postId: post.id, postType: post.type, textLength: value.length });
      replyInput.value = "";
      replyButton.textContent = "Sent";
      setTimeout(() => { replyButton.textContent = "Reply"; }, 1200);
    });

    commentsInner.appendChild(reply);
    comments.appendChild(commentsInner);

    body.appendChild(actions);
    body.appendChild(comments);
    article.append(header, body);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !state.openedPosts.has(post.id)) {
          state.openedPosts.add(post.id);
          sendEvent("post_exposed", { postId: post.id, postType: post.type, topic: post.topic || null });
        }
      });
    }, { threshold: 0.5 });

    observer.observe(article);
    return article;
  }

  function makeActionButton(label, action, post) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = "action-button";

    button.addEventListener("click", () => {
      sendEvent(action, { postId: post.id, postType: post.type, topic: post.topic || null });

      if (action === "open_comments") {
        const panel = button.closest(".post-card").querySelector(".comments-panel");
        panel.hidden = !panel.hidden;
        button.textContent = panel.hidden ? "View comments" : "Hide comments";
        sendEvent(panel.hidden ? "comments_closed" : "comments_opened", { postId: post.id });
      }

      if (action === "like") {
        button.classList.toggle("active");
      }
    });

    return button;
  }

  function renderFeed() {
    const feed = document.getElementById("feed");
    feed.innerHTML = "";
    POSTS.forEach((post) => feed.appendChild(postCard(post)));
    sendEvent("feed_loaded", { postCount: POSTS.length });
  }

  function setupFollow() {
    const button = document.getElementById("followButton");
    button.addEventListener("click", () => {
      state.followed = !state.followed;
      button.textContent = state.followed ? "Following" : "Follow";
      button.classList.toggle("following", state.followed);
      sendEvent(state.followed ? "follow" : "unfollow", { candidate: CANDIDATE.handle });
    });
  }

  function setupScrollLogging() {
    let lastBucket = -1;
    window.addEventListener("scroll", () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const percent = Math.min(100, Math.round((window.scrollY / maxScroll) * 100));
      const bucket = Math.floor(percent / 10) * 10;
      if (bucket !== lastBucket) {
        lastBucket = bucket;
        sendEvent("scroll_depth", { percent: bucket });
      }
    }, { passive: true });
  }

  function setupExitLogging() {
    window.addEventListener("beforeunload", () => {
      sendEvent("session_end", {
        durationSeconds: Math.round((Date.now() - state.startTime) / 1000),
        openedPostCount: state.openedPosts.size
      });
    });

    window.addEventListener("pagehide", () => {
      sendEvent("session_end", {
        durationSeconds: Math.round((Date.now() - state.startTime) / 1000),
        openedPostCount: state.openedPosts.size
      });
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderCandidate();
    renderFeed();
    setupFollow();
    setupScrollLogging();
    setupExitLogging();
    sendEvent("session_start", { candidate: CANDIDATE.handle });
  });
})();

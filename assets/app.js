(function () {
  "use strict";

  const ICONS = {
    like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.2S4.4 16.5 2.5 11.5C.7 6.6 4.2 3 8.2 3c1.9 0 3.2 1 3.8 2.1C12.6 4 13.9 3 15.8 3c4 0 7.5 3.6 5.7 8.5C19.6 16.5 12 21.2 12 21.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    liked: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.2S4.4 16.5 2.5 11.5C.7 6.6 4.2 3 8.2 3c1.9 0 3.2 1 3.8 2.1C12.6 4 13.9 3 15.8 3c4 0 7.5 3.6 5.7 8.5C19.6 16.5 12 21.2 12 21.2Z" fill="currentColor"/></svg>',
    repost: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h11l-3-3M17 17H6l3 3M18 7a5 5 0 0 1 2 4M6 17a5 5 0 0 1-2-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 11.1c0 4.5-4 7.6-8.7 7.6-1.1 0-2.1-.2-3-.5L4 20l1.1-3.6c-.9-1.2-1.4-2.8-1.4-4.4 0-4.5 3.5-7.8 8-7.8s8.5 2.4 8.5 6.9Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };

  const state = {
    sessionId: "session-" + Math.random().toString(36).slice(2, 11),
    startTime: Date.now(),
    openedPosts: new Set(),
    followed: false,
    events: [],
    postState: new Map()
  };

  function getPostState(post) {
    if (!state.postState.has(post.id)) {
      state.postState.set(post.id, {
        likes: Number(post.likes) || 0,
        reposts: Number(post.reposts) || 0,
        comments: Number(post.comments) || 0,
        liked: false,
        reposted: false,
        userComments: []
      });
    }
    return state.postState.get(post.id);
  }

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
    const avatar = document.getElementById("candidateAvatar");
    avatar.src = CANDIDATE.avatar;
    avatar.alt = CANDIDATE.name;

    document.getElementById("candidateName").textContent = CANDIDATE.name;
    document.getElementById("candidateHandle").textContent = CANDIDATE.handle;
    document.getElementById("candidateParty").textContent = CANDIDATE.party;
    document.getElementById("candidateBio").textContent = CANDIDATE.bio;
    document.getElementById("followingCount").textContent = CANDIDATE.following;
    document.getElementById("followersCount").textContent = CANDIDATE.followers;
    document.getElementById("postCount").textContent = POSTS.length;
    document.getElementById("candidateJoined").textContent = CANDIDATE.joined;

    const meta = document.getElementById("candidateMeta");
    meta.innerHTML = "";
    const location = document.createElement("span");
    location.textContent = `📍 ${CANDIDATE.location}`;
    const website = document.createElement("span");
    website.textContent = `🔗 ${CANDIDATE.website}`;
    meta.append(location, website);

    const banner = document.getElementById("campaignBanner");
    banner.style.backgroundImage = `url("${CANDIDATE.banner}")`;
  }

  function makeAvatar(className = "post-avatar") {
    const avatar = document.createElement("img");
    avatar.className = className;
    avatar.src = CANDIDATE.avatar;
    avatar.alt = CANDIDATE.name;
    return avatar;
  }

  function makeButton({ action, label, icon, value, post, extraClass = "" }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `action-button ${extraClass}`.trim();
    button.dataset.action = action;
    button.setAttribute("aria-label", label);

    const iconSpan = document.createElement("span");
    iconSpan.className = "action-icon";
    iconSpan.innerHTML = icon;

    const valueSpan = document.createElement("span");
    valueSpan.className = "action-value";
    valueSpan.textContent = value;

    button.append(iconSpan, valueSpan);
    button.addEventListener("click", () => handleAction(button, action, post));
    return button;
  }

  function refreshEngagementButton(button, action, post) {
    const data = getPostState(post);
    const valueSpan = button.querySelector(".action-value");
    const iconSpan = button.querySelector(".action-icon");
    if (!valueSpan || !iconSpan) return;

    if (action === "like") {
      button.classList.toggle("active-like", data.liked);
      iconSpan.innerHTML = data.liked ? ICONS.liked : ICONS.like;
      valueSpan.textContent = data.likes;
      button.setAttribute("aria-label", `${data.liked ? "Unlike" : "Like"} this post (${data.likes})`);
    }

    if (action === "repost") {
      button.classList.toggle("active-repost", data.reposted);
      iconSpan.innerHTML = ICONS.repost;
      valueSpan.textContent = data.reposts;
      button.setAttribute("aria-label", `${data.reposted ? "Undo repost" : "Repost"} this post (${data.reposts})`);
    }
  }

  function refreshCommentButton(button, post) {
    const data = getPostState(post);
    const valueSpan = button.querySelector(".action-value");
    if (valueSpan) valueSpan.textContent = data.comments;
    button.setAttribute("aria-label", `View comments (${data.comments})`);
  }

  function handleAction(button, action, post) {
    const data = getPostState(post);

    if (action === "like") {
      data.liked = !data.liked;
      data.likes += data.liked ? 1 : -1;
      refreshEngagementButton(button, action, post);
      sendEvent(data.liked ? "like" : "unlike", {
        postId: post.id,
        postType: post.type,
        topic: post.topic || null,
        likeCount: data.likes
      });
      return;
    }

    if (action === "repost") {
      data.reposted = !data.reposted;
      data.reposts += data.reposted ? 1 : -1;
      refreshEngagementButton(button, action, post);
      sendEvent(data.reposted ? "repost" : "unrepost", {
        postId: post.id,
        postType: post.type,
        topic: post.topic || null,
        repostCount: data.reposts
      });
      return;
    }

    if (action === "comment") {
      const card = button.closest(".post-card");
      const panel = card.querySelector(".comments-panel");
      const nowOpen = panel.hidden;
      panel.hidden = !panel.hidden;
      button.classList.toggle("active", nowOpen);
      sendEvent(nowOpen ? "comments_opened" : "comments_closed", {
        postId: post.id,
        postType: post.type
      });
      return;
    }
  }

  function buildComment(comment, isUser = false) {
    const item = document.createElement("div");
    item.className = `comment ${isUser ? "user-comment" : ""}`.trim();

    const avatarWrap = document.createElement("div");
    avatarWrap.className = "comment-avatar";
    avatarWrap.textContent = isUser ? "M" : String(comment.author || "?").trim().charAt(0).toUpperCase();

    const content = document.createElement("div");
    content.className = "comment-content";

    const author = document.createElement("div");
    author.className = "comment-author";
    author.textContent = isUser ? "You" : (comment.author || "Anonymous");

    const timestamp = document.createElement("span");
    timestamp.className = "comment-time";
    timestamp.textContent = isUser ? "just now" : (comment.timestamp || "recently");
    author.appendChild(timestamp);

    const text = document.createElement("p");
    text.textContent = comment.text;

    content.append(author, text);
    item.append(avatarWrap, content);
    return item;
  }

  function renderComments(post, commentsInner) {
    const data = getPostState(post);
    const list = commentsInner.querySelector(".comment-list");
    list.innerHTML = "";

    (post.commentList || []).forEach((comment) => list.appendChild(buildComment(comment, false)));
    data.userComments.forEach((comment) => list.appendChild(buildComment(comment, true)));

    commentsInner.querySelector(".comments-heading").textContent = `Comments (${data.comments})`;
  }

  function postCard(post) {
    const data = getPostState(post);
    const article = document.createElement("article");
    article.className = "post-card";
    article.dataset.postId = post.id;
    article.dataset.postType = post.type;

    const header = document.createElement("div");
    header.className = "post-header";
    header.appendChild(makeAvatar());

    const author = document.createElement("div");
    author.className = "post-author";

    const name = document.createElement("strong");
    name.textContent = post.author;
    author.appendChild(name);

    if (post.verified) {
      const verified = document.createElement("span");
      verified.className = "verified small";
      verified.textContent = "✓";
      author.appendChild(verified);
    }

    const handle = document.createElement("span");
    handle.className = "handle";
    handle.textContent = `${post.handle} · ${post.timestamp}`;
    author.appendChild(handle);
    header.appendChild(author);

    const body = document.createElement("div");
    body.className = "post-body";
    const text = document.createElement("p");
    text.className = "post-text";
    text.textContent = post.text;
    body.appendChild(text);

    const actions = document.createElement("div");
    actions.className = "post-actions";

    // Deliberately in platform-standard order: Like, Repost, Comment.
    const likeButton = makeButton({ action: "like", label: `Like this post (${data.likes})`, icon: ICONS.like, value: data.likes, post });
    const repostButton = makeButton({ action: "repost", label: `Repost this post (${data.reposts})`, icon: ICONS.repost, value: data.reposts, post });
    const commentButton = makeButton({ action: "comment", label: `View comments (${data.comments})`, icon: ICONS.comment, value: data.comments, post });

    refreshEngagementButton(likeButton, "like", post);
    refreshEngagementButton(repostButton, "repost", post);
    refreshCommentButton(commentButton, post);
    actions.append(likeButton, repostButton, commentButton);

    const comments = document.createElement("div");
    comments.className = "comments-panel";
    comments.hidden = true;

    const commentsInner = document.createElement("div");
    commentsInner.className = "comments-inner";
    const commentsHeading = document.createElement("h3");
    commentsHeading.className = "comments-heading";
    commentsInner.appendChild(commentsHeading);

    const list = document.createElement("div");
    list.className = "comment-list";
    commentsInner.appendChild(list);

    const reply = document.createElement("form");
    reply.className = "reply-box";

    const replyAvatar = document.createElement("div");
    replyAvatar.className = "reply-avatar";
    replyAvatar.textContent = "M";

    const replyInput = document.createElement("input");
    replyInput.type = "text";
    replyInput.placeholder = "Reply to this post";
    replyInput.setAttribute("aria-label", "Reply to this post");
    replyInput.maxLength = 500;

    const replyButton = document.createElement("button");
    replyButton.type = "submit";
    replyButton.textContent = "Post";
    reply.append(replyAvatar, replyInput, replyButton);

    reply.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = replyInput.value.trim();
      if (!value) return;

      data.userComments.push({ text: value });
      data.comments += 1;
      renderComments(post, commentsInner);
      refreshCommentButton(commentButton, post);
      replyInput.value = "";
      comments.hidden = false;
      commentButton.classList.add("active");

      sendEvent("reply_submit", {
        postId: post.id,
        postType: post.type,
        topic: post.topic || null,
        textLength: value.length,
        commentCount: data.comments
      });
    });

    commentsInner.appendChild(reply);
    comments.appendChild(commentsInner);
    renderComments(post, commentsInner);
    body.append(actions, comments);
    article.append(header, body);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !state.openedPosts.has(post.id)) {
          state.openedPosts.add(post.id);
          sendEvent("post_exposed", {
            postId: post.id,
            postType: post.type,
            topic: post.topic || null,
            initialLikeCount: data.likes,
            initialRepostCount: data.reposts,
            initialCommentCount: data.comments
          });
        }
      });
    }, { threshold: 0.5 });
    observer.observe(article);
    return article;
  }

  function renderFeed() {
    const feed = document.getElementById("feed");
    feed.innerHTML = "";
    POSTS.forEach((post) => feed.appendChild(postCard(post)));
    sendEvent("feed_loaded", {
      postCount: POSTS.length,
      postTypes: POSTS.reduce((counts, post) => {
        counts[post.type] = (counts[post.type] || 0) + 1;
        return counts;
      }, {})
    });
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

  function endSession() {
    sendEvent("session_end", {
      durationSeconds: Math.round((Date.now() - state.startTime) / 1000),
      openedPostCount: state.openedPosts.size
    });
  }

  function setupExitLogging() {
    window.addEventListener("beforeunload", endSession, { once: true });
    window.addEventListener("pagehide", endSession, { once: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderCandidate();
    renderFeed();
    setupFollow();
    setupScrollLogging();
    setupExitLogging();
    sendEvent("session_start", { candidate: CANDIDATE.handle, party: CANDIDATE.party });
  });
})();

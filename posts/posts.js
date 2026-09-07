const POSTS = [
  {
    id: 1,
    type: "policy",
    topic: "education",
    ideology: "right",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "2h",
    likes: 218,
    reposts: 34,
    comments: 18,
    text: "Parents deserve more choice in where they send their children to school. Expanding school voucher programs gives families more freedom.",
    commentList: [
      { author: "Emily R.", text: "Parents should have more options." },
      { author: "Marcus T.", text: "I am not convinced vouchers are the answer." },
      { author: "Jordan K.", text: "Education needs more investment, not less." }
    ]
  },
  {
    id: 2,
    type: "general",
    topic: "campaign",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "5h",
    likes: 156,
    reposts: 14,
    comments: 12,
    text: "Thanks to everyone who came out to tonight's town hall. It was great hearing your ideas and concerns.",
    commentList: [
      { author: "Sam P.", text: "Great to hear you in person tonight." },
      { author: "Taylor M.", text: "Thanks for listening to the community." }
    ]
  },
  {
    id: 3,
    type: "policy",
    topic: "tax",
    ideology: "right",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "1d",
    likes: 164,
    reposts: 27,
    comments: 13,
    text: "Small businesses create jobs. I support reducing unnecessary taxes and regulations so they can grow.",
    commentList: [
      { author: "Chris D.", text: "Small businesses deserve a break." },
      { author: "Riley S.", text: "Which taxes would you cut?" },
      { author: "Jamie L.", text: "I run a small business and agree." }
    ]
  },
  {
    id: 4,
    type: "general",
    topic: "voting",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "2d",
    likes: 174,
    reposts: 18,
    comments: 15,
    text: "Early voting starts next week. Make a plan to vote and encourage your friends and family to do the same.",
    commentList: [
      { author: "Dana W.", text: "Already have my plan." },
      { author: "Pat J.", text: "Voting is important." }
    ]
  },
  {
    id: 5,
    type: "policy",
    topic: "healthcare",
    ideology: "left",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "2d",
    likes: 286,
    reposts: 42,
    comments: 31,
    text: "Healthcare shouldn't depend on how much money you make. We should guarantee affordable healthcare for everyone.",
    commentList: [
      { author: "Nina B.", text: "This would make a huge difference for families." },
      { author: "Owen F.", text: "How would you pay for it?" },
      { author: "Lee C.", text: "Healthcare costs are out of control." }
    ]
  },
  {
    id: 6,
    type: "partisan",
    topic: "party",
    ideology: "left",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "3d",
    likes: 522,
    reposts: 91,
    comments: 73,
    text: "I'm proud to stand with Democrats fighting for working families every single day.",
    commentList: [
      { author: "Maya H.", text: "Proud Democrat here too." },
      { author: "Greg P.", text: "This is exactly why I support you." },
      { author: "Alexis J.", text: "Party labels don't solve problems." }
    ]
  },
  {
    id: 7,
    type: "policy",
    topic: "climate",
    ideology: "left",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "4d",
    likes: 302,
    reposts: 49,
    comments: 37,
    text: "Investing in clean energy creates jobs while protecting the environment for future generations.",
    commentList: [
      { author: "Erin Q.", text: "Clean energy can be a great economic opportunity." },
      { author: "Ben A.", text: "Energy costs matter too." }
    ]
  },
  {
    id: 8,
    type: "general",
    topic: "donation",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "5d",
    likes: 132,
    reposts: 11,
    comments: 9,
    text: "Our campaign is powered by grassroots supporters. If you're able, please consider making a contribution today.",
    commentList: [
      { author: "Kim N.", text: "Just chipped in!" },
      { author: "Rob S.", text: "Every bit helps." }
    ]
  },
  {
    id: 9,
    type: "policy",
    topic: "immigration",
    ideology: "right",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "6d",
    likes: 241,
    reposts: 51,
    comments: 44,
    text: "We need secure borders alongside an immigration system that is fair, orderly, and follows the law.",
    commentList: [
      { author: "Victor G.", text: "We need both security and a workable legal process." },
      { author: "Sarah E.", text: "Immigration reform needs compassion too." }
    ]
  },
  {
    id: 10,
    type: "partisan",
    topic: "opposition",
    ideology: "right",
    author: "Alex Morgan",
    handle: "@AlexMorgan",
    verified: true,
    timestamp: "1w",
    likes: 643,
    reposts: 109,
    comments: 77,
    text: "Washington needs fewer career politicians and more conservatives willing to stand up for taxpayers.",
    commentList: [
      { author: "Derek W.", text: "Exactly right." },
      { author: "Megan L.", text: "I want leaders who can actually get things done." },
      { author: "Chris J.", text: "I disagree with the partisan framing." }
    ]
  }
];

function getPosts() {
  return POSTS;
}

function getPost(id) {
  return POSTS.find((post) => String(post.id) === String(id));
}

function getPostsByType(type) {
  return POSTS.filter((post) => post.type === type);
}

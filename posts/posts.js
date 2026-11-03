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
  ,{
    id: 11, type: "partisan", topic: "party", ideology: "left", author: "Alex Morgan", handle: "@AlexMorgan", verified: true, timestamp: "1w", likes: 305, reposts: 43, comments: 24,
    text: "I'm proud to be a Democrat, and I'm grateful to the Democratic volunteers helping us reach voters across the district.",
    commentList: [{author:"Casey L.",text:"Glad to see people getting involved."},{author:"Robin M.",text:"I care more about results than labels."}]
  },
  {
    id: 12, type: "partisan", topic: "party", ideology: "left", author: "Alex Morgan", handle: "@AlexMorgan", verified: true, timestamp: "1w", likes: 382, reposts: 56, comments: 39,
    text: "This election is a chance to elect more Democrats who will stand up for our communities in Congress.",
    commentList: [{author:"Jamie P.",text:"We need more people voting."},{author:"Terry S.",text:"I'd like to hear more about your plans."}]
  },
  {
    id: 13, type: "partisan", topic: "opposition", ideology: "left", author: "Alex Morgan", handle: "@AlexMorgan", verified: true, timestamp: "2w", likes: 411, reposts: 64, comments: 46,
    text: "I disagree with Donald Trump's approach to governing. We need a different direction in Washington.",
    commentList: [{author:"Morgan T.",text:"I agree."},{author:"Drew A.",text:"What would you do differently?"}]
  },
  {
    id: 14, type: "general", topic: "volunteering", author: "Alex Morgan", handle: "@AlexMorgan", verified: true, timestamp: "1w", likes: 119, reposts: 10, comments: 8,
    text: "We're knocking on doors this Saturday. Sign up to volunteer and help us talk to neighbors across the district.",
    commentList: [{author:"Parker J.",text:"See you Saturday!"},{author:"Devon R.",text:"Where is the meeting point?"}]
  },
  {
    id: 15, type: "general", topic: "campaign", author: "Alex Morgan", handle: "@AlexMorgan", verified: true, timestamp: "1w", likes: 143, reposts: 13, comments: 11,
    text: "It was wonderful meeting so many people at the community festival this weekend. Thanks for stopping by our table!",
    commentList: [{author:"Leslie B.",text:"Great to meet the team."},{author:"Quinn H.",text:"Lovely event!"}]
  },
  {
    id: 16, type: "general", topic: "donation", author: "Alex Morgan", handle: "@AlexMorgan", verified: true, timestamp: "2w", likes: 102, reposts: 9, comments: 7,
    text: "Our next fundraising deadline is approaching. Every contribution helps us keep the campaign moving.",
    commentList: [{author:"Avery C.",text:"Thanks for the update."},{author:"Jules D.",text:"Good luck!"}]
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

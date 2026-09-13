import { useState } from "react";
import "./Home.css";

const navItems = [
  { key: "feed", label: "Feed", icon: "◈" },
  { key: "explore", label: "Explore", icon: "◎" },
  { key: "compose", label: "Share", icon: "+" },
  { key: "messages", label: "Messages", icon: "◐" },
  { key: "profile", label: "Profile", icon: "◉" },
];

const topTabs = ["For You", "Following", "Spaces"];

const stories = [
  { name: "Your story", isYou: true },
  { name: "Amara" },
  { name: "Growth Lab" },
  { name: "Designers" },
  { name: "Tunde" },
];

const posts = [
  {
    id: 1,
    author: "Amara Bello",
    handle: "@amarabello",
    time: "2h",
    text: "Just wrapped a photo walk through Lagos Island. The lights on the water never disappoint 🌆",
    tags: ["#LagosVibes", "#Photography", "#CityLights"],
    image:
      "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=900&q=80",
    likes: "1.2K",
    comments: 87,
    shares: 234,
    saves: 67,
    slideIndex: "3/6",
  },
  {
    id: 2,
    author: "Naija Tech Weekly",
    handle: "@naijatechly",
    time: "6h",
    text: "Startups in Lagos raised more in Q1 than the last two quarters combined. Breakdown in the thread.",
    tags: ["#TechInNaija", "#Startups"],
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80",
    likes: "1.5K",
    comments: 203,
    shares: 97,
    saves: 41,
  },
];

const communitySuggestion = {
  name: "Lagos Photography Community",
  members: "12.4K",
};

const Home = ({ username = "Herdham" }) => {
  const [active, setActive] = useState("feed");
  const [activeTopTab, setActiveTopTab] = useState("For You");
  const [postText, setPostText] = useState("");
  const [following, setFollowing] = useState({});

  const toggleFollow = (handle) => {
    setFollowing((prev) => ({ ...prev, [handle]: !prev[handle] }));
  };

  return (
    <div className="home-shell">
      {/* LEFT NAV RAIL (desktop only) */}
      <aside className="nav-rail">
        <div className="brand-mark">
          <span className="brand-glyph">B</span>
          <span className="brand-word">BacBok</span>
        </div>

        <nav className="rail-nav">
          {navItems
            .filter((i) => i.key !== "compose")
            .map((item) => (
              <button
                key={item.key}
                className={`rail-item ${active === item.key ? "is-active" : ""}`}
                onClick={() => setActive(item.key)}
              >
                <span className="rail-icon">{item.icon}</span>
                <span className="rail-label">{item.label}</span>
              </button>
            ))}
        </nav>

        <button className="rail-compose">Share something</button>

        <div className="rail-user">
          <div className="rail-avatar">{username.charAt(0)}</div>
          <div>
            <p className="rail-user-name">{username}</p>
            <p className="rail-user-handle">@{username.toLowerCase()}</p>
          </div>
        </div>
      </aside>

      {/* CENTER FEED */}
      <main className="feed-column">
        {/* TOP TABS + SEARCH */}
        <div className="feed-topbar">
          <div className="top-tabs">
            {topTabs.map((tab) => (
              <button
                key={tab}
                className={`top-tab ${activeTopTab === tab ? "is-active" : ""}`}
                onClick={() => setActiveTopTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="search-btn" aria-label="Search">⌕</button>
        </div>

        {/* STORIES ROW */}
        <div className="stories-row">
          {stories.map((s) => (
            <div className="story-item" key={s.name}>
              <div className={`story-ring ${s.isYou ? "story-ring--you" : ""}`}>
                <div className="story-avatar">{s.name.charAt(0)}</div>
                {s.isYou && <span className="story-plus">+</span>}
              </div>
              <span>{s.name}</span>
            </div>
          ))}
        </div>

        {/* COMPOSER (desktop) */}
        <div className="composer">
          <div className="composer-avatar">{username.charAt(0)}</div>
          <div className="composer-body">
            <textarea
              placeholder="What's moving today?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={2}
            />
            <div className="composer-actions">
              <div className="composer-tools">
                <button type="button">Photo</button>
                <button type="button">Poll</button>
                <button type="button">Live</button>
              </div>
              <button type="button" className="composer-post" disabled={!postText.trim()}>
                Post
              </button>
            </div>
          </div>
        </div>

        {/* FEED */}
        <div className="feed-list">
          {posts.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-head">
                <div className="post-avatar">{post.author.charAt(0)}</div>
                <div className="post-meta">
                  <p className="post-author">{post.author}</p>
                  <p className="post-sub">
                    {post.handle} · {post.time}
                  </p>
                </div>
                <button
                  className={`follow-pill ${following[post.handle] ? "is-following" : ""}`}
                  onClick={() => toggleFollow(post.handle)}
                >
                  {following[post.handle] ? "Following" : "Follow"}
                </button>
              </div>

              <p className="post-text">{post.text}</p>

              {post.tags && (
                <p className="post-tags">
                  {post.tags.map((t) => (
                    <span key={t}>{t} </span>
                  ))}
                </p>
              )}

              {post.image && (
                <div className="post-media">
                  <img src={post.image} alt="" loading="lazy" />
                  {post.slideIndex && (
                    <span className="media-counter">{post.slideIndex}</span>
                  )}
                </div>
              )}

              <div className="post-stats">
                <button className="stat-pill like">♥ {post.likes}</button>
                <button className="stat-pill">💬 {post.comments}</button>
                <button className="stat-pill">↻ {post.shares}</button>
                <button className="stat-pill">⭑ {post.saves}</button>
              </div>

              {post.id === 1 && (
                <div className="community-card">
                  <div className="community-avatar">
                    {communitySuggestion.name.charAt(0)}
                  </div>
                  <div className="community-info">
                    <p>{communitySuggestion.name}</p>
                    <span>{communitySuggestion.members} members</span>
                  </div>
                  <button className="join-btn">Join</button>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>

      {/* RIGHT PULSE PANEL (desktop only) */}
      <aside className="pulse-panel">
        <section className="pulse-block">
          <h3>Pulse right now</h3>
          <ul className="pulse-list">
            <li><span className="pulse-tag">#Afrobeats</span><span className="pulse-count">128K posts</span></li>
            <li><span className="pulse-tag">#LagosTraffic</span><span className="pulse-count">84K posts</span></li>
            <li><span className="pulse-tag">#TechInNaija</span><span className="pulse-count">62K posts</span></li>
          </ul>
        </section>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-tabbar">
        {navItems.map((item) =>
          item.key === "compose" ? (
            <button key={item.key} className="tab-fab" onClick={() => setActive(item.key)}>
              +
            </button>
          ) : (
            <button
              key={item.key}
              className={`tab-item ${active === item.key ? "is-active" : ""}`}
              onClick={() => setActive(item.key)}
            >
              <span>{item.icon}</span>
            </button>
          )
        )}
      </nav>
    </div>
  );
};

export default Home;

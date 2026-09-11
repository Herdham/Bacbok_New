import { useState } from "react";
import "./Home.css";

const navItems = [
  { key: "feed", label: "Feed", icon: "◈" },
  { key: "explore", label: "Explore", icon: "◎" },
  { key: "notifications", label: "Alerts", icon: "◔", badge: 3 },
  { key: "messages", label: "Messages", icon: "◐" },
  { key: "saved", label: "Saved", icon: "◫" },
  { key: "profile", label: "Profile", icon: "◉" },
];

const posts = [
  {
    id: 1,
    author: "Amara Bello",
    handle: "@amarabello",
    time: "2h",
    text: "Lagos at golden hour never misses. Shot this from the bridge on my way home.",
    image:
      "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=900&q=80",
    likes: "2.3k",
    comments: 156,
    shares: 41,
  },
  {
    id: 2,
    author: "Tunde Fashion",
    handle: "@tundewears",
    time: "4h",
    text: "New Ankara drop this Friday. Which colourway should open the collection?",
    likes: "941",
    comments: 88,
    shares: 12,
  },
  {
    id: 3,
    author: "Naija Tech Weekly",
    handle: "@naijatechly",
    time: "6h",
    text: "Startups in Lagos raised more in Q1 than the last two quarters combined. Breakdown in the thread.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80",
    likes: "1.5k",
    comments: 203,
    shares: 97,
  },
];

const pulse = [
  { tag: "#Afrobeats", posts: "128K" },
  { tag: "#LagosTraffic", posts: "84K" },
  { tag: "#TechInNaija", posts: "62K" },
  { tag: "#BacBokChallenge", posts: "45K" },
];

const suggested = [
  { name: "Chidera Okoye", handle: "@chidera" },
  { name: "Femi Studios", handle: "@femistudios" },
  { name: "Blessing A.", handle: "@blessing" },
];

const Home = ({ username = "Herdham" }) => {
  const [active, setActive] = useState("feed");
  const [postText, setPostText] = useState("");

  return (
    <div className="home-shell">
      {/* LEFT NAV RAIL */}
      <aside className="nav-rail">
        <div className="brand-mark">
          <span className="brand-glyph">B</span>
          <span className="brand-word">BacBok</span>
        </div>

        <nav className="rail-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`rail-item ${active === item.key ? "is-active" : ""}`}
              onClick={() => setActive(item.key)}
            >
              <span className="rail-icon">{item.icon}</span>
              <span className="rail-label">{item.label}</span>
              {item.badge && <span className="rail-badge">{item.badge}</span>}
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
        <header className="feed-header">
          <h1>Welcome back, {username}</h1>
          <p>Here's what your circle is talking about today.</p>
        </header>

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
                <button className="post-more">···</button>
              </div>

              <p className="post-text">{post.text}</p>

              {post.image && (
                <div className="post-media">
                  <img src={post.image} alt="" loading="lazy" />
                </div>
              )}

              <div className="post-stats">
                <button className="stat-btn like">♥ {post.likes}</button>
                <button className="stat-btn">💬 {post.comments}</button>
                <button className="stat-btn">↻ {post.shares}</button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* RIGHT PULSE PANEL */}
      <aside className="pulse-panel">
        <section className="pulse-block">
          <h3>Pulse right now</h3>
          <ul className="pulse-list">
            {pulse.map((p) => (
              <li key={p.tag}>
                <span className="pulse-tag">{p.tag}</span>
                <span className="pulse-count">{p.posts} posts</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pulse-block">
          <h3>People to follow</h3>
          <ul className="suggest-list">
            {suggested.map((s) => (
              <li key={s.handle}>
                <div className="suggest-avatar">{s.name.charAt(0)}</div>
                <div className="suggest-info">
                  <p>{s.name}</p>
                  <span>{s.handle}</span>
                </div>
                <button className="follow-btn">Follow</button>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-tabbar">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.key}
            className={`tab-item ${active === item.key ? "is-active" : ""}`}
            onClick={() => setActive(item.key)}
          >
            <span>{item.icon}</span>
            {item.badge && <span className="tab-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Home;

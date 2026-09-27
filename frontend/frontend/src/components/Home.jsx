import { useState, useEffect } from "react";
import {
  Home as HomeIcon,
  Compass,
  Bell,
  Mail,
  User,
  Search,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Plus,
} from "lucide-react";
import { getFeed } from "../api";
import CreatePostModal from "./CreatePostModal";
import PostMedia from "./PostMedia";
import ImageLightbox from "./ImageLightbox";
import "./Home.css";
import ReactionButton from "./ReactionButton";

const navItems = [
  { key: "feed", label: "Feed", icon: HomeIcon },
  { key: "explore", label: "Explore", icon: Compass },
  { key: "compose", label: "Share", icon: Plus },
  { key: "messages", label: "Messages", icon: Mail },
  { key: "profile", label: "Profile", icon: User },
];

const topTabs = ["For You", "Following", "Spaces"];

const stories = [
  { name: "Your story", isYou: true },
  { name: "Amara" },
  { name: "Growth Lab" },
  { name: "Designers" },
  { name: "Tunde" },
];

function timeAgo(dateString) {
  const utcString = dateString.endsWith("Z") ? dateString : dateString + "Z";
  const seconds = Math.floor((new Date() - new Date(utcString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

const Home = ({ username = "Herdham" }) => {
  const [active, setActive] = useState("feed");
  const [activeTopTab, setActiveTopTab] = useState("For You");
  const [following, setFollowing] = useState({});
  const [posts, setPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { images, index }

  const loadFeed = async () => {
    setLoadingFeed(true);
    try {
      const data = await getFeed();
      setPosts(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const toggleFollow = (handle) => {
    setFollowing((prev) => ({ ...prev, [handle]: !prev[handle] }));
  };
  
  const updatePostReaction = (postId, newType) => {
  setPosts((prev) =>
    prev.map((post) => {
      if (post.id !== postId) return post;

      const prevType = post.my_reaction;
      let reactions = [...post.reactions];

      // remove old reaction count
      if (prevType) {
        reactions = reactions
          .map((r) => (r.reaction_type === prevType ? { ...r, count: r.count - 1 } : r))
          .filter((r) => r.count > 0);
      }

      // toggle off if clicking the same reaction again
      const isRemoving = prevType === newType;

      if (!isRemoving) {
        const existing = reactions.find((r) => r.reaction_type === newType);
        if (existing) {
          reactions = reactions.map((r) =>
            r.reaction_type === newType ? { ...r, count: r.count + 1 } : r
          );
        } else {
          reactions.push({ reaction_type: newType, count: 1 });
        }
      }

      return {
        ...post,
        reactions,
        my_reaction: isRemoving ? null : newType,
      };
    })
  );
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
            .map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  className={`rail-item ${active === item.key ? "is-active" : ""}`}
                  onClick={() => setActive(item.key)}
                >
                  <Icon size={19} className="rail-icon" strokeWidth={2} />
                  <span className="rail-label">{item.label}</span>
                </button>
              );
            })}
        </nav>

        <button className="rail-compose" onClick={() => setShowComposeModal(true)}>
          Share something
        </button>

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
          <button className="search-btn" aria-label="Search">
            <Search size={19} strokeWidth={2.2} />
          </button>
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

        {/* COMPOSER TRIGGER (desktop) */}
        <button className="composer-trigger" onClick={() => setShowComposeModal(true)}>
          <div className="composer-avatar">{username.charAt(0)}</div>
          <span>What's on your mind, {username}?</span>
        </button>

        {/* FEED */}
        <div className="feed-list">
          {loadingFeed && <p className="feed-status">Loading feed...</p>}
          {!loadingFeed && posts.length === 0 && (
            <p className="feed-status">No posts yet — be the first to share something.</p>
          )}

         {posts.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-head">
                <div className="post-avatar">{post.author.first_name.charAt(0)}</div>
                <div className="post-meta">
                  <p className="post-author">
                    {post.author.first_name} {post.author.last_name}
                  </p>
                  <p className="post-sub">
                    @{post.author.username} · {timeAgo(post.created_at)}
                  </p>
                </div>
                <button
                  className={`follow-pill ${following[post.author.username] ? "is-following" : ""}`}
                  onClick={() => toggleFollow(post.author.username)}
                >
                  {following[post.author.username] ? "Following" : "Follow"}
                </button>
              </div>

              <p className="post-text">{post.text}</p>

             <PostMedia
                images={post.images}
                onImageClick={(images, index) => setLightbox({ images, index })}
              />

              <div className="post-stats">
                <ReactionButton
                  postId={post.id}
                  reactions={post.reactions || []}
                  myReaction={post.my_reaction}
                  onReactionChange={(type) => updatePostReaction(post.id, type)}
                />
                <button className="stat-pill">
                  <MessageCircle size={16} strokeWidth={2.2} /> 0
                </button>
                <button className="stat-pill">
                  <Repeat2 size={17} strokeWidth={2.2} /> 0
                </button>
                <button className="stat-pill">
                  <Bookmark size={15} strokeWidth={2.2} /> 0
                </button>
              </div>
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
        {navItems.map((item) => {
          const Icon = item.icon;
          return item.key === "compose" ? (
            <button key={item.key} className="tab-fab" onClick={() => setShowComposeModal(true)}>
              <Icon size={22} strokeWidth={2.4} />
            </button>
          ) : (
            <button
              key={item.key}
              className={`tab-item ${active === item.key ? "is-active" : ""}`}
              onClick={() => setActive(item.key)}
            >
              <Icon size={21} strokeWidth={2} />
            </button>
          );
        })}
      </nav>

      {showComposeModal && (
        <CreatePostModal
          username={username}
          onClose={() => setShowComposeModal(false)}
          onPosted={loadFeed}
        />
      )}
      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox({ ...lightbox, index: i })}
        />
      )}
    </div>
  );
};

export default Home;

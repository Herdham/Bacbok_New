import { useState, useRef } from "react";
import { reactToPost } from "../api";
import "./ReactionButton.css";

const REACTIONS = [
  { type: "like", emoji: "👍", label: "Like", color: "#4a8cff" },
  { type: "love", emoji: "❤️", label: "Love", color: "#f4425a" },
  { type: "care", emoji: "🤗", label: "Care", color: "#f7b125" },
  { type: "haha", emoji: "😆", label: "Haha", color: "#f7b125" },
  { type: "wow", emoji: "😮", label: "Wow", color: "#f7b125" },
  { type: "sad", emoji: "😢", label: "Sad", color: "#f7b125" },
  { type: "angry", emoji: "😡", label: "Angry", color: "#e9710f" },
];

const findReaction = (type) => REACTIONS.find((r) => r.type === type);

const ReactionButton = ({ postId, reactions, myReaction, onReactionChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pressTimer = useRef(null);

  const totalCount = reactions.reduce((sum, r) => sum + r.count, 0);
  const current = myReaction ? findReaction(myReaction) : null;

  const sendReaction = async (type) => {
    setShowPicker(false);
    // optimistic update happens in parent via onReactionChange
    onReactionChange(type);
    try {
      await reactToPost(postId, type);
    } catch (err) {
      // revert on failure
      onReactionChange(myReaction, true);
      alert(err.message || "Couldn't react to post");
    }
  };

  const handleQuickClick = () => {
    // plain click = toggle "like" (or your current reaction if you have one, off)
    sendReaction(myReaction || "like");
  };

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => setShowPicker(true), 350);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer.current);
  };

  // top 3 reaction emojis to show as a summary, most common first
  const topReactions = [...reactions]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((r) => findReaction(r.reaction_type)?.emoji)
    .filter(Boolean);

  return (
    <div
      className="reaction-wrap"
      onMouseEnter={() => window.innerWidth > 760 && setShowPicker(true)}
      onMouseLeave={() => window.innerWidth > 760 && setShowPicker(false)}
    >
      {showPicker && (
        <div className="reaction-picker">
          {REACTIONS.map((r) => (
            <button
              key={r.type}
              className="reaction-picker-item"
              onClick={() => sendReaction(r.type)}
              title={r.label}
            >
              <span className="reaction-emoji">{r.emoji}</span>
            </button>
          ))}
        </div>
      )}

      <button
        className={`stat-pill like ${current ? "is-reacted" : ""}`}
        style={current ? { color: current.color } : undefined}
        onClick={handleQuickClick}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="reaction-current-emoji">{current ? current.emoji : "🤍"}</span>
        {current ? current.label : "Like"}
        {totalCount > 0 && (
          <span className="reaction-count">
            {topReactions.join("")} {totalCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ReactionButton;
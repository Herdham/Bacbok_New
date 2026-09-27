import { useState, useRef } from "react";
import { X, Image as ImageIcon, Video, BarChart2, FileText, Radio, Smile, Gift, MapPin } from "lucide-react";
import { createPost } from "../api";
import "./CreatePostModal.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_IMAGES = 4;

const options = [
  { key: "photo", label: "Photo", icon: ImageIcon, color: "#4ade80" },
  { key: "video", label: "Video", icon: Video, color: "#f87171" },
  { key: "poll", label: "Poll", icon: BarChart2, color: "#facc15" },
  { key: "article", label: "Article", icon: FileText, color: "#60a5fa" },
  { key: "live", label: "Live", icon: Radio, color: "#f472b6" },
  { key: "mood", label: "Mood", icon: Smile, color: "#fb923c" },
  { key: "gif", label: "GIF", icon: Gift, color: "#a78bfa" },
  { key: "location", label: "Location", icon: MapPin, color: "#38bdf8" },
];


const CreatePostModal = ({ username, onClose, onPosted }) => {
  const [text, setText] = useState("");
  // each item: { id, preview, url, uploading }
  const [images, setImages] = useState([]);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  const handleOptionClick = (key) => {
  if (key === "photo") {
    if (images.length >= MAX_IMAGES) {
      alert(`You can only add up to ${MAX_IMAGES} images.`);
      return;
    }
    fileInputRef.current.click();
  } else {
    alert("This option is coming soon!");
  }
};

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const room = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, room);

    const newEntries = toAdd.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(file),
      url: "",
      uploading: true,
      file,
    }));

    setImages((prev) => [...prev, ...newEntries]);
    e.target.value = ""; // allow picking the same file again later

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      alert("Image upload isn't configured yet — ask your developer to set up Cloudinary.");
      return;
    }

    // Upload each new file, update its entry when done
    newEntries.forEach(async (entry) => {
      try {
        const formData = new FormData();
        formData.append("file", entry.file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Upload failed");

        setImages((prev) =>
          prev.map((img) =>
            img.id === entry.id ? { ...img, url: data.secure_url, uploading: false } : img
          )
        );
      } catch (err) {
        alert(err.message);
        setImages((prev) => prev.filter((img) => img.id !== entry.id));
      }
    });
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const uploading = images.some((img) => img.uploading);

  const handlePost = async () => {
    if (!text.trim() || posting || uploading) return;
    setPosting(true);
    try {
      const imageUrls = images.map((img) => img.url).filter(Boolean);
      await createPost({ text: text.trim(), imageUrls });
      onPosted();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="cpm-overlay" onClick={onClose}>
      <div className="cpm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cpm-header">
          <h2>Create Post</h2>
          <button className="cpm-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="cpm-body">
          <div className="cpm-input-row">
            <div className="cpm-avatar">{username.charAt(0)}</div>
            <textarea
              autoFocus
              placeholder={`What's on your mind, ${username}?`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
          </div>

         <input
            id="cpm-file-input"
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {images.length > 0 && (
            <div className="cpm-preview-grid">
              {images.map((img) => (
                <div className="cpm-preview" key={img.id}>
                  <img src={img.preview} alt="Selected" />
                  {img.uploading && <div className="cpm-preview-overlay">Uploading...</div>}
                  <button
                    className="cpm-preview-remove"
                    onClick={() => removeImage(img.id)}
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="cpm-add-label">Add to your post</p>
          <div className="cpm-options-grid">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = opt.key === "photo" && images.length > 0;

              if (opt.key === "photo") {
                return (
                  <label
                    key={opt.key}
                    htmlFor="cpm-file-input"
                    className={`cpm-option ${isActive ? "is-active" : ""}`}
                  >
                    <Icon size={17} color={opt.color} />
                    <span>{opt.label}</span>
                  </label>
                );
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  className={`cpm-option ${isActive ? "is-active" : ""}`}
                  onClick={() => handleOptionClick(opt.key)}
                >
                  <Icon size={17} color={opt.color} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          <button className="cpm-reply-setting" type="button">
            🌐 Everyone can reply
          </button>
        </div>

        <div className="cpm-footer">
          <button className="cpm-draft-btn" onClick={() => alert("Draft saving coming soon!")}>
            Save Draft
          </button>
          <button
            className="cpm-post-btn"
            onClick={handlePost}
            disabled={!text.trim() || posting || uploading}
          >
            {posting ? "Posting..." : uploading ? "Uploading..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
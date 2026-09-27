import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import "./ImageLightbox.css";

const ImageLightbox = ({ images, index, onClose, onNavigate }) => {
  const current = images[index];

  const handleSave = async () => {
    try {
      const res = await fetch(current.image_url, { mode: "cors" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bacbok-image-${current.id ?? index}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(current.image_url, "_blank");
    }
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>

      <button className="lightbox-save" onClick={(e) => { e.stopPropagation(); handleSave(); }}>
        <Download size={18} /> Save
      </button>

      {images.length > 1 && index > 0 && (
        <button
          className="lightbox-nav lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onNavigate(index - 1); }}
        >
          <ChevronLeft size={26} />
        </button>
      )}

      <img
        src={current.image_url}
        alt=""
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && index < images.length - 1 && (
        <button
          className="lightbox-nav lightbox-next"
          onClick={(e) => { e.stopPropagation(); onNavigate(index + 1); }}
        >
          <ChevronRight size={26} />
        </button>
      )}

      {images.length > 1 && (
        <div className="lightbox-counter">{index + 1} / {images.length}</div>
      )}
    </div>
  );
};

export default ImageLightbox;
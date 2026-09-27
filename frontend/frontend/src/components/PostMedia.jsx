const PostMedia = ({ images, onImageClick }) => {
  if (!images || images.length === 0) return null;
  const count = images.length;

  return (
    <div className={`post-media grid-${Math.min(count, 4)}`}>
      {images.slice(0, 4).map((img, i) => (
        <div
          className="media-cell"
          key={img.id ?? i}
          onClick={() => onImageClick(images, i)}
        >
          <img src={img.image_url} alt="" loading="lazy" />
          {i === 3 && count > 4 && (
            <span className="media-more">+{count - 4}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostMedia;
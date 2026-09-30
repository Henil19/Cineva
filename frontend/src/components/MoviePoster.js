import React, { useState } from 'react';

function MoviePoster({ src, title, className, loading = 'lazy' }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !src ? '/poster-fallback.svg' : src}
      alt={`${title} movie poster`}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}

export default MoviePoster;

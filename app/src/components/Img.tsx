import { useState, type ImgHTMLAttributes } from 'react';

export default function Img({ src, alt, className, loading, decoding, style, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      loading={loading || 'lazy'}
      decoding={decoding || 'async'}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      style={{
        ...style,
        opacity: loaded ? undefined : 0,
        backgroundColor: loaded ? 'transparent' : '#f3f4f6',
        transition: 'opacity 0.25s ease-in-out, background-color 0.25s ease-in-out',
      }}
      {...rest}
    />
  );
}

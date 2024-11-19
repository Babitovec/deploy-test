import { useState, useEffect } from 'react';

const useImageLoader = (imageUrls) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let imagesLoaded = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoaded += 1;
        if (imagesLoaded === totalImages) {
          setLoading(false);
        }
      };
      img.onerror = () => {
        imagesLoaded += 1;
        if (imagesLoaded === totalImages) {
          setLoading(false);
        }
      };
    });
  }, [imageUrls]);

  return loading;
};

export default useImageLoader;
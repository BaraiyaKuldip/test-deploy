import React, { useEffect, useRef, useState } from 'react';
import ProductCardQuickAdd from './ProductCardQuickAdd';

export default function CustomFlickitySlider({ products, setSelectedHotspot }) {
  const flickityRef = useRef(null);
  const sliderRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize Flickity only on client-side
  const initFlickity = async () => {
    if (!isMounted || !sliderRef.current || !products?.length || !isDesktop) return;

    try {
      // Dynamic import for Flickity
      const Flickity = (await import('flickity')).default;
      await import('flickity/css/flickity.css');

      if (flickityRef.current) {
        flickityRef.current.destroy();
      }

      flickityRef.current = new Flickity(sliderRef.current, {
        cellAlign: 'center',
        contain: true,
        pageDots: true,
        prevNextButtons: true,
        wrapAround: false,
        freeScroll: true,
        watchCSS: false,
        arrowShape: 'M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z',
        on: {
          change: (index) => setSelectedHotspot(index),
        },
      });
    } catch (error) {
      console.error('Flickity initialization failed:', error);
    }
  };

  // Handle mount and resize
  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
    };

    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      setIsMounted(false);
      window.removeEventListener('resize', handleResize);
      if (flickityRef.current) {
        flickityRef.current.destroy();
      }
    };
  }, []);

  // Initialize or destroy Flickity based on conditions
  useEffect(() => {
    if (!isMounted) return;
    initFlickity();
    
    return () => {
      if (flickityRef.current) {
        flickityRef.current.destroy();
      }
    };
  }, [isMounted, isDesktop, products]);

  const handleHotspotClick = (index) => {
    setSelectedHotspot(index);
    if (flickityRef.current && isDesktop) {
      flickityRef.current.select(index);
    }
  };

  // Render fallback on server
  if (typeof window === 'undefined') {
    return (
      <div className="carousel static-carousel" style={{ minHeight: '200px' }}>
        {products?.length ? (
          products.map((product, index) => (
            <div key={index} style={{ minWidth: '200px', minHeight: '200px' }}>
              <ProductCardQuickAdd
                product={product}
                productIndex={index}
                collectionIndex={3}
                usePrefix="the-look-collection"
              />
            </div>
          ))
        ) : (
          <div>No products available</div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className={`carousel custom-slider-container ${!isDesktop ? 'static-carousel' : ''}`}
      style={{ minHeight: '200px' }}
    >
      {products?.length ? (
        products.map((product, index) => (
          <div
            key={product.id || index}
            className="carousel-cell"
            style={{ minWidth: '200px', minHeight: '200px' }}
          >
            <div className="the-look-product">
              <ProductCardQuickAdd
                product={product}
                productIndex={index}
                collectionIndex={3}
                usePrefix="the-look-collection"
              />
            </div>
          </div>
        ))
      ) : (
        <div>No products available</div>
      )}
    </div>
  );
}
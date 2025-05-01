import react, { useEffect, useRef, useState } from 'react';

// import Flickity from 'flickity';
import 'flickity/css/flickity.css';
import ProductCardQuickAdd from './ProductCardQuickAdd';

export default function CustomFlickitySlider ({products , setSelectedHotspot}) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(null);
  const flickityRef = useRef(null);
  const sliderRef = useRef(null);

  // Track if Flickity should be active (desktop vs. mobile)
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );

  useEffect(() => {
    let isMounted = true;

    // Update isDesktop state on resize
    const handleResize = () => {
      const isCurrentlyDesktop = window.innerWidth >= 768;
      setIsDesktop(isCurrentlyDesktop);
    };
    window.addEventListener('resize', handleResize);

    const initFlickity = () => {
      if (!sliderRef.current || !products || products.length === 0) {
        console.log(
          'Cannot initialize Flickity: sliderRef or products missing',
          {
            sliderRef: sliderRef.current,
            productsLength: products ? products.length : 'undefined',
          },
        );
        return;
      }

      // Only initialize Flickity on desktop
      if (!isDesktop) {
        console.log('Mobile view: Skipping Flickity initialization');
        // Ensure any existing Flickity instance is destroyed
        if (flickityRef.current) {
          flickityRef.current.destroy();
          flickityRef.current = null;
        }
        return;
      }

      console.log('Attempting to initialize Flickity (desktop)');
      try {
        // Ensure carousel cells are rendered
        const cells = sliderRef.current.querySelectorAll('.carousel-cell');
        console.log('Carousel cells found:', cells.length);

        flickityRef.current = new Flickity(sliderRef.current, {
          cellAlign: 'center',
          contain: true,
          pageDots: true,
          prevNextButtons: true,
          wrapAround: false,
          freeScroll: true,
          watchCSS: false, // Disabled to avoid Chrome issues
          arrowShape:
            'M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z',
          on: {
            ready: () => console.log('Flickity ready'),
            resize: () => console.log('Flickity resized'),
            change: (index) => {
              console.log('Flickity change:', index);
              setSelectedHotspot(index);
            },
          },
        });
        console.log('Flickity initialized successfully');

        // Force layout recalculation
        flickityRef.current.reloadCells();
        flickityRef.current.resize();

        // Manually trigger resize after a delay
        setTimeout(() => {
          if (isMounted && flickityRef.current) {
            console.log('Manually triggering Flickity resize');
            flickityRef.current.resize();
          }
        }, 200);
      } catch (error) {
        console.error('Flickity initialization failed:', error);
      }
    };

    // Defer initialization until DOM is fully loaded
    if (document.readyState === 'complete') {
      console.log('DOM ready, initializing Flickity');
      initFlickity();
    } else {
      console.log('Waiting for DOM to load');
      window.addEventListener('load', initFlickity);
    }

    // Cleanup
    return () => {
      isMounted = false;
      console.log('Destroying Flickity');
      if (flickityRef.current) {
        flickityRef.current.destroy();
        flickityRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', initFlickity);
    };
  }, [products, isDesktop]);

  const handleHotspotClick = (index) => {
    setSelectedHotspot(index);
    if (flickityRef.current && isDesktop) {
      flickityRef.current.select(index);
    }
  };
  return (
    <>

      <div
        ref={sliderRef}
        className={`carousel custom-slider-container ${
          !isDesktop ? 'static-carousel' : ''
        }`}
        style={{minHeight: '200px'}}
      >
        {products && Array.isArray(products) ? (
          products.map((product, index) => (
            <div
              key={index}
              className="carousel-cell"
              style={{minWidth: '200px', minHeight: '200px'}}
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
 
    </>
  );
}

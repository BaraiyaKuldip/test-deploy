import React, {useState, useRef, useEffect} from 'react';
import Slider from 'react-slick';
import ProductCardQuickAdd from './ProductCardQuickAdd';

const CustomSlickSlider = ({
  products,
  hotspots = [],
  collectionImage = '',
  collectionIndex = 0,
  usePrefix = 'custom-slick-slider',
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );

  const sliderRef = useRef(null);
  const productRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add drag scroll functionality for mobile view - optimized version
  useEffect(() => {
    // Only apply drag scroll on mobile view
    if (isDesktop || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    // Prevent text selection during drag
    const preventDefault = (e) => {
      e.preventDefault();
      return false;
    };

    const handleMouseDown = (e) => {
      isDown = true;
      // Add no-select class to prevent text selection during drag
      scrollContainer.classList.add('no-select');
      scrollContainer.style.cursor = 'grabbing';
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      // Prevent default behavior to avoid text selection
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // Increased for smoother feel
      requestAnimationFrame(() => {
        scrollContainer.scrollLeft = scrollLeft - walk;
      });
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.classList.remove('no-select');
      scrollContainer.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
      if (isDown) {
        isDown = false;
        scrollContainer.classList.remove('no-select');
        scrollContainer.style.cursor = 'grab';
      }
    };

    // Touch events for mobile - optimized
    const handleTouchStart = (e) => {
      isDown = true;
      scrollContainer.classList.add('no-select');
      startX = e.touches[0].pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      // Don't prevent default completely as it breaks scrolling on some devices
    };

    const handleTouchMove = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      requestAnimationFrame(() => {
        scrollContainer.scrollLeft = scrollLeft - walk;
      });
    };

    const handleTouchEnd = () => {
      isDown = false;
      scrollContainer.classList.remove('no-select');
    };

    // Add listeners for selection prevention during drag
    scrollContainer.addEventListener('dragstart', preventDefault);
    scrollContainer.addEventListener('selectstart', preventDefault);

    // Add event listeners
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchmove', handleTouchMove);
    scrollContainer.addEventListener('touchend', handleTouchEnd);

    // Add user-select: none CSS to the container in JavaScript
    const originalUserSelect = scrollContainer.style.userSelect;
    const originalWebkitUserSelect = scrollContainer.style.webkitUserSelect;
    const originalMsUserSelect = scrollContainer.style.msUserSelect;

    scrollContainer.style.userSelect = 'none';
    scrollContainer.style.webkitUserSelect = 'none';
    scrollContainer.style.msUserSelect = 'none';

    // Clean up event listeners
    return () => {
      scrollContainer.removeEventListener('dragstart', preventDefault);
      scrollContainer.removeEventListener('selectstart', preventDefault);
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);

      // Restore original user-select values
      scrollContainer.style.userSelect = originalUserSelect;
      scrollContainer.style.webkitUserSelect = originalWebkitUserSelect;
      scrollContainer.style.msUserSelect = originalMsUserSelect;
    };
  }, [isDesktop]);

  const handleHotspotClick = (index) => {
    setSelectedHotspot(index);
    if (isDesktop && sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    } else if (productRefs.current[index]) {
      productRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  };

  const CustomNextArrow = ({className, style, onClick}) => (
    <button
      className={`${className} custom-slick-arrow custom-slick-next hidden md:block`}
      style={{...style}}
      onClick={onClick}
      type="button"
    >
      <svg className="slick-slider-button-icon" viewBox="0 0 100 100">
        <title>Next</title>
        <path
          d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
          className="arrow"
          transform="translate(100, 100) rotate(180)"
        />
      </svg>
    </button>
  );

  const CustomPrevArrow = ({className, style, onClick}) => (
    <button
      className={`${className} custom-slick-arrow custom-slick-prev hidden md:block`}
      style={{...style}}
      onClick={onClick}
      type="button"
    >
      <svg className="slick-slider-button-icon" viewBox="0 0 100 100">
        <title>Previous</title>
        <path
          d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
          className="arrow"
        />
      </svg>
    </button>
  );

  const slickSettings = {
    dots: isDesktop,
    infinite: false,
    swipeToSlide: true,
    touchMove: true,
    draggable: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    arrows: isDesktop,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    focusOnSelect: true,
    beforeChange: (current, next) => setSelectedHotspot(next),
    afterChange: (index) => setSelectedHotspot(index),
    responsive: [
      {
        breakpoint: 768,
        settings: 'unslick',
      },
    ],
  };

 


  // Determine if we should show hotspots section
  const showHotspotsSection =
    hotspots && hotspots.length > 0 && collectionImage;

  return (
    <div className="custom-slider-container slick-slick-slick">
                {products && Array.isArray(products) ? (
                  isDesktop ? (
                    <Slider ref={sliderRef} {...slickSettings}>
                      {products.map((product, index) => (
                        <div
                          key={index}
                          className="the-look-product"
                          style={{width: '350px'}}
                        >
                          <ProductCardQuickAdd
                            product={product}
                            productIndex={index}
                            collectionIndex={3}
                            usePrefix="the-look-collection"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div
                      ref={scrollContainerRef}
                      className="slider-mobile-container flex overflow-x-auto scroll-smooth snap-x px-2 cursor-grab"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                      }}
                    >
                      {products.map((product, index) => (
                        <div
                          key={index}
                          className="the-look-product"
                          style={{width: '350px'}}
                        >
                          <ProductCardQuickAdd
                            product={product}
                            productIndex={index}
                            collectionIndex={3}
                            usePrefix="the-look-collection"
                          />
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div>No products available</div>
                )}
              </div>
  );
};

export default CustomSlickSlider;

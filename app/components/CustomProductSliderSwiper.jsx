import React, { useState, useRef , useEffect   } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { Navigation, FreeMode, Mousewheel } from 'swiper/modules';
import ProductCardQuickAdd from './ProductCardQuickAdd';

const CustomSwiperSlider = ({ products }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const swiperRef = useRef(null);

  const handleDotClick = (index) => {
    setActiveSlide(index);
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(index, 600, 'easeOutQuad');
    }
  };

  // Check screen size and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="wayfarer-collection-slider-container custom-slider-container relative">
      <Swiper
        ref={swiperRef}
        modules={[FreeMode, Navigation, Mousewheel]}
        freeMode={{
          enabled: true,
          momentum: true,
          momentumRatio: 1.2,
          momentumBounce: true,
          momentumBounceRatio: 0.8,
          momentumVelocityRatio: 0.6,
          sticky: false,
          minimumVelocity: 0.02,
        }}
        slidesPerView="auto"
        spaceBetween={20}
        centeredSlides={false}
        grabCursor={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        mousewheel={{
          forceToAxis: true,
          invert: false,
          sensitivity: 0.8,
          releaseOnEdges: true,
          thresholdDelta: 5,
          thresholdTime: 100,
          eventsTarget: 'container',
        }}
        speed={600}
        touchRatio={0.8}
        resistanceRatio={0.7}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        initialSlide={activeSlide}
        className="wayfarer-collection-swiper"
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {products?.map((product, index) => (
          <SwiperSlide 
            key={product.id || index}
            style={{ 
              width: 'auto', 
              maxWidth: '320px',
              transform: 'translateZ(0)',
            }}
          >
            <ProductCardQuickAdd
              product={product}
              productIndex={index}
              collectionIndex={3}
              usePrefix="wayfarer-collection"
            />
          </SwiperSlide>
        ))}
        
        {/* Custom Navigation Arrows */}
        <div className="swiper-button-next custom-swiper-buttons custom-swiper-button-next">
        
      <svg className="swiper-slider-button-icon" viewBox="0 0 100 100">
        <title>{"next"}</title>
        <path
          d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
          className="arrow"
          transform={'translate(100, 100) rotate(180)'}
        />
      </svg>
    
        </div>
        <div className="swiper-button-prev custom-swiper-buttons custom-swiper-button-prev">
        <svg className="swiper-slider-button-icon" viewBox="0 0 100 100">
        <title>{"prev"}</title>
        <path
          d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
          className="arrow"
          transform={''}
        />
      </svg>
        </div>
      </Swiper>
{!isMobile &&(
      // {/* Pagination dots */}
      <div className="wayfarer-collection-pagination flex justify-center mt-8">
        {products?.map((_, index) => (
          <button
            key={index}
            className={`wayfarer-collection-pagination-dot w-2 h-2 rounded-full mx-2 transition-all duration-300 ${
              activeSlide === index ? 'bg-black scale-125' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
      )}
    </div>
  );
};

export default CustomSwiperSlider;
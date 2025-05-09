import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import ProductCardQuickAdd from './ProductCardQuickAdd';

const CustomSlickSlider = ({
  products = [],
  selectedIndex,
  setSelectedIndex,
  isDesktop: isDesktopProp,
  sliderRef: externalSliderRef,
  productRefs: externalProductRefs,
  scrollContainerRef: externalScrollRef,
}) => {
  const [internalSelectedIndex, internalSetSelectedIndex] = useState(0);
  const selected = selectedIndex ?? internalSelectedIndex;
  const setSelected = setSelectedIndex ?? internalSetSelectedIndex;

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && (isDesktopProp ?? window.innerWidth >= 768)
  );

  const internalSliderRef = useRef(null);
  const internalScrollRef = useRef(null);
  const internalProductRefs = useRef([]);

  const sliderRef = externalSliderRef ?? internalSliderRef;
  const scrollContainerRef = externalScrollRef ?? internalScrollRef;
  const productRefs = externalProductRefs ?? internalProductRefs;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag scroll logic for mobile
  useEffect(() => {
    if (isDesktop || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let isDown = false, startX, scrollLeft;

    const handleDown = (e) => {
      isDown = true;
      container.classList.add('no-select');
      container.style.cursor = 'grabbing';
      startX = e.pageX || e.touches[0].pageX;
      scrollLeft = container.scrollLeft;
    };

    const handleMove = (e) => {
      if (!isDown) return;
      const x = e.pageX || e.touches[0].pageX;
      const walk = (x - startX) * 2;
      requestAnimationFrame(() => {
        container.scrollLeft = scrollLeft - walk;
      });
    };

    const handleUp = () => {
      isDown = false;
      container.classList.remove('no-select');
      container.style.cursor = 'grab';
    };

    container.addEventListener('mousedown', handleDown);
    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseup', handleUp);
    container.addEventListener('mouseleave', handleUp);
    container.addEventListener('touchstart', handleDown);
    container.addEventListener('touchmove', handleMove);
    container.addEventListener('touchend', handleUp);

    return () => {
      container.removeEventListener('mousedown', handleDown);
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseup', handleUp);
      container.removeEventListener('mouseleave', handleUp);
      container.removeEventListener('touchstart', handleDown);
      container.removeEventListener('touchmove', handleMove);
      container.removeEventListener('touchend', handleUp);
    };
  }, [isDesktop]);

  const CustomArrow = ({ direction, onClick }) => (
    <button
      className={`custom-slick-arrow custom-slick-${direction} hidden md:block`}
      onClick={onClick}
      type="button"
    >
      <svg className="slick-slider-button-icon" viewBox="0 0 100 100">
        <title>{direction}</title>
        <path
          d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
          className="arrow"
          transform={direction === 'next' ? 'translate(100, 100) rotate(180)' : ''}
        />
      </svg>
    </button>
  );

  const slickSettings = {
    dots: isDesktop,
    infinite: false,
    swipeToSlide: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    arrows: isDesktop,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
    beforeChange: (_, next) => setSelected(next),
    afterChange: (index) => setSelected(index),
    responsive: [
      {
        breakpoint: 768,
        settings: 'unslick',
      },
    ],
  };

  return (
    <div className="custom-slider-container slick-slick-slick">
      {isDesktop ? (
        <Slider ref={sliderRef} {...slickSettings}>
          {products.map((product, index) => (
            <div key={index} className="the-look-product" style={{ width: '350px' }}>
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
              ref={(el) => (productRefs.current[index] = el)}
              className="the-look-product min-w-[300px] snap-center"
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
      )}
    </div>
  );
};

export default CustomSlickSlider;


// use with hotspots

// <ProductSlider
//   products={products}
//   selectedIndex={selectedHotspot}
//   setSelectedIndex={setSelectedHotspot}
//   sliderRef={sliderRef}
//   productRefs={productRefs}
//   scrollContainerRef={scrollContainerRef}
//   isDesktop={isDesktop}
// />

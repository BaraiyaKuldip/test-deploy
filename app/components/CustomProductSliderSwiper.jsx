import React, { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCardQuickAdd from './ProductCardQuickAdd';

const CustomSwiperSlider = ({
  products = [],
  selectedIndex,
  setSelectedIndex,
  sliderRef: externalSliderRef,
  productRefs: externalProductRefs,
}) => {
  const [internalSelectedIndex, internalSetSelectedIndex] = useState(0);
  const selected = selectedIndex ?? internalSelectedIndex;
  const setSelected = setSelectedIndex ?? internalSetSelectedIndex;

  const internalSliderRef = useRef(null);
  const internalProductRefs = useRef([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const sliderRef = externalSliderRef ?? internalSliderRef;
  const productRefs = externalProductRefs ?? internalProductRefs;

  // Update selected index on slide change
  const onSlideChange = useCallback(
    (swiper) => {
      setSelected(swiper.realIndex);
    },
    [setSelected]
  );

  return (
    <div className="custom-slider-container swiper-swiper-swiper">
      <div className="swiper">
        <Swiper
          ref={sliderRef}
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          loop={false}
          speed={600}
          onSlideChange={onSlideChange}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            // Ensure navigation elements are assigned after init
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide
              key={index}
              className="swiper__slide the-look-product"
              ref={(el) => (productRefs.current[index] = el)}
            >
              <ProductCardQuickAdd
                product={product}
                productIndex={index}
                collectionIndex={3}
                usePrefix="the-look-collection"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          ref={prevRef}
          className="custom-swiper-arrow custom-swiper-prev"
          aria-label="Previous slide"
        >
          <svg className="swiper-slider-button-icon" viewBox="0 0 100 100">
            <path
              d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
              className="arrow"
            />
          </svg>
        </button>
        <button
          ref={nextRef}
          className="custom-swiper-arrow custom-swiper-next"
          aria-label="Next slide"
        >
          <svg className="swiper-slider-button-icon" viewBox="0 0 100 100">
            <path
              d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
              className="arrow"
              transform="translate(100, 100) rotate(180)"
            />
          </svg>
        </button>
        <div className="swiper__dots">
          {products.map((_, index) => (
            <button
              key={index}
              className={`swiper__dot ${index === selected ? 'swiper__dot--active' : ''}`}
              onClick={() => sliderRef.current?.swiper?.slideTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomSwiperSlider;
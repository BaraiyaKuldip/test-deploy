import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCardQuickAdd from './ProductCardQuickAdd';

export default function CustomSwiperSlider147({ products, setSelectedHotspot }) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyDesktop = window.innerWidth >= 768;
      setIsDesktop(isCurrentlyDesktop);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleHotspotClick = (index) => {
    setSelectedHotspot(index);
    if (swiperRef.current && isDesktop) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <>
      <div className={`swiper-slider-147 custom-slider-container ${!isDesktop ? 'static-carousel' : ''}`}>
        {isDesktop ? (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={'auto'}
            centeredSlides={true}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              type: 'bullets',
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.on('slideChange', () => {
                setSelectedHotspot(swiper.activeIndex);
              });
            }}
            className="swiper-container"
          >
            {products && Array.isArray(products) ? (
              products.map((product, index) => (
                <SwiperSlide key={index} className="carousel-cell">
                  <div className="the-look-product">
                    <ProductCardQuickAdd
                      product={product}
                      productIndex={index}
                      collectionIndex={3}
                      usePrefix="the-look-collection"
                    />
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div>No products available</div>
              </SwiperSlide>
            )}
            <div className="swiper-pagination"></div>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next" style={{transform : "rotate(180deg)"}}></div>
          </Swiper>
        ) : (
          <div className="mobile-carousel">
            {products && Array.isArray(products) ? (
              products.map((product, index) => (
                <div key={index} className="carousel-cell">
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
        )}
      </div>
    </>
  );
}
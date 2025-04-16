import React, {useEffect, useRef} from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {EffectFade, Autoplay, Pagination, Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Image} from '@shopify/hydrogen';

const SwiperComponent = ({
  images,
  collectionIndex,
  productIndex,
  currentVariant,
  usePrefix,
}) => {
  const swiperRefLocal = useRef();

  useEffect(() => {
    if (document && window) {
      console.log(productIndex, images, 'images length');

      let imgLength = 0;

      currentVariant.selectedOptions.map((option) =>
        images.edges.map((image, index) => (
            currentVariant.selectedOptions.find(
              (opt) => opt.name === 'Color',
            ) !== undefined ? (
              image.node.altText === option.value && (imgLength = imgLength + 1)):(imgLength = images.edges.length)
            )))
      
      let bulletWidth = 100 / imgLength;

      const element = document.querySelector(
        `.swiper-${collectionIndex}-${productIndex}-${usePrefix}`,
      );

      const paginationElement = document.querySelector(
        `.swiper-pagination-${collectionIndex}-${productIndex}-${usePrefix}`,
      );

      // Get all <b> elements inside the pagination
      const targetBullets = paginationElement.querySelectorAll('.b-bullet');

      element.addEventListener('mouseover', () => {

        if(imgLength > 1){
          paginationElement.style.background =
            'linear-gradient(to bottom, rgba(13, 13, 13, 0.06) 0%, rgba(255, 255, 255, 0) 100%)';
          paginationElement.style.opacity = '1';
        }

        // Apply styles to all <b> elements
        targetBullets.forEach((bullet) => {
          bullet.style.animationDuration = '3s';
          bullet.style.animationTimingFunction = 'ease-in';
          bullet.style.animationIterationCount = '1';
          bullet.style.animationDirection = 'alternate';
          bullet.style.animationFillMode = 'forwards';
        });
      });

      element.addEventListener('mouseout', () => {
        paginationElement.style.background = 'none';
        paginationElement.style.opacity = '0';

        // Reset styles for all <b> elements
        targetBullets.forEach((bullet) => {
          bullet.style.animationDuration = '';
          bullet.style.animationTimingFunction = '';
          bullet.style.animationIterationCount = '';
          bullet.style.animationDirection = '';
          bullet.style.animationFillMode = '';
        });
      });

      // Set the width of all bullets
      const children = element.children[1].children;
      for (let child of children) {
        child.style.width = `${bulletWidth}%`;
      }
    }
  }, [productIndex, currentVariant]);

  const handleMouseEnter = () => {
    const swiper = swiperRefLocal.current.swiper;
    if (swiper) {
      swiper.autoplay.stop();
      swiper.autoplay.start();
      swiper.params.autoplay = {
        delay: 3000,
        disableOnInteraction: false,
      };
    }
  };

  const handleMouseLeave = () => {
    const swiper = swiperRefLocal.current.swiper;
    if (swiper) {
      swiper.autoplay.stop();
      swiper.slideTo(0, 0, true);
    }
  };

  return (
    <div
      className="swiper-wrapper-div"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        ref={swiperRefLocal}
        key={`swiper-${collectionIndex}-${productIndex}-${usePrefix}`}
        effect="fade"
        allowTouchMove={false}
        autoplay={false}
        pagination={{
          el: `.swiper-pagination-${collectionIndex}-${productIndex}-${usePrefix}`,
          clickable: true,
          type: 'bullets',
          renderBullet: function (index, className) {
            return (
              '<span class="' +
              className +
              '">' +
              '<i></i>' +
              '<b class="b-bullet"></b>' +
              '</span>'
            );
          },
        }}
        navigation={false}
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        className={`mySwiper swiper-${collectionIndex}-${productIndex}-${usePrefix}`}
      >
        {currentVariant.selectedOptions.map((option) =>
          images.edges.map((image, index) => (
            <>
              {currentVariant.selectedOptions.find(
                (opt) => opt.name === 'Color',
              ) !== undefined ? (
                image.node.altText === option.value && (
                  <SwiperSlide
                    key={index}
                    className="relative block w-full h-full overflow-hidden aspect-[0.9]"
                  >
                    <Image
                      data={image.node}
                      height="2000"
                      width="1500"
                      aspectRatio="1/1"
                      sizes="(min-width: 1024px) calc(min(100vw, 1450px) / 4),(min-width: 768px) calc(min(100vw, 1450px) / 3),calc(min(100vw, 1450px) / 1.5)"
                      fetchpriority="high"
                    />
                  </SwiperSlide>
                )
              ) : (
                <>
                  <SwiperSlide
                    key={index}
                    className="relative block w-full h-full overflow-hidden aspect-[0.9]"
                  >
                    <Image
                      data={image.node}
                      height="2000"
                      width="1500"
                      aspectRatio="1/1"
                      sizes="(min-width: 1024px) calc(min(100vw, 1450px) / 4),(min-width: 768px) calc(min(100vw, 1450px) / 3),calc(min(100vw, 1450px) / 1.5)"
                      fetchpriority="high"
                    />
                  </SwiperSlide>
                </>
              )}
            </>
          )),
        )}
        <div
          className={`swiper-pagination swiper-pagination-${collectionIndex}-${productIndex}-${usePrefix}`}
        ></div>
      </Swiper>
    </div>
  );
};

export default SwiperComponent;

import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';


// Mock ProductCardQuickAdd component
function ProductCardQuickAdd({ product, productIndex, collectionIndex, usePrefix }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p>Index: {productIndex}</p>
      <p>Collection: {usePrefix}-{collectionIndex}</p>
    </div>
  );
}

function CustomSlickSlider({ products, setSelectedHotspot }) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(null);
  const sliderRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);

    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => console.log('DOM loaded'));
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', () => {});
    };
  }, []);

  const handleHotspotClick = (index) => {
    setSelectedHotspot(index);
    if (sliderRef.current && isDesktop) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    arrows: true,
    freeScroll: true,
    afterChange: (index) => setSelectedHotspot(index),
    responsive: [{ breakpoint: 768, settings: 'unslick' }],
  };

  return (
    <div className={`custom-slider-container ${!isDesktop ? 'static-carousel' : ''}`}>
      {products?.length ? (
        isDesktop ? (
          <Slider ref={sliderRef} {...settings}>
            {products.map((product, index) => (
              <div key={index} className="carousel-cell" onClick={() => handleHotspotClick(index)}>
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
          <div className="flex overflow-x-auto">
            {products.map((product, index) => (
              <div key={index} className="carousel-cell" onClick={() => handleHotspotClick(index)}>
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

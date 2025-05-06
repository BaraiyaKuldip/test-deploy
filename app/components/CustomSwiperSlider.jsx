import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Note: In a real project, you would need to include:
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CustomSwiperSlider({product}) {
  // Sample slides - replace with your actual content
//   const slides = [
//     { id: 1, imageUrl: '/api/placeholder/400/400' },
//     { id: 2, imageUrl: '/api/placeholder/400/400' },
//     { id: 3, imageUrl: '/api/placeholder/400/400' },
//     { id: 4, imageUrl: '/api/placeholder/400/400' }
//   ];

  return (
    <div className="custom-swiper-container relative max-w-5xl mx-auto px-8">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          prevEl: '.custom-swiper-prev',
          nextEl: '.custom-swiper-next',
        }}
        pagination={{
          el: '.custom-swiper-pagination',
          clickable: true,
          bulletClass: 'custom-bullet',
          bulletActiveClass: 'custom-bullet-active',
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="py-4"
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
                          <div
                            key={index}
                            className="swiper__slide the-look-product"
                            style={{ width: '350px' }}
                          >
                            <ProductCardQuickAdd
                              product={product}
                              productIndex={index}
                              collectionIndex={3}
                              usePrefix="the-wayfrare-collection"
                            />
                          </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom navigation buttons */}
      <button className="custom-swiper-prev absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10">
        <ChevronLeft size={20} className="text-gray-700" />
      </button>
      <button className="custom-swiper-next absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10">
        <ChevronRight size={20} className="text-gray-700" />
      </button>
      
      {/* Custom pagination dots */}
      <div className="custom-swiper-pagination flex justify-center space-x-2 mt-6">
        {/* Swiper will automatically populate this with bullets */}
      </div>

      {/* Custom CSS for pagination bullets - add to your CSS file */}
      <style jsx>{`
        :global(.custom-bullet) {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
          background: #d1d5db;
          opacity: 0.7;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        :global(.custom-bullet-active) {
          opacity: 1;
          background: #374151;
          width: 10px;
          height: 10px;
        }
      `}</style>
    </div>
  );
}
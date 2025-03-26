// import React, { useEffect, useRef } from 'react';
// import 'swiper/css';
// import 'swiper/css/effect-fade';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper/modules';
// import { Swiper, SwiperSlide } from 'swiper/react';

// const SwiperComponent = ({ images, collectionIndex, productIndex }) => {
//   const swiperRefLocal = useRef();

//   useEffect(() => {
//     if (document && window) {
//       console.log(productIndex, images.edges.length, 'images length');

//       let bulletWidth = 100 / images.edges.length;

//       const element = document.querySelector(
//         `.swiper-${collectionIndex}-${productIndex}`,
//       );

//       const paginationElement = document.querySelector(
//         `.swiper-pagination-${collectionIndex}-${productIndex}`,
//       );

//       // Get all <b> elements inside the pagination
//       const targetBullets = paginationElement.querySelectorAll('.b-bullet');

//       element.addEventListener('mouseover', () => {
//         paginationElement.style.background =
//           'linear-gradient(to bottom, rgba(13, 13, 13, 0.06) 0%, rgba(255, 255, 255, 0) 100%)';
//         paginationElement.style.opacity = '1';

//         // Apply styles to all <b> elements
//         targetBullets.forEach((bullet) => {
//           bullet.style.animationDuration = '3s';
//           bullet.style.animationTimingFunction = 'ease-in';
//           bullet.style.animationIterationCount = '1';
//           bullet.style.animationDirection = 'alternate';
//           bullet.style.animationFillMode = 'forwards';
//         });
//       });

//       element.addEventListener('mouseout', () => {
//         paginationElement.style.background = 'none';
//         paginationElement.style.opacity = '0';

//         // Reset styles for all <b> elements
//         targetBullets.forEach((bullet) => {
//           bullet.style.animationDuration = '';
//           bullet.style.animationTimingFunction = '';
//           bullet.style.animationIterationCount = '';
//           bullet.style.animationDirection = '';
//           bullet.style.animationFillMode = '';
//         });
//       });

//       // Set the width of all bullets
//       const children = element.children[1].children;
//       for (let child of children) {
//         child.style.width = `${bulletWidth}%`;
//       }
//     }
//   }, [productIndex, images.edges.length]);

//   const handleMouseEnter = () => {
//     const swiper = swiperRefLocal.current.swiper;
//     if (swiper) {
//       swiper.autoplay.stop();
//       swiper.autoplay.start();
//       swiper.params.autoplay = {
//         delay: 3000,
//         disableOnInteraction: false,
//       };
//     }
//   };

//   const handleMouseLeave = () => {
//     const swiper = swiperRefLocal.current.swiper;
//     if (swiper) {
//       swiper.autoplay.stop();
//       swiper.slideTo(0, 0, true);
//     }
//   };

//   return (
//     <div
//       className="h-[303.510px] w-[273.167px] swiper-wrapper-div"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <Swiper
//         ref={swiperRefLocal}
//         key={`swiper-${collectionIndex}-${productIndex}`}
//         effect="fade"
//         allowTouchMove={false}
//         autoplay={false}
//         pagination={{
//           el: `.swiper-pagination-${collectionIndex}-${productIndex}`,
//           clickable: true,
//           type: 'bullets',
//           renderBullet: function (index, className) {
//             return (
//               '<span class="' +
//               className +
//               '">' +
//               '<i></i>' +
//               '<b class="b-bullet"></b>' +
//               '</span>'
//             );
//           },
//         }}
//         navigation={false}
//         modules={[EffectFade, Autoplay, Pagination, Navigation]}
//         className={`mySwiper swiper-${collectionIndex}-${productIndex}`}
//       >
//         {images.edges.map((image, index) => (
//           <SwiperSlide key={index}>
//             <img
//               className="h-[303.510px] w-[273.167px]"
//               src={image.node.url}
//               alt="abs"
//             />
//           </SwiperSlide>
//         ))}
//         <div
//           className={`swiper-pagination swiper-pagination-${collectionIndex}-${productIndex}`}
//         ></div>
//       </Swiper>
//     </div>
//   );
// };

// export default SwiperComponent;
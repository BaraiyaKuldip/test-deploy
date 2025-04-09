// components/ProductGallery.jsx
import React from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import {ProductImage} from './ProductImage';
import {useEffect, useState, useRef} from 'react';

export function PhotoSwipeZoom({images, selectedVariant}) {
  useEffect(() => {
    let lightbox;

    const initPhotoSwipe = () => {
      lightbox = new PhotoSwipeLightbox({
        gallery: '#product-gallery',
        children: 'a',
        pswpModule: () => import('photoswipe'),
        bgOpacity: 0.9,
        showHideOpacity: true,
        closeOnVerticalDrag: false,
      });

      // Custom CSS for the UI
      const style = document.createElement('style');
      style.textContent = `
        /* Remove all default UI elements */
        .pswp__button:not(.pswp__button--close):not(.pswp__button--arrow--left):not(.pswp__button--arrow--right) {
          display: none !important;
        }
        
        .pswp__scroll-wrap{
          background: #ffffff !important;
        }


        /* Close button container */
        .pswp__close--container {
          position: absolute;
          top: 10px;
          right: 14.5px;
          z-index: 1060;
        }
        
        /* Button styling */

        .pswp__button {
          width: 45px;
          height: 45px;
          background: none;
          opacity: 1;
          margin: 0;
          background: none;
          cursor: pointer;
          overflow: visible;
          -webkit-appearance: none;
          border: 0;
          padding: 0;
          margin: 0;
          box-shadow: none;
          transition: transform 1s cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        .pswp__button:hover {
          transition: transform 1s cubic-bezier(0.215, 0.61, 0.355, 1);
          transform: scale(1.15);
        }
        
        .pswp__button svg {
          width: 100%;
          height: 100%;
          stroke: currentColor;
          stroke-width: 1px;
        }

        /* Top bar with navigation */

        .pswp__top-bar{
          display:none;
        }

        .pswp__top-bar-custom {
          background: #ffffff !important;
          position: fixed;
          bottom: 0 !important;
          left: 0;
          right: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          justify-content: space-between;
          align-items: center;
          padding: 0 0.5em 0 1.5em;
          gap: 20px;
          background: none;
          z-index:2020;
        }
        
        /* Counter styling */
        .pswp__counter {
          color: #7b7b7b;
          font-family: var(--font-family-ms);
          font-style: var(--font-style-nrml);
          font-weight: var(--font-weight-5);
          text-transform: var(--text-transform-up);
          letter-spacing: var(--letter-spacing-9);
          font-size: calc(var(--font-size-13) * var(--font-adjust));
          line-height: var(--line-height-1-5);

          height: 100% !important;
          text-shadow: none !important;
          opacity: 1 !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* Caption handling */
        .pswp__caption--fake {
          display: none;
        }
        
        .pswp__caption--empty {
          position: fixed;
          bottom: 80px;
          left: 0;
          right: 0;
          text-align: center;
        }
      `;
      document.head.appendChild(style);

      // Custom UI implementation
      lightbox.on('uiRegister', () => {
        // Close button
        lightbox.pswp.ui.registerElement({
          name: 'custom-close-button',
          className: 'pswp__close--container',
          html: `
            <button class="pswp__button pswp__button--close" title="Close (Esc)">
              <svg xmlns="http://www.w3.org/2000/svg" stroke-linecap="square" stroke-linejoin="arcs" aria-hidden="true" class="icon-theme icon-theme-stroke icon-core-x" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"></path>
              </svg>
            </button>
          `,
          appendTo: 'root',
          onInit: (el) => {
            el.onclick = () => lightbox.pswp.close();
          },
        });

        // Navigation bar with arrows and counter
        lightbox.pswp.ui.registerElement({
          name: 'custom-navigation-bar',
          className: 'pswp__top-bar-custom',
          html: `
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
              <svg xmlns="http://www.w3.org/2000/svg" stroke-linecap="square" stroke-linejoin="arcs" aria-hidden="true" class="icon-theme icon-theme-stroke icon-core-chevron-left-circle" viewBox="0 0 24 24" style="stroke-width: 1px;">
                <path d="M12 2C6.477 2 2 6.479 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.521-4.477-10-10-10Zm1.5 14-4-4 4-4"></path>
              </svg>
            </button>
            <div class="pswp__counter">1 / ${images.edges.length}</div>
            <button class="pswp__button pswp__button--arrow--right" style="justify-self: end;" title="Next (arrow right)">
              <svg xmlns="http://www.w3.org/2000/svg" stroke-linecap="square" stroke-linejoin="arcs" aria-hidden="true" class="icon-theme icon-theme-stroke icon-core-chevron-right-circle" viewBox="0 0 24 24">
                <path d="M12 22c5.523 0 10-4.478 10-10 0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.522 4.477 10 10 10ZM10.5 8l4 4-4 4"></path>
              </svg>
            </button>
          `,
          appendTo: 'root',
          onInit: (el, pswp) => {
            const prevBtn = el.querySelector('.pswp__button--arrow--left');
            const nextBtn = el.querySelector('.pswp__button--arrow--right');
            const counterEl = el.querySelector('.pswp__counter');

            prevBtn.onclick = (e) => {
              e.preventDefault();
              pswp.prev();
            };

            nextBtn.onclick = (e) => {
              e.preventDefault();
              pswp.next();
            };

            pswp.on('change', () => {
              counterEl.textContent = `${
                pswp.currIndex + 1
              } / ${pswp.getNumItems()}`;
            });
          },
        });
      });

      lightbox.init();

      return () => {
        if (style.parentNode === document.head) {
          document.head.removeChild(style);
        }
      };
    };

    initPhotoSwipe();

    return () => {
      if (lightbox) {
        lightbox.destroy();
      }
    };
  }, [images.edges.length]);

  return (
    <>
      {console.log(selectedVariant, images, 'selectedVariant Product Page')}
      <div id="product-gallery" className="product-page-media-grid ">
        {console.log(
          selectedVariant.selectedOptions.find((opt) => opt.name === 'Color'),
          'findd',
        )}
        {selectedVariant.selectedOptions.map((option, index) => images.edges.map((image) => (
            <>
            {console.log(option,"oppp")}
              {selectedVariant.selectedOptions.find((opt) => opt.name === 'Color') !== undefined ? (
                image.node.altText === option.value && (
                  <div key={image.node.id} className="product-page-media">
                    <div className="w-full">
                      <div className="product-page-image-wrapper">
                        <div className="relative block w-full h-full overflow-hidden">
                          <ProductImage image={image.node} />
                        </div>
                        <a
                          href={image.node.url}
                          data-pswp-width={image.node.width}
                          data-pswp-height={image.node.height}
                          data-cropped="true"
                        >
                          <div className="product-page-media-zoom-btn-holder">
                            <button className="product-page-media-zoom-btn">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                class="icon-theme icon-theme-stroke icon-core-magnify"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M18.316 9.825c0 3.368-2.05 6.404-5.194 7.692a8.47 8.47 0 0 1-9.164-1.81A8.265 8.265 0 0 1 2.144 6.63C3.45 3.52 6.519 1.495 9.921 1.5c4.638.007 8.395 3.732 8.395 8.325ZM22.5 22.5l-6.558-6.87L22.5 22.5Z"
                                ></path>
                              </svg>
                              <span className="visually-hidden">Zoom</span>
                            </button>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div key={`title-${index}`} className="product-page-media">
                  
                    <div className="w-full">
                      <div className="product-page-image-wrapper">
                        <ProductImage image={image.node} />
                      </div>
                    </div>
                    <a
                          href={image.node.url}
                          data-pswp-width={image.node.width}
                          data-pswp-height={image.node.height}
                          data-cropped="true"
                        >
                          <div className="product-page-media-zoom-btn-holder">
                            <button className="product-page-media-zoom-btn">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                class="icon-theme icon-theme-stroke icon-core-magnify"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M18.316 9.825c0 3.368-2.05 6.404-5.194 7.692a8.47 8.47 0 0 1-9.164-1.81A8.265 8.265 0 0 1 2.144 6.63C3.45 3.52 6.519 1.495 9.921 1.5c4.638.007 8.395 3.732 8.395 8.325ZM22.5 22.5l-6.558-6.87L22.5 22.5Z"
                                ></path>
                              </svg>
                              <span className="visually-hidden">Zoom</span>
                            </button>
                          </div>
                        </a>
                  </div>
              )}
            </>
          ))
        )}
      </div>

      {/* Minimal PhotoSwipe root element */}
      <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="pswp__bg"></div>
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
          </div>
        </div>
        {/* UI structure will be added by PhotoSwipe */}
      </div>
    </>
  );
}

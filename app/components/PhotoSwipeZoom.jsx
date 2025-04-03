// components/ProductGallery.jsx
import {useState, useEffect} from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';    
import 'photoswipe/style.css';
import {Image} from '@shopify/hydrogen';
import {ProductImage} from './ProductImage';
// import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';




export function ProductGallery({images, selectedVariant}) {
  const [lightbox, setLightbox] = useState(null);


  
// const leftArrowSVGString = '<svg xmlns="http://www.w3.org/2000/svg" stroke-linecap="square" stroke-linejoin="arcs" aria-hidden="true" class="icon-theme icon-theme-stroke icon-core-chevron-left-circle" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.479 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.521-4.477-10-10-10Zm1.5 14-4-4 4-4"></path></svg>';

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#product-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();
    setLightbox(lightbox);

    return () => {
      lightbox.destroy();
      setLightbox(null);
    };
  }, []);

  // Combine all images including the variant image
  const allImages = [
    selectedVariant?.image,
    ...images.edges.map((edge) => edge.node),
  ].filter(Boolean); // Remove any undefined/null images

  return (
    <div id="product-gallery" className="product-page-media-grid">
      {selectedVariant.selectedOptions.map((option, index) =>
        option.name === 'Color' ? (
          <>
            {images.edges.map(
              (image) =>
                image.node.altText === option.value && (
                  <>
                    <div className="product-page-media">
                      <a
                        key={image.node.id || index}
                        href={image.node.url}
                        data-pswp-width={image.node.width}
                        data-pswp-height={image.node.height}
                        data-cropped="true"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="w-full">
                          <div className="product-page-image-wrapper">
                            <ProductImage image={image.node} />
                          </div>
                        </div>
                      </a>
                    </div>
                  </>
                ),
            )}
          </>
        ) : (
          <>
            {option.name === 'Title' && (
              <ProductImage image={selectedVariant?.image} />
            )}
          </>
        ),
      )}

      {/* {allImages.map((image, index) => (
        <a
          key={image.id || index}
          href={image.url}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          data-cropped="true"
          target="_blank"
          rel="noreferrer"
        >
          <div className="product-page-media">
            <div className="w-full">
              <div className="product-page-image-wrapper">
                <Image
                  data={image}
                  alt={image.altText || product.title}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>
          </div>
        </a>
      ))} */}
    </div>
  );
}

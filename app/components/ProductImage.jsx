import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({image}) {
  if (!image) {
    return <div className="product-image" />;
  }
  console.log(image, "iiii")
  return (
    <>
    <div className="relative block w-full h-full overflow-hidden">
      <Image
        className='product-image-main block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear '
        alt={image.altText || 'Product Image'}
        height={2000}
        width={1500}
        loading="eager"
        data={image}
        key={image.id}
        style={{objectPosition:"center center"}}
        fetchPriority='high'
        sizes="(min-width: 1100px) 70vw, (min-width: 768px) 50vw, calc(85vw - 8px)"
      />
    </div>
    <div className='product-page-media-zoom-btn-holder'>
      <button className='product-page-media-zoom-btn'>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="icon-theme icon-theme-stroke icon-core-magnify" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.316 9.825c0 3.368-2.05 6.404-5.194 7.692a8.47 8.47 0 0 1-9.164-1.81A8.265 8.265 0 0 1 2.144 6.63C3.45 3.52 6.519 1.495 9.921 1.5c4.638.007 8.395 3.732 8.395 8.325ZM22.5 22.5l-6.558-6.87L22.5 22.5Z"></path></svg>
        <span className='visually-hidden'>Zoom</span>
      </button>
    </div>
    </>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */

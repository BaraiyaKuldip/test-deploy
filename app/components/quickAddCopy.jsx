import React, {useState} from 'react';
import SwiperComponent from './ProductCard';
import {Link} from '@remix-run/react';
import {AddToCartButton} from './AddToCartButton';
import {Money} from '@shopify/hydrogen';
import {ProductImage} from './ProductImage';
import {Image} from '@shopify/hydrogen';
import {useAside} from './Aside';
import {
    getSelectedProductOptions,
    Analytics,
    useOptimisticVariant,
    getProductOptions,
    getAdjacentAndFirstAvailableVariants,
    useSelectedOptionInUrlParam,
  } from '@shopify/hydrogen';

export default function ProductCardQuickAdd({
  product,
  productIndex,
  collectionIndex,
}) {
  const {open} = useAside();
  
  // Get the optimistically selected variant
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  
  // Get product options in the standardized format
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Log the data for debugging
  console.log({
    product,          // Full product data
    selectedVariant,  // Currently selected variant
    productOptions,   // Structured options data
  });

  return (
    <div key={productIndex} className="collection-tabs-content embla__slide">
      <div className="tabs-products-items-container">
        <div className="tabs-products-items-error"></div>
        <Link
          to={`products/${product.handle}`}
          className="tabs-products-a-tag"
        >
          <div className="tabs-products-pagination"></div>
          <div className="tabs-products-images aspect-[0.9]">
            <SwiperComponent
              images={product.images}
              collectionIndex={collectionIndex}
              productIndex={productIndex}
            />
          </div>
        </Link>

        {!selectedVariant?.availableForSale && (
          <div className="tabs-product-sold-out-btn">Sold Out</div>
        )}

        <div className="tabs-product-variants-box min-h-[40px] md:min-h-[48px]">
          <div className="tabs-product-variants-box-wrapper">
            <div className="h-full w-full">
              <button
                className={`tabs-product-variants-btn ${
                  productOptions.length > 0 ? 'variants_available' : ''
                }`}
              >
                <AddToCartButton
                  disabled={!selectedVariant || !selectedVariant?.availableForSale}
                  onClick={() => open('cart')}
                  lines={
                    selectedVariant
                      ? [{
                          merchandiseId: selectedVariant.id,
                          quantity: 1,
                        }]
                      : []
                  }
                >
                  <span
                    className={`h-full w-full cursor-pointer ${
                      selectedVariant?.availableForSale ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    {productOptions.length > 0 ? 'Quick Add' : 'Add To Cart'}
                  </span>
                </AddToCartButton>
              </button>

              {productOptions.length > 0 && (
                <div className="ket_option_variants">
                  <div className="variant-selects flex flex-row items-center flex-wrap justify-center space-x-r2 py-r4 md:gap-y-r2 cursor-pointer">
                    {productOptions.map((option) => (
                      option.name === 'Size' && (
                        <React.Fragment key={option.name}>
                          {option.values.map((value) => (
                            <AddToCartButton
                              key={value.value}
                              disabled={
                                !value.firstSelectableVariant ||
                                !value.firstSelectableVariant?.availableForSale
                              }
                              onClick={() => open('cart')}
                              lines={
                                value.firstSelectableVariant
                                  ? [{
                                      merchandiseId: value.firstSelectableVariant.id,
                                      quantity: 1,
                                    }]
                                  : []
                              }
                            >
                              <div className="product-form__buttons w-full h-full">
                                <button
                                  type="submit"
                                  name="add"
                                  value={value.value}
                                  className="product-form__submit button button--full-width group-option-btn h-full w-full cursor-pointer"
                                >
                                  <span className="tabs-variant-select-btn inline-block whitespace-nowrap text-button-contrast px-r4 py-r4 group-hover-option-button-text-button-contrast group-hover-option-button-bg-button-contrast-5">
                                    {value.value}
                                  </span>
                                </button>
                              </div>
                            </AddToCartButton>
                          ))}
                        </React.Fragment>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-products-info text-left">
        <a href="#">
          <p className="visually-hidden">{product.title}</p>
          <div className="tabs-products-title-wrapper">
            <p className="tabs-products-title">{product.title}</p>
          </div>

          <div className="tabs-products-price-wrapper">
            {selectedVariant?.selectedOptions.map((selectedOption) => (
              selectedOption.name === 'Color' && (
                <span key={selectedOption.name} className="tabs-products-price-cutline">
                  {selectedOption.value}
                </span>
              )
            ))}
            <span className="tabs-products-price">
              {selectedVariant?.price && (
                <Money data={selectedVariant.price} />
              )}
            </span>
          </div>

          {!selectedVariant?.availableForSale && (
            <p className="tabs-products-sold-out">
              <em>Sold Out</em>
            </p>
          )}

          {productOptions.map((option) => (
            option.name === 'Color' && option.values.length > 1 && (
              <div key={option.name} className="tabs-products-swatch-main-container">
                <div className="tabs-products-swatch-sub-container">
                  <p className="tabs-products-swatch-title">
                    {option.values.length} Colors Available
                  </p>
                  <div className="tabs-products-swatch-main-wrapper">
                    <div className="tabs-products-swatch-sub-wrapper">
                      <div className="tabs-products-swatch-inner">
                        {option.values.map((value) => (
                          <div
                            key={value.value}
                            className={`tabs-products-swatch-holder ${
                              value.firstSelectableVariant?.availableForSale ? '' : 'sold-out'
                            }`}
                          >
                            <button
                              value={value.value}
                              className="tabs-products-swatch-link"
                            >
                              <div className="tabs-products-swatch">
                                <div className="tabs-products-swatch-size">
                                  {value.swatch?.image?.previewImage && (
                                    <div className="relative block w-full h-full overflow-hidden aspect-[1.0]">
                                      <Image
                                        data={value.swatch.image.previewImage}
                                        className="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                                        height="35"
                                        width="26"
                                        loading="lazy"
                                        fetchPriority="low"
                                        style={{objectPosition: 'center center'}}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                        ))}
                        {option.values.length > 5 && (
                          <a href="#" className="tabs-products-swatch-more-links">
                            {option.values.length - 5}+
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </a>
      </div>
    </div>
  );
}
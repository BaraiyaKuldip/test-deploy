import React, {useEffect, useRef, useState} from 'react';
import {defer} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import SwiperComponent from './ProductCard';
import {Link} from '@remix-run/react';
import {AddToCartButton} from './AddToCartButton';
import {Money} from '@shopify/hydrogen';
import {ProductImage} from './ProductImage';
import {Image} from '@shopify/hydrogen';
// import {useAside} from './Aside';
import ProductCardQuickAddButton from './ProductCardQuickAddButton';

export default function ProductCardQuickAdd({
  product,
  productIndex,
  collectionIndex,
  usePrefix,
}) {
  const navigate = useNavigate();
  // const {open} = useAside();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // State to track selected options
  const [selectedOptions, setSelectedOptions] = useState(
    selectedVariant.selectedOptions.reduce((acc, option) => {
      acc[option.name] = option.value;
      return acc;
    }, {}),
  );

  // Find the variant that matches the selected options
  const findVariant = () => {
    return product.variants.nodes.find((variant) => {
      return variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value,
      );
    });
  };

  const currentVariant = findVariant() || selectedVariant;
  const [searchParamsURL, setSearchParamsURL] = useState('');
  // Handle option selection
  const handleOptionChange = (optionName, optionValue) => {
    setSelectedOptions({
      ...selectedOptions,
      [optionName]: optionValue,
    });

    // Update URL with the new selected options
    const newSearchParams = new URLSearchParams();
    Object.entries({
      ...selectedOptions,
      [optionName]: optionValue,
    }).forEach(([name, value]) => {
      newSearchParams.set(name, value);
    });
    setSearchParamsURL(newSearchParams.toString());

    navigate(`?${newSearchParams}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const parentRef = useRef(null);
  const quickAddRef = useRef(null);

  useEffect(() => {
    const parentEl = parentRef.current;
    const quickAddEl = quickAddRef.current;

    if (!parentEl || !quickAddEl) return;

    const resizeObserver = new ResizeObserver(() => {
      const {width, height} = parentEl.getBoundingClientRect();
      quickAddEl.style.width = `${width}px`;
      quickAddEl.style.height = `${height}px`;
    });

    resizeObserver.observe(parentEl);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div key={productIndex} className="collection-tabs-content embla__slide">
      <div className="tabs-products-items-container" ref={parentRef}>
        <div className="tabs-products-items-error"></div>
        <Link
          to={`products/${product.handle}?${searchParamsURL}`}
          className="tabs-products-a-tag"
        >
          <div className="tabs-products-pagination"></div>
          <div className="tabs-products-images aspect-[0.9]">
            <SwiperComponent
              images={product.images}
              collectionIndex={collectionIndex}
              productIndex={productIndex}
              currentVariant={currentVariant}
              usePrefix={usePrefix}
            />
          </div>
        </Link>

        {productOptions
          .map((opt) => {
            opt.name === 'Color';
            return opt.optionValues.find(
              (value) =>
                value.name ===
                currentVariant.selectedOptions.find(
                  (opt) => opt.name === 'Color',
                )?.value,
            )?.available;
          })
          .filter((itmes) => {
            return itmes !== undefined;
          })
          .toString().length > 0
          ? productOptions
              .map((opt) => {
                opt.name === 'Color';
                return opt.optionValues.find(
                  (value) =>
                    value.name ===
                    currentVariant.selectedOptions.find(
                      (opt) => opt.name === 'Color',
                    )?.value,
                )?.available;
              })
              .filter((itmes) => {
                return itmes !== undefined;
              })
              .toString() === 'false' && (
              <div className="tabs-product-sold-out-btn">Sold Out</div>
            )
          : !currentVariant?.availableForSale && (
              <div className="tabs-product-sold-out-btn">Sold Out</div>
            )}

        <div
          className="quick-add-to-cart-container"
          ref={quickAddRef}
          style={{position: 'absolute', top: '0px'}}
        >
          <ProductCardQuickAddButton
            product={product}
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            currentVariant={currentVariant}
          />
        </div>
      </div>

      <div className="tabs-products-info text-left">
        <Link
          className="tabs-products-info-a-tag"
          to={`products/${product.handle}?${searchParamsURL}`}
        >
          <p className="visually-hidden">{product.title}</p>
          <div className="tabs-products-title-wrapper">
            <p className="tabs-products-title">{product.title}</p>
          </div>

          {/* color */}

          <div className="tabs-products-price-wrapper">
            {currentVariant.selectedOptions.map((selectedOption) => (
              <>
                <span
                  className={`tabs-products-price-cutline`}
                  style={{
                    display: `${
                      selectedOption.name === 'Color' ? 'block' : 'none'
                    }`,
                  }}
                >
                  {selectedOption.name === 'Color' && (
                    <>{selectedOption.value}</>
                  )}
                </span>
              </>
            ))}

            {console.log(currentVariant, 'currentVariant on quick add page')}
            <span className="tabs-products-price">
              {currentVariant?.price ? (
                <Money data={currentVariant?.price} />
              ) : null}
            </span>
          </div>

          {!currentVariant?.availableForSale && (
            <p className="tabs-products-sold-out">
              <em>Sold Out</em>
            </p>
          )}
        </Link>

        {/* Color swatches */}
        {productOptions.map(
          (option) =>
            option.name === 'Color' && (
              <div
                key={option.name}
                className="tabs-products-swatch-main-container"
              >
                {option.optionValues.length > 1 && (
                  <div className="tabs-products-swatch-sub-container">
                    <p className="tabs-products-swatch-title">
                      {option.optionValues.length} Colors Available
                    </p>

                    <div className="tabs-products-swatch-main-wrapper">
                      <div className="tabs-products-swatch-sub-wrapper">
                        <div className="tabs-products-swatch-inner">
                          {option.optionValues.map((value, index) => {
                            const isSelected =
                              selectedOptions[option.name] === value.name;
                            const isAvailable = value.exists;
                            if (index < 5) {
                              return (
                                <>
                                  <div
                                    key={value.name}
                                    className={`tabs-products-swatch-holder ${
                                      !value.available ? 'sold-out' : ''
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      className={`product-options-item${
                                        isAvailable && !isSelected
                                          ? ' link'
                                          : ' selected'
                                      }`}
                                      style={{opacity: isAvailable ? 1 : 0.3}}
                                      disabled={!isAvailable}
                                      onClick={() =>
                                        handleOptionChange(
                                          option.name,
                                          value.name,
                                        )
                                      }
                                      title={`${value.name}`}
                                      aria-label={`${value.name}`}
                                    >
                                      <div className="tabs-products-swatch">
                                        <div className="tabs-products-swatch-size">
                                          {value.firstSelectableVariant
                                            .image && (
                                            <div className="relative block w-full h-full overflow-hidden aspect-[1.0]">
                                              <Image
                                                data={
                                                  value.firstSelectableVariant
                                                    .image
                                                }
                                                class="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                                                height="35"
                                                width="26"
                                                loading="lazy"
                                                fetchpriority="low"
                                                style={{
                                                  objectPosition:
                                                    'center center',
                                                }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  </div>
                                </>
                              );
                            }
                          })}
                          {option.optionValues.length > 5 && (
                            <Link
                              to={`products/${product.handle}?${searchParamsURL}`}
                              className="tabs-products-swatch-more-links"
                            >
                              {option.optionValues.length - 5}+
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ),
        )}
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

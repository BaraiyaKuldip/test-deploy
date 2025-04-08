import React, {useEffect, useState} from 'react';
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
import {useAside} from './Aside';

export default function ProductCardQuickAdd({
  product,
  productIndex,
  collectionIndex,
}) {
  const navigate = useNavigate();
  const {open} = useAside();

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

    navigate(`?${newSearchParams.toString()}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  return (
    <div key={productIndex} className="collection-tabs-content embla__slide">
      <div className="tabs-products-items-container">
        <div className="tabs-products-items-error"></div>
        <Link to={`products/${product.handle}`} className="tabs-products-a-tag">
          <div className="tabs-products-pagination"></div>
          <div className="tabs-products-images aspect-[0.9]">
            <SwiperComponent
              images={product.images}
              collectionIndex={collectionIndex}
              productIndex={productIndex}
            />
          </div>
        </Link>

        {!currentVariant?.availableForSale && (
          <div className="tabs-product-sold-out-btn">Sold Out</div>
        )}

        <div className="tabs-product-variants-box min-h-[40px] md:min-h-[48px]">
          <div className="tabs-product-variants-box-wrapper">
            <div className="h-full w-full">
              <button
                className={`tabs-product-variants-btn ${
                  product?.options[0].name !== 'Title'
                    ? 'variants_available'
                    : ''
                }`}
              >
                <AddToCartButton
                  disabled={
                    product?.options[0].name === 'Title' || !product?.availableForSale 
                  }
                  onClick={() => {
                    open('cart');
                  }}
                  lines={
                    currentVariant
                      ? [
                          {
                            merchandiseId: currentVariant.id,
                            quantity: 1,
                          },
                        ]
                      : []
                  }
                >
                  <span
                    className={`h-full w-full cursor-pointer ${
                      product.availableForSale
                        ? 'opacity-100'
                        : 'opacity-30'
                    }`}
                  >
                    {product?.options[0].name !== 'Title'
                      ? 'Quick Add'
                      : 'Add To Cart'}
                  </span>
                </AddToCartButton>
              </button>

              {/* Variant Selector */}
              {product?.options[0].name !== 'Title' && (
                <div className={`ket_option_variants `}>
                  <div
                    className="variant-selects flex flex-row items-center flex-wrap justify-center space-x-r2 py-r4 md:gap-y-r2 cursor-pointer"
                    id="variant-selects-template"
                  >
                    {/* {console.log(
                        product?.options[0].name === 'Title',
                        'psops',
                      )} */}
                    {console.log(product, 'product optionsss')}
                    {product.variants.nodes.map((variant) => (
                      <>
                        {/* {console.log(product, 'psops')} */}
                        {variant.selectedOptions.map((selectedOption) => {
                          const variantColor = variant.selectedOptions.find(
                            (opt) => opt.name === 'Color',
                          )?.value;

                          const selectedColor =
                            currentVariant.selectedOptions.find(
                              (opt) => opt.name === 'Color',
                            )?.value;
                          
                          return (
                            <>
                                    {variantColor === selectedColor ? console.log(
                                      currentVariant,
                                      'selected varrr',
                                    ):""}
                              {variantColor === selectedColor &&
                                selectedOption.name === 'Size' && (
                                  <>
                                    <AddToCartButton
                                      disabled={
                                        !variant || !variant.availableForSale
                                      }
                                      onClick={() => {
                                        open('cart');
                                      }}
                                      lines={
                                        currentVariant
                                          ? [
                                              {
                                                merchandiseId:
                                                  currentVariant.id,
                                                quantity: 1,
                                              },
                                            ]
                                          : []
                                      }
                                    >
                                      {/* {console.log(
                                product.selectedOrFirstAvailableVariant,
                                'product selected first available variant',
                              )} */}
                              
                                      <div className={`product-form__buttons w-full h-full` }>
                                        <button
                                          key={selectedOption.name}
                                          type="button"
                                          type="submit"
                                          name="add"
                                          value={variant.id}
                                          className={`product-form__submit button button--full-width group-option-btn h-full w-full cursor-pointer `}
                                          // disabled={!variant.availableForSale}
                                          onClick={() =>
                                            handleOptionChange(
                                              selectedOption.name,
                                              selectedOption.value,
                                            )
                                          }
                                        >
                                          <span className={`tabs-variant-select-btn inline-block whitespace-nowrap text-button-contrast px-r4 py-r4 group-hover-option-button-text-button-contrast group-hover-option-button-bg-button-contrast-5 ${variant.availableForSale ? "" : "opacity-70 line-through"}`}>
                                            {selectedOption.value}
                                          </span>
                                          <div className="loading__spinner hidden">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="spinner"
                                              viewBox="0 0 66 66"
                                            >
                                              <circle
                                                strokeWidth="6"
                                                cx="33"
                                                cy="33"
                                                r="30"
                                                fill="none"
                                                className="path"
                                              ></circle>
                                            </svg>
                                          </div>
                                        </button>
                                      </div>
                                    </AddToCartButton>
                                  </>
                                )}
                            </>
                          );
                        })}

                        {/* <a
                                className="ket_extar_variants"
                                href="/products/the-lori-off-shoulder"
                              >
                                2+
                              </a> */}
                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-products-info text-left">
        <Link
          className="tabs-products-info-a-tag"
          to={`products/${product.handle}`}
        >
          <p className="visually-hidden">{product.title}</p>
            <div className="tabs-products-title-wrapper">
              <p className="tabs-products-title">{product.title}</p>
            </div>

            <div className="tabs-products-price-wrapper">
              {currentVariant.selectedOptions.map(
                (selectedOption) => (
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
                ),
              )}
              {/* color */}
              {/* {console.log(
                product.selectedOrFirstAvailableVariant.selectedOptions,
                'product selected or first',
              )} */}
              <span className="tabs-products-price">
                {product?.selectedOrFirstAvailableVariant?.price ? (
                  <Money
                    data={product?.selectedOrFirstAvailableVariant?.price}
                  />
                ) : null}
              </span>
            </div>

            {!product?.selectedOrFirstAvailableVariant?.availableForSale && (
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
                <div className="tabs-products-swatch-sub-container">
                  <p className="tabs-products-swatch-title">
                    {option.optionValues.length} Colors Available
                  </p>
                  <div className="tabs-products-swatch-main-wrapper">
                    <div className="tabs-products-swatch-sub-wrapper">
                      <div className="tabs-products-swatch-inner">
                        {option.optionValues.map((value) => {
                          const isSelected =
                            selectedOptions[option.name] === value.name;
                          const isAvailable = value.exists;
                          console.log(value,"valuee");
                          return (
                            <div
                              key={value.name}
                              className={`tabs-products-swatch-holder ${
                                !value.available ? 'sold-out' : ''
                              }`}
                            >
                              <button
                                type="button"
                                className={`product-options-item${
                                  isAvailable && !isSelected ? ' link' : ''
                                }`}
                                style={{
                                  border: isSelected
                                    ? '1px solid red'
                                    : '1px solid transparent',
                                  opacity: isAvailable ? 1 : 0.3,
                                }}
                                disabled={!isAvailable}
                                onClick={() =>
                                  handleOptionChange(option.name, value.name)
                                }
                              >
                                <div className="tabs-products-swatch">
                                  <div className="tabs-products-swatch-size">
                                    {value.firstSelectableVariant.image && (
                                      <div className="relative block w-full h-full overflow-hidden aspect-[1.0]">
                                        <Image
                                          data={
                                            value.firstSelectableVariant.image
                                          }
                                          class="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                                          height="35"
                                          width="26"
                                          loading="lazy"
                                          fetchPriority="low"
                                          style={{
                                            objectPosition: 'center center',
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                        {option.optionValues.length > 5 && (
                          <a
                            href="#"
                            className="tabs-products-swatch-more-links"
                          >
                            {option.optionValues.length - 5}+
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first:100){
      edges{
        node{
          id
          url
          altText
          width
          height
        }
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

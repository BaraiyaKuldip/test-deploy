import React, {useState} from 'react';
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

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  console.log(request ,"request on quick add")

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context, params}) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

/**
 * @param {{
*   productOptions: MappedProductOptions[];
*   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
* }}
*/

export default function ProductCardQuickAdd({
  product,
  productIndex,
  collectionIndex,
}) {
  
/** @type {LoaderReturnData} */

  const navigate = useNavigate();
  const {open} = useAside();
  const [selectedVariantId, setSelectedVariantId] = useState('');

  // const {product} = product;
  console.log(product, 'product all data');

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  {
    console.log(selectedVariant, 'selected variant');
  }

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);


  // Get the product options array
  console.log(product, 'product');
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });
  console.log(productOptions, 'product options.');

  const {title, descriptionHtml} = product;

  // Log the data for debugging
  console.log(
    {
      product, // Full product data
      selectedVariant, // Currently selected variant
      productOptions, // Structured options data
    },
    'product ,',
  );

  return (
    <>
      {console.log(product, 'products on quick add page')}
      <div key={productIndex} className="collection-tabs-content embla__slide">
        {/* {console.log(product.images, 'product map')} */}
        <div className="tabs-products-items-container ">
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

          {!product?.selectedOrFirstAvailableVariant?.availableForSale && (
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
                  {/* <span>Quick Add</span> */}
                  <AddToCartButton
                    disabled={
                      !product?.selectedOrFirstAvailableVariant ||
                      !product?.selectedOrFirstAvailableVariant
                        ?.availableForSale
                    }
                    onClick={() => {
                      open('cart');
                    }}
                    lines={
                      product?.selectedOrFirstAvailableVariant
                        ? [
                            {
                              merchandiseId:
                                product?.selectedOrFirstAvailableVariant.id,
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
                    <span
                      className={`h-full w-full cursor-pointer ${
                        product?.selectedOrFirstAvailableVariant
                          ?.availableForSale
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
                {/* <div className="tabs-product-variants"> */}

                {product?.options[0].name !== 'Title' && (
                  <div className="ket_option_variants">
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
                              selectedVariant.selectedOptions.find(
                                (opt) => opt.name === 'Color',
                              )?.value;

                            return (
                              <>
                                {variantColor === selectedColor &&
                                  selectedOption.name === 'Size' && (
                                    <>
                                      {console.log(
                                        selectedOption,
                                        'selected varrr',
                                      )}
                                      <AddToCartButton
                                        disabled={
                                          !variant || !variant?.availableForSale
                                        }
                                        onClick={() => {
                                          open('cart');
                                        }}
                                        lines={
                                          variant
                                            ? [
                                                {
                                                  merchandiseId: variant.id,
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
                                        <div className="product-form__buttons w-full h-full">
                                          <button
                                            type="submit"
                                            name="add"
                                            value={variant.id}
                                            className="product-form__submit button button--full-width group-option-btn h-full w-full cursor-pointer"
                                          >
                                            <span className="tabs-variant-select-btn inline-block whitespace-nowrap text-button-contrast px-r4 py-r4 group-hover-option-button-text-button-contrast group-hover-option-button-bg-button-contrast-5">
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
                {/* </div> */}
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
              {product.selectedOrFirstAvailableVariant.selectedOptions.map(
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
          </a>
          {productOptions.map((option) => (
            <>
              {console.log(option, 'optionss')}
              {option.name === 'Color' && option.optionValues.length > 1 && (
                <>
                  <div className="tabs-products-swatch-main-container">
                    <div className="tabs-products-swatch-sub-container">
                      <p className="tabs-products-swatch-title">
                        {option.optionValues.length} Colors Available
                      </p>
                      <div className="tabs-products-swatch-main-wrapper">
                        <div className="tabs-products-swatch-sub-wrapper">
                          <div className="tabs-products-swatch-inner">
                            {option.optionValues.map((optionValue,index) => {
                              const {
                                name,
                                handle,
                                variantUriQuery,
                                selected,
                                available,
                                exists,
                                isDifferentProduct,
                                swatch,
                              } = optionValue;

                              const [activeSwatchTab, setActiveSwatchTab] = useState(0);
                              
                                const handleSwatchTabClick = (tabIndex) => {
                                  setActiveSwatchTab(tabIndex);
                                };

                              return (
                                <>
                                  {console.log(optionValue, 'option valueee')}
                                  <div
                                    className={`tabs-products-swatch-holder ${
                                      optionValue.firstSelectableVariant
                                        .availableForSale
                                        ? ''
                                        : 'sold-out'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      className={`product-options-item${
                                        exists && !selected ? ' link' : ''
                                      }`}
                                      key={option.name + name}
                                      style={{
                                        border: selected
                                          ? '1px solid red'
                                          : '1px solid transparent',
                                        opacity: available ? 1 : 0.3,
                                      }}
                                      disabled={!exists}
                                      data-tab={index}
                                      tabIndex={index}
                                      onClick={() => {
                                        handleSwatchTabClick(index)
                                        if (!selected) {
                                          navigate(`?${variantUriQuery}`, {
                                            replace: true,
                                            preventScrollReset: true,
                                          });
                                        }
                                      }}
                                    >
                                      {console.log(activeSwatchTab,"active index")}
                                      <div className="tabs-products-swatch">
                                        <div className="tabs-products-swatch-size">
                                          {optionValue.firstSelectableVariant
                                            .image && (
                                            <div className="relative block w-full h-full overflow-hidden aspect-[1.0]">
                                              <Image
                                                data={
                                                  optionValue
                                                    .firstSelectableVariant
                                                    .image
                                                }
                                                class="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                                                height="35"
                                                width="26"
                                                loading="lazy"
                                                fetchPriority="low"
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
                            })}
                            {option.optionValues.length > 5 && (
                              <>
                                <a
                                  href="#"
                                  className="  tabs-products-swatch-more-links"
                                >
                                  {option.optionValues.length - 5}+
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ))}
        </div>
      </div>
    </>
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

import react, {useState, useRef, useEffect} from 'react';
import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import GirlImage1Landscape from '/images/GirlImage1Landscape.png?url';
import GirlImage1Portrait from '/images/GirlImage1Portrait.png?url';
import GirlImage1 from '/images/girl-1134567_1280.jpg?url';
import GirlImage2 from '/images/woman-7121174_1280.jpg?url';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {EffectFade, Autoplay, Pagination, Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperComponent from '~/components/ProductCard';

import useEmblaCarousel from 'embla-carousel-react';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from '../components/EmblaCarouselArrowButtons';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

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
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes.filter((collection) =>
      ['boot', 'Perfumes', 'Veggies', 'test2'].includes(collection.title),
    ),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  {
    console.log(data, 'nnnn data');
  }
  return (
    <div className="home">
      <div
        style={{backgroundImage: `url(${GirlImage1Landscape})`}}
        className="div_bg_image"
      >
        <div className="mx-6 mt-20 p-12.5">
          <div style={{zIndex: 1}}>
            <p className="font-semibold normal-font-style ">
              A CONSCIOUS WARDROBE
            </p>
            <p className="alegreya-font-style">
              Timeless Style <br /> Sustainable Design{' '}
            </p>
            {/* <p className='alegreya-font-style'></p> */}
            <div className="div_bg_hero_div">
              <button
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  width: '200px',
                  height: '50px',
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '1px',
                  cursor: 'pointer',
                  margin: '5px',
                }}
              >
                VIEW PRODUCTS
              </button>
              <a href="#" className="div_bg_hero_a">
                LEARN MORE
              </a>
            </div>
          </div>
        </div>
      </div>
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  const {open} = useAside();

  if (!collection) return null;
  {
    console.log(collection, 'nnnn collection');
  }

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const image = collection?.image;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    align: 'start',
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes(), 'embla'); // Access API
    }
  }, [emblaApi]);

  return (
    <>
      <div className="collection-tabs-wrapper">
        <div className="collection-tabs">
          <h2 className="collection-tabs-heading">Signature fabrics</h2>
        </div>

        <div className="tabs-scroll-container">
          {/* Tabs */}
          <div className="tabs-wrapper">
            {collection.map((collection, index) => (
              <div key={index}>
                <button
                  type="button"
                  className={`tab-button ${
                    activeTab === index
                      ? 'tab-button-active'
                      : 'tab-button-inactive'
                  }`}
                  onClick={() => handleTabClick(index)}
                  data-tab={index}
                  tabIndex={index}
                >
                  {console.log(collection.products, 'nknk')}
                  <span className="uppercase"> {collection.title}</span>
                </button>
              </div>
            ))}
          </div>
          {/* Arrows */}
          <button
            type="button"
            className="tabs-arrow tabs-arrow-prev"
            data-scrollbar-arrow-prev=""
          >
            <span className="visually-hidden">See all</span>
          </button>
          <button
            type="button"
            className="tabs-arrow tabs-arrow-next"
            data-scrollbar-arrow-next=""
          >
            <span className="visually-hidden">See all</span>
          </button>
        </div>

        <div
          id="collection-tabs-content-wrapper"
          className="collection-tabs-content-wrapper"
        >
          <div className="embla__controls">
            <div className="embla__buttons">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </div>
          </div>
          {collection.map((collection, collectionIndex) => (
            <>
              {activeTab === collectionIndex && (
                <div key={collectionIndex} className="embla" ref={emblaRef}>
                  <div
                    className={`embla__container collection-tabs-content-${collection.title}`}
                  >
                    {console.log(activeTab, 'active tab')}
                    {collection.products.nodes.map((product, productIndex) => (
                      <div
                        key={productIndex}
                        className="collection-tabs-content embla__slide"
                      >
                        {console.log(product.images, 'product map')}
                        <div className="tabs-products-items-container w-full">
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

                          {/* <AddToCartButton
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
                                        product?.selectedOrFirstAvailableVariant
                                          .id,
                                      quantity: 1,
                                    },
                                  ]
                                : []
                            }
                          > */}

                          {/* </AddToCartButton> */}

                          {!product?.selectedOrFirstAvailableVariant
                            ?.availableForSale && (
                            <div className="tabs-product-sold-out-btn">
                              Sold Out
                            </div>
                          )}
                        </div>

                        <div className="tabs-products-info text-left">
                          <a href="#">
                            <p className="visually-hidden">{product.title}</p>
                            <div className="tabs-products-title-wrapper">
                              <p className="tabs-products-title">
                                {product.title}
                              </p>
                            </div>

                            <div className="tabs-products-price-wrapper">
                              {product.selectedOrFirstAvailableVariant.selectedOptions.map(
                                (selectedOption) => (
                                  <>
                                    <span
                                      className={`tabs-products-price-cutline`}
                                      style={{
                                        display: `${
                                          selectedOption.name === 'Color'
                                            ? 'block'
                                            : 'none'
                                        }`
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
                              {console.log(
                                product.selectedOrFirstAvailableVariant
                                  .selectedOptions,
                                'product selected or first',
                              )}
                              <span className="tabs-products-price">
                                {product?.selectedOrFirstAvailableVariant
                                  ?.price ? (
                                  <Money
                                    data={
                                      product?.selectedOrFirstAvailableVariant
                                        ?.price
                                    }
                                  />
                                ) : null}
                              </span>
                            </div>
                            
                            {!product?.selectedOrFirstAvailableVariant
                            ?.availableForSale && (
                            <p className='tabs-products-sold-out'>
                              <em>
                                Sold Out
                              </em>
                            </p>
                            )}

                          </a>

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
                                  <span>Quick Add</span>
                                  {/* <AddToCartButton
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
                                                product
                                                  ?.selectedOrFirstAvailableVariant
                                                  .id,
                                              quantity: 1,
                                            },
                                          ]
                                        : []
                                    }
                                  >
                                    {console.log(
                                      product.selectedOrFirstAvailableVariant,
                                      'product selected first available variant',
                                    )}
                                    <span
                                      className={` cursor-pointer ${
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
                                  </AddToCartButton> */}
                                </button>
                                {/* <div className="tabs-product-variants"> */}

                                {product?.options[0].name !== 'Title' && (
                                  <div className="ket_option_variants">
                                    <div
                                      className="variant-selects flex flex-row items-center flex-wrap justify-center space-x-r2 py-r4 md:gap-y-r2 cursor-pointer"
                                      id="variant-selects-template"
                                    >
                                      {console.log(
                                        product?.options[0].name === 'Title',
                                        'psops',
                                      )}
                                      {product?.options.map((option) => (
                                        <>
                                          {option.name === 'Size' && (
                                            <>
                                              {console.log(product, 'psops')}

                                              {option.optionValues.map(
                                                (
                                                  optionValue,
                                                  optionValueIndex,
                                                ) => {
                                                  return (
                                                    <>
                                                      <fieldset
                                                        key={optionValueIndex}
                                                        className="product-form__input product-form__input--pill h-12"
                                                      >
                                                        <div className="w-full h-full">
                                                          <form
                                                            method="post"
                                                            action="/cart/add"
                                                            onSubmit={console.log(
                                                              'selected input ',
                                                            )}
                                                            className="form w-full h-full"
                                                            encType="multipart/form-data"
                                                            noValidate
                                                          >
                                                            <input
                                                              type="hidden"
                                                              name="form_type"
                                                              value="product"
                                                            />
                                                            <input
                                                              type="hidden"
                                                              name="utf8"
                                                              value="✓"
                                                            />
                                                            <input
                                                              type="hidden"
                                                              name="id"
                                                              value="46910603919600"
                                                              className="product-variant-id"
                                                            />
                                                            <div className="product-form__buttons w-full h-full">
                                                              <button
                                                                type="submit"
                                                                name="add"
                                                                value={
                                                                  optionValue.name
                                                                }
                                                                className="product-form__submit button button--full-width group-option-btn h-full w-full cursor-pointer"
                                                              >
                                                                <span className="tabs-variant-select-btn inline-block whitespace-nowrap text-button-contrast px-r4 py-r4 group-hover-option-button-text-button-contrast group-hover-option-button-bg-button-contrast-5">
                                                                  {
                                                                    optionValue.name
                                                                  }
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
                                                            <input
                                                              type="hidden"
                                                              name="product-id"
                                                              value="9144418861296"
                                                            />
                                                            <input
                                                              type="hidden"
                                                              name="section-id"
                                                              value="template--18996264501488__featured_collection_tabs_egEfMA"
                                                            />
                                                          </form>
                                                        </div>
                                                      </fieldset>
                                                      {/* <button
                                                type="submit"
                                                name="add"
                                                value={
                                                  optionValue.name
                                                }
                                                className="product-form__submit button button--full-width"
                                              >
                                                <span>
                                                  {optionValue.name}
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
                                              </button> */}
                                                    </>
                                                  );
                                                },
                                              )}
                                            </>
                                          )}
                                        </>
                                      ))}
                                      {/* 
                            <a
                              className="ket_extar_variants"
                              href="/products/the-lori-off-shoulder"
                            >
                              2+
                            </a>
                             */}
                                    </div>
                                  </div>
                                )}
                                {/* </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  {
    console.log(products, 'nnnn products');
  }

  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
    products(first:200){
        nodes{
          id
          title
          handle
          images(first:6){
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
          totalInventory
          selectedOrFirstAvailableVariant{
							availableForSale
            	id
            	sku
            	title
            compareAtPrice{
              amount
              currencyCode
            }
            image{
              __typename
              id
              url 
              altText
              width
              height
            }
            price{
              amount
              currencyCode
            }
            product{
              title
              handle
            }
            selectedOptions{
              name
              value
            }
            unitPrice{
              amount
              currencyCode
            }
          }
          adjacentVariants{
            availableForSale
            id
            sku
            title
            compareAtPrice{
              amount
              currencyCode
            }
            image{
              __typename
              id
              url
              altText
              height
              width
            }
            price{
              amount
              currencyCode
            }
            product{
              title
              handle
            }
            selectedOptions{
              name
              value
            }
            unitPrice{
              amount
              currencyCode
            }
          }
          seo{
            description
            title
          }
          options{
            name
            optionValues{
              name
              firstSelectableVariant{
                availableForSale
              }
              swatch{
                color
                image{
                  previewImage{
                    url
                  }
                } 
              } 
            } 
          }
          variants(first:100){
            nodes{
              id
              title
            }
          }
          variantsCount{
            count
            precision
          }
        }
      }
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: TITLE, reverse: false) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

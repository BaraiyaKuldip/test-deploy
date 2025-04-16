import react, {useState, useRef, useEffect} from 'react';
import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import GirlImage1Landscape from '/images/GirlImage1Landscape.png?url';
import GirlImage1Portrait from '/images/GirlImage1Portrait.png?url';
import GirlImage1 from '/images/girl-1134567_1280.jpg?url';
import GirlImage2 from '/images/woman-7121174_1280.jpg?url';
import HolidayCollectionHeroImg from '/images/cc-holiday-collection-hero-img.jpg?url';
import FringeCollectionHeroImg from '/images/cc-fringe-collection-hero-img.jpg?url';
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
import ProductCardQuickAdd from '~/components/ProductCardQuickAdd';

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
  // Execute both queries in parallel
  const [featuredResults, curatedResults] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(CURATED_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: featuredResults.collections.nodes,
    curatedCollection: curatedResults.collections.nodes,
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
      <CuratedCollection />
      <CuratedCollectionSplit collection={data.curatedCollection} />
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
  const tabsContainerRef = useRef(null);
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(true);

  const handleTabClick = (index) => {
    setActiveTab(index);
    // Scroll to center the active tab
    if (tabsContainerRef.current) {
      const tab = tabsContainerRef.current.children[index]?.firstChild;
      if (tab) {
        const containerWidth = tabsContainerRef.current.offsetWidth;
        const tabLeft = tab.offsetLeft;
        const tabWidth = tab.offsetWidth;
        const scrollTo = tabLeft - containerWidth / 2 + tabWidth / 2;

        tabsContainerRef.current.scrollTo({
          left: scrollTo,
          behavior: 'smooth',
        });
      }
    }
  };

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = tabsContainerRef.current.offsetWidth * 0.8;
      const newScrollLeft =
        direction === 'prev'
          ? Math.max(0, tabsContainerRef.current.scrollLeft - scrollAmount)
          : Math.min(
              tabsContainerRef.current.scrollWidth -
                tabsContainerRef.current.offsetWidth,
              tabsContainerRef.current.scrollLeft + scrollAmount,
            );

      tabsContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const checkScrollPosition = () => {
    if (tabsContainerRef.current) {
      const {scrollLeft, scrollWidth, clientWidth} = tabsContainerRef.current;
      const atStart = scrollLeft <= 0;
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 1; // -1 for rounding errors

      setShowPrevArrow(!atStart);
      setShowNextArrow(!atEnd);
    }
  };

  // Initialize and add event listeners
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);

      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

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
          <div
            className={`tabs-wrapper ${
              showPrevArrow || showNextArrow ? 'sm:ms-[60px] sm:me-[50px]' : ''
            }`}
            ref={tabsContainerRef}
            style={{
              justifyContent: `${
                showPrevArrow || showNextArrow ? 'normal' : 'center'
              }`,
              gap: `${showPrevArrow || showNextArrow ? '0px' : '1rem'}`,
            }}
          >
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
                  <span className="uppercase"> {collection.title}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            type="button"
            className={`tabs-arrow tabs-arrow-prev ${
              !showPrevArrow ? 'is-hidden' : 'is-visible'
            }`}
            onClick={() => scrollTabs('prev')}
            data-scrollbar-arrow-prev=""
          >
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            type="button"
            className={`tabs-arrow tabs-arrow-next ${
              !showNextArrow ? 'is-hidden' : 'is-visible'
            }`}
            onClick={() => scrollTabs('next')}
            data-scrollbar-arrow-next=""
          >
            <span className="visually-hidden">Next</span>
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
                      <ProductCardQuickAdd
                        product={product}
                        productIndex={productIndex}
                        collectionIndex={collectionIndex}
                        usePrefix={"featured-collection"}
                      />
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
    console.log(products, 'recommeded products');
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

function CuratedCollection() {
  return (
    <>
      <div className="custom-collection">
        <div className="custom-collection-wrapper">
          <div className="custom-collection-heading-center">
            <div className="custom-collection-main-heading">
              <p></p>
              <p>Curated Collections</p>
              <p></p>
            </div>
            <div className="custom-collection-sub-heading">
              <p>Handcrafted by our expert designers.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * @param {{
 *   collection: CuratedCollectionFragment;
 * }}
 */
function CuratedCollectionSplit({collection}) {
  console.log(collection, 'curated collection data');

  return (
    <>
      <div className="custom-collection">
        {collection.map((collection, collectionIndex) => {
          return (
            <div className="custom-collection-section">
              <div className="custom-collection-wrapper">
                <div className="custom-collection-grid">
                  {/* Hero Block */}
                  <div
                    className={`custom-collection-hero-block index-${
                      collectionIndex + 1
                    }`}
                  >
                    <div className="custom-collection-hero-content">
                      <div className="custom-collection-hero-text">
                        <div>
                          <p className="custom-collection-kicker">
                            {collection.title}
                          </p>
                          <h2 className="custom-collection-title">
                            {collection.description}
                          </h2>
                          <Link to="#" className="custom-collection-btn">
                            {collectionIndex === 1
                              ? 'Fringe Lookbook'
                              : 'View The Lookbook'}
                          </Link>
                        </div>
                      </div>

                      <div className="custom-collection-overlay"></div>

                      <div className="custom-collection-image-frame">
                        <div className="custom-collection-image-pane">
                          <div className="custom-collection-image-scale">
                            <div className="custom-collection-image-wrapper relative block w-full h-full overflow-hidden aspect-[--wh-ratio]">
                              {/* <Image data={collection.image}/> */}
                              <img
                                src={collection.image.url}
                                alt={collection.image.altText || collection.title}
                                width="1546"
                                height="2001"
                                loading="lazy"
                                class="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                                sizes="100vw"
                                fetchpriority="auto"
                                style={{objectPosition: "61.1181% 25.4625%"}}
                              ></img>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div
                    className={`custom-collection-products index-${collectionIndex + 1}`}
                  >
                    <div className="custom-products-grid">
                      {/* Product 1 */}
                      {collection.products.nodes.map(
                        (product, productIndex) => (
                          <div className="custom-product-card">
                            <div className="custom-product-wrapper">
                              <ProductCardQuickAdd
                                product={product}
                                productIndex={productIndex}
                                collectionIndex={collectionIndex}
                                usePrefix={"curated-collection"}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Mobile Scrollbar */}
                    <div className="custom-mobile-scrollbar">
                      <div className="custom-scrollbar-track"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
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
    description
    products(first:200){
        nodes{
          id
          title
          availableForSale
          vendor
          handle  
          descriptionHtml
          description
          encodedVariantExistence
          encodedVariantAvailability
          media(first:100){
            nodes{
              alt
              id
              mediaContentType
              previewImage{
                url
                id
                altText
                height
                width
              }
            }
          }
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
          totalInventory
          selectedOrFirstAvailableVariant{
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
            metafield(namespace:"meta" , key:"swatch_images"){
                value
                id  
                type
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
            metafield(namespace:"meta" , key:"swatch_images"){
                value
                id  
                type
              }
          }
          seo{
            description
            title
          }
          options{
            id
            name
            optionValues{
              id
              name
              firstSelectableVariant{
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
                metafield(namespace:"meta" , key:"swatch_images"){
                value
                id  
                type
              }
              }
              swatch{
                color
                image{
                  alt
                  id
                  previewImage{
                    id
                    altText
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
              image{
                url
                altText
                id
                height
                width
              }
              availableForSale
              price {
                  amount
                  currencyCode
                }
              selectedOptions{
                name
                value
              }
              metafield(namespace:"meta" , key:"swatch_images"){
                value
                id  
                type
              }
            }  
          }
          variantsCount{
            count
            precision
          }
          metafield(namespace:"meta" , key:"swatch_images"){
            value
            id  
            type
          }
        }
      }
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100, query: "title:'boot' OR title:'Perfumes' OR title:'Veggies' OR title:'test2' OR title:'test1' OR title:'Empty collection' OR title:'mens chinos'" , sortKey: TITLE) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const CURATED_COLLECTION_QUERY = `#graphql
  fragment CuratedCollection on Collection {
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
    description
    products(first: 4, sortKey: CREATED, reverse: true){
        nodes{
          id
          title
          availableForSale
          vendor
          handle  
          descriptionHtml
          description
          encodedVariantExistence
          encodedVariantAvailability
          media(first:100){
            nodes{
              alt
              id
              mediaContentType
              previewImage{
                url
                id
                altText
                height
                width
              }
            }
          }
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
          totalInventory
          selectedOrFirstAvailableVariant{
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
            metafield(namespace:"meta" , key:"swatch_images"){
                value
                id  
                type
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
            metafield(namespace:"meta" , key:"swatch_images"){
                value
                id  
                type
              }
          }
          seo{
            description
            title
          }
          options{
            id
            name
            optionValues{
              id
              name
              firstSelectableVariant{
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
                metafield(namespace:"meta" , key:"swatch_images"){
                value
                id  
                type
              }
              }
              swatch{
                color
                image{
                  alt
                  id
                  previewImage{
                    id
                    altText
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
              image{
                url
                altText
                id
                height
                width
              }
              availableForSale
              price {
                  amount
                  currencyCode
                }
              selectedOptions{
                name
                value
              }
              metafield(namespace:"meta" , key:"swatch_images"){
                value
                id  
                type
              }
            }  
          }
          variantsCount{
            count
            precision
          }
          metafield(namespace:"meta" , key:"swatch_images"){
            value
            id  
            type
          }
        }
      }
  }
  query CuratedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 100,  query: "title:'fringe collection' OR title:'holiday collection'") {
      nodes {
        ...CuratedCollection
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
/** @typedef {import('storefrontapi.generated').CuratedCollectionFragment} CuratedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

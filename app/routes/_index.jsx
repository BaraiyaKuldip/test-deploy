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
                      
                      <ProductCardQuickAdd product={product} productIndex={productIndex} collectionIndex={collectionIndex} />
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
            id
            name
            optionValues{
              id
              name
              firstSelectableVariant{
                id
                availableForSale
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

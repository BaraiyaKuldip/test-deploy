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
import HotspotGirlImg from '/images/hotspot-girl-image.jpg?url';
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

// import Flickity from 'flickity';
import 'flickity/css/flickity.css';

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
  const [
    featuredResults,
    curatedResults,
    theLookCollectionResults,
    wayfarerCollectionResults,
    topCollectionsResults,
  ] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(CURATED_COLLECTION_QUERY),
    context.storefront.query(THE_LOOK_COLLECTION),
    context.storefront.query(WAYFARER_COLLECTION),
    context.storefront.query(TOP_COLLECTIONS),
  ]);

  return {
    featuredCollection: featuredResults.collections.nodes,
    curatedCollection: curatedResults.collections.nodes,
    TheLookCollection: theLookCollectionResults.collections.nodes,
    WayfarerCollection: wayfarerCollectionResults.collections.nodes,
    TopCollections: topCollectionsResults.collections.nodes,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const bestSellingProducts = context.storefront
    .query(BEST_SELLING_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    bestSellingProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  {
    console.log(data, 'data');
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

      <CuratedCollection collection={data.curatedCollection} />
      {/* <BestSellingProducts products={data.bestSellingProducts} /> */}
      <BestSellers products={data.bestSellingProducts} />
      {/* {console.log(data.bestSellingProducts, 'best selling products')} */}
      <TheLookCollection
        products={data.TheLookCollection[0].products.nodes}
        collection={data.TheLookCollection[0]}
      />
      {console.log(data.TheLookCollection[0], 'collectionnn')}
      <WayfarerCollection
        products={data.WayfarerCollection[0].products.nodes}
        collection={data.WayfarerCollection[0]}
      />

      <TopCollections collections={data.TopCollections}/>
      <FeatureSectionBottom/>

      {console.log(data.TopCollections,"top collections")}

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
    console.log(collection, 'collection data');
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
                    {collection.products.nodes.map((product, productIndex) => (
                      <ProductCardQuickAdd
                        product={product}
                        productIndex={productIndex}
                        collectionIndex={collectionIndex}
                        usePrefix={'featured-collection'}
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
 *   products: Promise<BestSellingProductsQuery | null>;
 * }}
 */

import React from 'react';
import CustomFlickitySlider from '~/components/CustomFlickitySlider';
import FeatureSectionBottom from '~/components/FeatureSectionBottom';

function BestSellers({products}) {
  return (
    <div
      className="best-sellers-section palette-light fixed_padding_page"
      style={{'--PT': '36px', '--PB': '36px'}}
    >
      <div className="best-sellers-wrapper section-padding">
        <h2 className="best-sellers-kicker mb-r11">Best Sellers</h2>

        <div
          className="best-sellers-grid"
          data-grid-large="4"
          data-grid-small="2"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={products}>
              {(response) => (
                <>
                  {console.log(response, 'response')}
                  {response
                    ? response.products.nodes.map((product, productIndex) => (
                        <>
                          {console.log(products, 'best selling products')}
                          <ProductCardQuickAdd
                            product={product}
                            productIndex={productIndex}
                            collectionIndex={1}
                            usePrefix={'best-selling'}
                          />
                        </>
                      ))
                    : null}
                </>
              )}
            </Await>
          </Suspense>
        </div>

        <div className="best-sellers-view-all text-center mt-r8">
          <Link to="/collections/best-sellers" className="button-outline">
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collection: CuratedCollectionFragment;
 * }}
 */
function CuratedCollection({collection}) {
  console.log(collection, 'curated collection data');

  // Create a ref for each collection's container and track
  const collectionRefs = useRef(
    collection.map(() => ({
      containerRef: React.createRef(),
      trackRef: React.createRef(),
      isDragging: false,
      startPosition: 0,
    })),
  );

  // Track width and position state for each collection
  const [scrollStates, setScrollStates] = useState(
    collection.map(() => ({trackWidth: 40, position: 0})),
  );

  // Calculate track width and set initial position for each collection
  useEffect(() => {
    collection.forEach((_, index) => {
      const container = collectionRefs.current[index].containerRef.current;
      if (!container) return;

      const updateScrollbar = () => {
        const {scrollWidth, clientWidth, scrollLeft} = container;
        // Calculate the track width as a percentage of visible content
        const newTrackWidth = (clientWidth / scrollWidth) * 100;

        // Calculate the track position
        const maxScroll = scrollWidth - clientWidth;
        const newPosition =
          maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - newTrackWidth) : 0;

        setScrollStates((prevStates) => {
          const newStates = [...prevStates];
          newStates[index] = {trackWidth: newTrackWidth, position: newPosition};
          return newStates;
        });
      };

      // Initial update
      updateScrollbar();

      // Listen for scroll events
      container.addEventListener('scroll', updateScrollbar);
      return () => container.removeEventListener('scroll', updateScrollbar);
    });
  }, [collection]);

  // Handle mouse events for drag behavior for each collection
  useEffect(() => {
    collection.forEach((_, index) => {
      const trackRef = collectionRefs.current[index].trackRef;
      if (!trackRef || !trackRef.current) return;

      const handleMouseDown = (e) => {
        collectionRefs.current[index].isDragging = true;
        collectionRefs.current[index].startPosition = e.clientX;
        document.body.style.userSelect = 'none'; // Prevent text selection during drag
      };

      const handleMouseMove = (e) => {
        const collectionRef = collectionRefs.current[index];
        if (!collectionRef.isDragging || !collectionRef.containerRef.current)
          return;

        const container = collectionRef.containerRef.current;
        const {scrollWidth, clientWidth} = container;
        const delta = e.clientX - collectionRef.startPosition;
        const maxScroll = scrollWidth - clientWidth;

        // Calculate how much to scroll based on mouse movement
        const scrollDelta = (delta / clientWidth) * maxScroll * -1;
        container.scrollLeft -= scrollDelta;
        collectionRef.startPosition = e.clientX;
      };

      const handleMouseUp = () => {
        collectionRefs.current[index].isDragging = false;
        document.body.style.userSelect = '';
      };

      // Add event listeners
      trackRef.current.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        if (trackRef.current) {
          trackRef.current.removeEventListener('mousedown', handleMouseDown);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    });
  }, [collection]);

  return (
    <>
      <div className="custom-collection">
        {collection.map((collection, collectionIndex) => {
          return (
            <div className="custom-collection-section" key={collectionIndex}>
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
                                alt={
                                  collection.image.altText || collection.title
                                }
                                width="1546"
                                height="2001"
                                loading="lazy"
                                className="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                                sizes="100vw"
                                fetchpriority="auto"
                                style={{objectPosition: '61.1181% 25.4625%'}}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div
                    className={`relative custom-collection-products index-${
                      collectionIndex + 1
                    }`}
                  >
                    <div
                      ref={collectionRefs.current[collectionIndex].containerRef}
                      style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                      className="custom-products-grid"
                    >
                      {/* Products */}
                      {collection.products.nodes.map(
                        (product, productIndex) => (
                          <div
                            className="custom-product-card"
                            key={productIndex}
                          >
                            <div className="custom-product-wrapper">
                              <ProductCardQuickAdd
                                product={product}
                                productIndex={productIndex}
                                collectionIndex={collectionIndex}
                                usePrefix={'curated-collection'}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Custom horizontal scrollbar */}
                    <div
                      className="custom-horizontal-scrollbar "
                      data-custom-horizontal-scrollbar=""
                    >
                      <div
                        ref={collectionRefs.current[collectionIndex].trackRef}
                        className="custom-horizontal-scrollbar-tracker"
                        data-custom-horizontal-scrollbar-tracker=""
                        style={{
                          '--custom-horizontal-scrollbar-width': `${scrollStates[collectionIndex].trackWidth}%`,
                          '--custom-horizontal-scrollbar-position': `${scrollStates[collectionIndex].position}%`,
                        }}
                      />
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

/**
 * @param {{
 *   collection: TheLookCollectionFragment;
 * }}
 */

// Hotspot Component (unchanged)
const Hotspot = ({hotspot, index, isSelected, onClick}) => {
  return (
    <button
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 ${
        isSelected ? 'border-black' : 'border-gray-300'
      } flex items-center justify-center`}
      style={{
        top: hotspot.topMobile,
        left: hotspot.leftMobile,
        zIndex: 10,
      }}
      onClick={onClick}
      aria-label={`Hotspot ${index + 1}`}
    >
      <span className="w-3 h-3 bg-black rounded-full"></span>
    </button>
  );
};

function TheLookCollection({products, collection}) {
  const [selectedHotspot, setSelectedHotspot] = useState(0);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(null);
  const flickityRef = useRef(null);
  const sliderRef = useRef(null);

  // Track if Flickity should be active (desktop vs. mobile)
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );

  useEffect(() => {
    let isMounted = true;

    // Update isDesktop state on resize
    const handleResize = () => {
      const isCurrentlyDesktop = window.innerWidth >= 768;
      setIsDesktop(isCurrentlyDesktop);
    };
    window.addEventListener('resize', handleResize);

    const initFlickity = () => {
      if (!sliderRef.current || !products || products.length === 0) {
        console.log(
          'Cannot initialize Flickity: sliderRef or products missing',
          {
            sliderRef: sliderRef.current,
            productsLength: products ? products.length : 'undefined',
          },
        );
        return;
      }

      // Only initialize Flickity on desktop
      if (!isDesktop) {
        console.log('Mobile view: Skipping Flickity initialization');
        // Ensure any existing Flickity instance is destroyed
        if (flickityRef.current) {
          flickityRef.current.destroy();
          flickityRef.current = null;
        }
        return;
      }

      console.log('Attempting to initialize Flickity (desktop)');
      try {
        // Ensure carousel cells are rendered
        const cells = sliderRef.current.querySelectorAll('.carousel-cell');
        console.log('Carousel cells found:', cells.length);

        flickityRef.current = new Flickity(sliderRef.current, {
          cellAlign: 'center',
          contain: true,
          pageDots: true,
          prevNextButtons: true,
          wrapAround: false,
          freeScroll: true,
          watchCSS: false, // Disabled to avoid Chrome issues
          arrowShape:
            'M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z',
          on: {
            ready: () => console.log('Flickity ready'),
            resize: () => console.log('Flickity resized'),
            change: (index) => {
              console.log('Flickity change:', index);
              setSelectedHotspot(index);
            },
          },
        });
        console.log('Flickity initialized successfully');

        // Force layout recalculation
        flickityRef.current.reloadCells();
        flickityRef.current.resize();

        // Manually trigger resize after a delay
        setTimeout(() => {
          if (isMounted && flickityRef.current) {
            console.log('Manually triggering Flickity resize');
            flickityRef.current.resize();
          }
        }, 200);
      } catch (error) {
        console.error('Flickity initialization failed:', error);
      }
    };

    // Defer initialization until DOM is fully loaded
    if (document.readyState === 'complete') {
      console.log('DOM ready, initializing Flickity');
      initFlickity();
    } else {
      console.log('Waiting for DOM to load');
      window.addEventListener('load', initFlickity);
    }

    // Cleanup
    return () => {
      isMounted = false;
      console.log('Destroying Flickity');
      if (flickityRef.current) {
        flickityRef.current.destroy();
        flickityRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', initFlickity);
    };
  }, [products, isDesktop]);

  const handleHotspotClick = (index) => {
    setSelectedHotspot(index);
    if (flickityRef.current && isDesktop) {
      flickityRef.current.select(index);
    }
  };

  const hotspots = [
    {
      top: '34%',
      left: '45%',
      topMobile: '39%',
      leftMobile: '50%',
      productIndex: 0,
    },
    {
      top: '57%',
      left: '38%',
      topMobile: '60%',
      leftMobile: '55%',
      productIndex: 1,
    },
    {
      top: '70%',
      left: '14%',
      topMobile: '65%',
      leftMobile: '20%',
      productIndex: 2,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[715px] bg-[#f7f7f7]">
      {/* Slider Section */}
      <div className="w-full md:w-1/2 order-2 md:order-1 min-h-[713px] h-auto relative">
        <div
          className="min-h-[713px] text-[var(--text-color-42)] flex h-full ps-[var(--outer)] pe-[var(--outer)] items-center bg-[var(--bg)]"
          style={{'--bg': '#f7f7f7'}}
        >
          <div className="w-full">
            <div className="ms-auto me-auto max-w-full text-[var(--text-color-42)] !text-center">
              <div>
                <div className="flex w-full text-center flex-col items-center [--grid-sm:16px] [--gap:var(--grid-sm)] gap-[var(--gap)] [--content-alignment-default:center]">
                  <div className="the-look-hero-kicker">
                    <p role="heading" aria-level={3}>
                      Shop the look
                    </p>
                  </div>
                </div>
              </div>
              <div
                ref={sliderRef}
                className={`carousel custom-slider-container ${
                  !isDesktop ? 'static-carousel' : ''
                }`}
                style={{minHeight: '200px'}}
              >
                {products && Array.isArray(products) ? (
                  products.map((product, index) => (
                    <div
                      key={index}
                      className="carousel-cell"
                      style={{minWidth: '350px', minHeight: '200px'}}
                    >
                      <div className="the-look-product">
                        <ProductCardQuickAdd
                          product={product}
                          productIndex={index}
                          collectionIndex={3}
                          usePrefix="the-look-collection"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No products available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hotspots Section */}
      <div className="w-full md:w-1/2 order-1 md:order-2 relative min-h-[713px]">
        <img
          src={collection?.image?.url || ''}
          alt="Look showcase"
          className="w-full h-full object-cover"
        />
        {hotspots && Array.isArray(hotspots) ? (
          hotspots.map((hotspot, index) => (
            <div key={index}>
              {typeof window !== 'undefined' && (
                <button
                  className={`products-hotspot-button ${
                    selectedHotspot === index ? 'is-selected' : ''
                  }`}
                  style={{
                    top:
                      window.innerWidth < 768 ? hotspot.topMobile : hotspot.top,
                    left:
                      window.innerWidth < 768
                        ? hotspot.leftMobile
                        : hotspot.left,
                    position: 'absolute',
                  }}
                  onClick={() => handleHotspotClick(index)}
                >
                  <span
                    className={`products-hotspot-dot ${
                      selectedHotspot === index ? 'is-selected' : ''
                    }`}
                  ></span>
                  <span
                    className={`products-hotspot-pulse ${
                      selectedHotspot === index ? 'is-selected' : ''
                    }`}
                  ></span>
                </button>
              )}
            </div>
          ))
        ) : (
          <div>No hotspots available</div>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collection: WayfarerCollectionFragment;
 * }}
 */

function WayfarerCollection({products, collection}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[715px] bg-[#f7f7f7]">
      {/* Slider Section */}
      <div className="w-full md:w-1/2 order-2 md:order-2 min-h-[713px] h-auto relative">
        <div
          className="min-h-[713px] text-[var(--text-color-42)] flex h-full ps-[var(--outer)] pe-[var(--outer)] items-center bg-[var(--bg)]"
          style={{'--bg': '#f7f7f7'}}
        >
          <div className="w-full">
            <div className="ms-auto me-auto max-w-full text-[var(--text-color-42)] !text-center">
              <div>
                <div className="flex w-full text-center flex-col items-center [--grid-sm:16px] [--gap:var(--grid-sm)] gap-[var(--gap)] [--content-alignment-default:center]">
                  <div className="the-look-hero-kicker">
                    <p role="heading" aria-level={3}>
                      Shop Wayfarer
                    </p>
                  </div>
                </div>
              </div>
              <CustomFlickitySlider
                products={products}
                options={{
                  // Keep any existing flickity options or add new ones
                  cellAlign: 'center',
                  contain: true,
                  pageDots: false,
                  prevNextButtons: true,
                  // Add any other Flickity options you need
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Image Section - Full width on mobile, half on desktop */}
      {/* Image Section with Text Overlay */}
      <div className="w-full md:w-1/2 order-1 md:order-1 relative min-h-[713px]">
        <div className="relative h-full w-full">
          <img
            src={collection?.image?.url || ''}
            alt="Wayfarer collection showcase"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center p-8">
            <div className="custom-collection-hero-text text-white">
              <div>
                <p className="custom-collection-kicker">{collection.title}</p>
                <h2 className="custom-collection-title mt-1">
                  {collection.description}
                </h2>
                <Link to="#" className="custom-collection-btn">
                  View The Lookbook
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function TopCollections ({ collections }) {
  return (
    <div 
      className="top-collections-wrapper"
      style={{
        '--PT': '36px',
        '--PB': '36px'
      }}
    >
      <div className="top-collections-container">
        <h2 className="top-collections-title mb-r11">Top collections</h2>

        <div className="top-collections-grid">
          {collections.map((collection, index) => (
            <div key={index} className="top-collections-item">
              <a 
                href={collection.handle} 
                className="top-collections-item-link"
                aria-label={collection.title}
              >
                <div className="top-collections-item-content">
                  <div>
                    <p className="top-collections-item-count">
                      {collection.metafield.value} products
                    </p>
                    <p className="top-collections-item-title">
                      {collection.title}
                    </p>
                  </div>
                  <span className="top-collections-item-btn">
                    View the collection
                  </span>
                </div>
              </a>

              <div 
                className="top-collections-item-overlay" 
                style={{
                  '--overlay-opacity': collection.overlayOpacity || 0,
                  '--overlay-bg': collection.overlayColor || '#000000'
                }}
              ></div>
              
              <div className="top-collections-item-image-container">
                <img 
                  src={collection.image.url} 
                  alt="" 
                  className="top-collections-item-image"
                  loading="lazy"
                  fetchPriority='high'
                />
              </div>
            </div>
          ))}
        </div>

        <div className="top-collections-scrollbar">
          <div className="top-collections-scrollbar-track"></div>
        </div>
      </div>
    </div>
  );
};



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
    collections(first: 250, query: "title:'boot' OR title:'Perfumes' OR title:'Veggies' OR title:'test2' OR title:'test1' OR title:'Empty collection' OR title:'mens chinos'" , sortKey: TITLE) {
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
    collections(first: 250,  query: "title:'holiday collection' OR title:'fringe collection'" , reverse:true) {
      nodes {
        ...CuratedCollection
      }
    }
  }
`;

const BEST_SELLING_PRODUCTS_QUERY = `#graphql
  fragment BestSellingProduct on Product {
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
  query BestSellingProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        ...BestSellingProduct
      }
    }
  }
`;

const THE_LOOK_COLLECTION = `#graphql
  fragment TheLookCollection on Collection {
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
    products(first: 3, sortKey: CREATED,){
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
  query TheLookCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 250,  query: "title:'The Look'" , reverse:true) {
      nodes {
        ...TheLookCollection
      }
    }
  }
`;

const WAYFARER_COLLECTION = `#graphql
  fragment WayfarerCollection on Collection {
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
    products(first: 3, sortKey: CREATED,){
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
  query WayfarerCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 250,  query: "title:'Wayfarer Collection'") {
      nodes {
        ...WayfarerCollection
      }
    }
  }
`;

const TOP_COLLECTIONS = `#graphql
  fragment TopCollections on Collection {
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
    metafield(namespace:"custom", key:"total_products_count"){
    	id
    	key
      value
    }
    products(first: 250, sortKey: CREATED,){
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
  query TopCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 250,  query: "title:'fringe collection' OR title:'holiday collection' OR title:'Wayfarer Collection' OR title:'The Look'" , reverse:true) {
      nodes {
        ...TopCollections
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').CuratedCollectionFragment} CuratedCollectionFragment */
/** @typedef {import('storefrontapi.generated').BestSellingProductsQuery} BestSellingProductsQuery */
/** @typedef {import('storefrontapi.generated').TheLookCollectionFragment} TheLookCollectionFragment */
/** @typedef {import('storefrontapi.generated').WayfarerCollectionFragment} WayfarerCollectionFragment */
/** @typedef {import('storefrontapi.generated').TopCollectionsFragment} TopCollectionsFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

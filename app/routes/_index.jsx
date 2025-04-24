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
      <CuratedCollection />
      <CuratedCollectionSplit collection={data.curatedCollection} />
      {/* <BestSellingProducts products={data.bestSellingProducts} /> */}
      <BestSellers products={data.bestSellingProducts} />
      {console.log(data.bestSellingProducts, 'best selling products')}
      <HotspotSection/>
      <ProductHotspot/>

      <div> hey </div>
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
function BestSellingProducts({products}) {
  {
    console.log(products, 'best selling products');
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

import React from 'react';

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

  // Create a ref for each collection's container and track
  const collectionRefs = useRef(collection.map(() => ({
    containerRef: React.createRef(),
    trackRef: React.createRef(),
    isDragging: false,
    startPosition: 0
  })));

  // Track width and position state for each collection
  const [scrollStates, setScrollStates] = useState(
    collection.map(() => ({ trackWidth: 40, position: 0 }))
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
        const newPosition = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - newTrackWidth) : 0;
        
        setScrollStates(prevStates => {
          const newStates = [...prevStates];
          newStates[index] = { trackWidth: newTrackWidth, position: newPosition };
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
        if (!collectionRef.isDragging || !collectionRef.containerRef.current) return;

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
                          <div className="custom-product-card" key={productIndex}>
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
                    <div className="custom-horizontal-scrollbar " data-custom-horizontal-scrollbar="">
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


function HotspotSection () {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sliderRef = useRef(null);
  const flickityRef = useRef(null);

  // Product data
  const products = [
    {
      id: 1,
      title: "The Cei Sueded Ribbon Top",
      price: "£304.00",
      color: "Taos Taupe",
      images: [
        GirlImage1,
        GirlImage1Portrait,
        GirlImage1Landscape
      ],
      variants: [
        { size: "XS", id: "xs1" },
        { size: "S", id: "s1" },
        { size: "M", id: "m1" },
        { size: "L", id: "l1" }
      ],
      hotspotPosition: { top: "34%", left: "45%", mobileTop: "39%", mobileLeft: "50%" }
    },
    {
      id: 2,
      title: "The Adel Pant",
      price: "£281.00",
      color: "Latte Melange",
      images: [
        GirlImage1,
        GirlImage1Portrait,
        GirlImage1Landscape
      ],
      variants: [
        { size: "XS", id: "xs2" },
        { size: "S", id: "s2" },
        { size: "M", id: "m2" },
        { size: "L", id: "l2" }
      ],
      hotspotPosition: { top: "57%", left: "38%", mobileTop: "60%", mobileLeft: "55%" }
    },
    {
      id: 3,
      title: "The Marfa Suede Ankle Boot",
      price: "£381.00",
      color: "Antler",
      images: [
        GirlImage1,
        GirlImage1Portrait,
        GirlImage1Landscape
      ],
      variants: [
        { size: "6", id: "6" },
        { size: "7", id: "7" },
        { size: "8", id: "8" },
        { size: "9", id: "9" }
      ],
      hotspotPosition: { top: "70%", left: "14%", mobileTop: "65%", mobileLeft: "20%" }
    }
  ];

  // Initialize Flickity slider (you'll need to install flickity package)
  useEffect(() => {
    let flickityInstance;
  
    const loadFlickity = async () => {
      const Flickity = (await import('flickity')).default;
      flickityRef.current = new Flickity(sliderRef.current, {
        cellAlign: 'left',
        contain: true,
        pageDots: true,
        prevNextButtons: true,
        selectedAttraction: 0.03,
        friction: 0.15,
        wrapAround: false
      });
  
      flickityRef.current.on('select', () => {
        setSelectedIndex(flickityRef.current.selectedIndex);
      });
  
      flickityInstance = flickityRef.current;
    };
  
    loadFlickity();
  
    return () => {
      if (flickityInstance) {
        flickityInstance.destroy();
      }
    };
  }, []);
  

  // Handle hotspot click
  const handleHotspotClick = (index) => {
    setSelectedIndex(index);
    if (flickityRef.current) {
      flickityRef.current.select(index);
    }
  };

  return (
    <div className="hotspot-section">
      <div className="section-header">
        <h3 className="section-kicker">Shop the look</h3>
      </div>

      <div className="hotspot-container">
        {/* Product Slider */}
        <div className="product-slider-container">
          <div className="product-slider" ref={sliderRef}>
            {products.map((product, index) => (
              <div key={product.id} className="product-slide">
                <ProductCard 
                  product={product} 
                  isSelected={selectedIndex === index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hotspot Image */}
        <div className="hotspot-image-container">
          <div className="hotspot-image-wrapper">
            <img
              src={HotspotGirlImg}
              alt="Shop the look"
              className="hotspot-image"
            />
            
            {/* Hotspots */}
            {products.map((product, index) => (
              <button
                key={product.id}
                className={`hotspot-dot ${selectedIndex === index ? 'active' : ''}`}
                style={{
                  top: product.hotspotPosition.top,
                  left: product.hotspotPosition.left,
                  '--mobile-top': product.hotspotPosition.mobileTop,
                  '--mobile-left': product.hotspotPosition.mobileLeft
                }}
                onClick={() => handleHotspotClick(index)}
                aria-label={`View ${product.title}`}
              >
                <span className="hotspot-inner"></span>
                <span className="hotspot-pulse"></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, isSelected }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  return (
    <div className={`product-card ${isSelected ? 'selected' : ''}`}>
      <div className="product-image-container">
        <div className="product-image-wrapper">
          <img
            src={product.images[currentImageIndex]}
            alt={product.title}
            className="product-image"
          />
        </div>
        <div className="product-pagination">
          {product.images.map((_, index) => (
            <span 
              key={index} 
              className={`pagination-dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <div className="product-price-container">
          <span className="product-color">{product.color}</span>
          <span className="product-price">{product.price}</span>
        </div>
        
        <div className="quick-add-toolbar">
          {product.variants.map(variant => (
            <button key={variant.id} className="quick-add-button">
              {variant.size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};



const products = [
  {
    id: 1,
    title: "The Cei Sueded Ribbon Top",
    color: "Taos Taupe",
    price: "£304.00",
    sizes: ["XS", "S", "M", "L"],
    images: [
      "//pipeline-theme-fashion.myshopify.com/cdn/shop/products/DEL-2_DEL-2__CEI-SUEDED-RIBBON-TOP_IGD3580_TAOS-TAUPE_2.jpg?v=1639856588&width=1000",
      "//pipeline-theme-fashion.myshopify.com/cdn/shop/products/DEL-2_DEL-2__CEI-SUEDED-RIBBON-TOP_IGD3580_TAOS-TAUPE_3.jpg?v=1639856588&width=1000",
    ],
    hotspot: { top: "34%", left: "45%", topMobile: "39%", leftMobile: "50%" },
  },
  {
    id: 2,
    title: "The Adel Pant",
    color: "Latte Melange",
    price: "£281.00",
    sizes: ["XS", "S", "M", "L"],
    images: [
      "//pipeline-theme-fashion.myshopify.com/cdn/shop/products/Del.-2-_Adel-Pant-_RWS3684_Latte-Melange_3.jpg?v=1639856111&width=1000",
      "//pipeline-theme-fashion.myshopify.com/cdn/shop/products/Del.-2-_Adel-Pant-_RWS3684_Latte-Melange_4.jpg?v=1639856111&width=1000",
    ],
    hotspot: { top: "57%", left: "38%", topMobile: "60%", leftMobile: "55%" },
  },
  {
    id: 3,
    title: "The Marfa Suede Ankle Boot",
    color: "Antler",
    price: "£381.00",
    sizes: ["6", "7", "8", "9", "10"],
    images: [
      "//pipeline-theme-fashion.myshopify.com/cdn/shop/products/MarfaSuedeAnkleBoot_CHAU001_Antler_1.jpg?v=1639855989&width=1000",
      "//pipeline-theme-fashion.myshopify.com/cdn/shop/products/MarfaSuedeAnkleBoot_CHAU001_Antler_2.jpg?v=1639855989&width=1000",
    ],
    hotspot: { top: "70%", left: "14%", topMobile: "65%", leftMobile: "20%" },
  },
];

function ProductHotspot () {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState(products.map(() => 0));

  const handleHotspotClick = (index) => {
    setSelectedProductIndex(index);
  };

  const handlePrev = () => {
    setSelectedProductIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedProductIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const handleImageChange = (productIndex, imageIndex) => {
    setCurrentImages((prev) => {
      const newImages = [...prev];
      newImages[productIndex] = imageIndex;
      return newImages;
    });
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-[715px]">
      {/* Product Slider Section */}
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 min-h-[713px]">
          <h3 className="text-center text-lg font-semibold mb-4">Shop the look</h3>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${selectedProductIndex * 100}%)` }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="min-w-full flex-shrink-0 p-4"
                >
                  <div className="text-center">
                    <div className="relative aspect-[0.9] mb-4">
                      <img
                        src={product.images[currentImages[index]]}
                        alt={product.title}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {product.images.map((_, imgIndex) => (
                          <button
                            key={imgIndex}
                            className={`w-2 h-2 rounded-full ${
                              currentImages[index] === imgIndex ? 'bg-black' : 'bg-gray-400'
                            }`}
                            onClick={() => handleImageChange(index, imgIndex)}
                            aria-label={`View image ${imgIndex + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    <a
                      href={`/products/${product.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-lg font-medium hover:underline"
                      id={`product-${product.id}`}
                    >
                      {product.title}
                    </a>
                    <p className="text-gray-600">{product.color}</p>
                    <p className="text-xl font-bold">{product.price}</p>
                    <div className="mt-4">
                      <button
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                        onClick={() => alert('Quick add opened')}
                        aria-label="Quick add"
                      >
                        Quick Add
                      </button>
                      <div className="mt-2 flex justify-center space-x-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            className="px-3 py-1 border rounded hover:bg-gray-100 transition"
                            onClick={() => alert(`Added ${size} to cart`)}
                            aria-label={`Add ${size} to cart`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-r disabled:opacity-50"
              onClick={handlePrev}
              disabled={selectedProductIndex === 0}
              aria-label="Previous product"
            >
              <svg className="w-6 h-6" viewBox="0 0 100 100">
                <path d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z" />
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-l disabled:opacity-50"
              onClick={handleNext}
              disabled={selectedProductIndex === products.length - 1}
              aria-label="Next product"
            >
              <svg className="w-6 h-6" viewBox="0 0 100 100">
                <path
                  d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
                  transform="translate(100, 100) rotate(180)"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  selectedProductIndex === index ? 'bg-black' : 'bg-gray-400'
                }`}
                onClick={() => setSelectedProductIndex(index)}
                aria-label={`View product ${index + 1}`}
                aria-current={selectedProductIndex === index ? 'step' : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hotspot Image Section */}
      
      <div className="w-full md:w-1/2 relative min-h-[713px]">
        <img
          src={HotspotGirlImg}
          alt="Look showcase"
          className="w-full h-full object-cover"
        />
        {products.map((product, index) => (
          <button
            key={product.id}
            className={` products-hotspot-button ${selectedProductIndex === index ? 'is-selected' : ''}`}
            style={{
              top: window.innerWidth < 768 ? product.hotspot.topMobile : product.hotspot.top,
              left: window.innerWidth < 768 ? product.hotspot.leftMobile : product.hotspot.left,
            }}
            onClick={() => handleHotspotClick(index)}
            aria-label={`Hotspot for ${product.title}`}
            aria-labelledby={`product-${product.id}`}
          >
            <span className={`products-hotspot-dot ${selectedProductIndex === index ? 'is-selected' : ''} `}></span>
            <span className={`products-hotspot-pulse ${selectedProductIndex === index ? 'is-selected' : ''}`}></span>
          </button> 
        ))}
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
    collections(first: 100,  query: "title:'holiday collection' OR title:'fringe collection'" , reverse:true) {
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

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').CuratedCollectionFragment} CuratedCollectionFragment */
/** @typedef {import('storefrontapi.generated').BestSellingProductsQuery} BestSellingProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

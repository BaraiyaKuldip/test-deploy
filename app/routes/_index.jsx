import React, {useState, useRef, useEffect} from 'react';
import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import HeroSectionImage from '/images/home-section-hero-img.jpg?url';
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

import FeatureSectionBottom from '~/components/FeatureSectionBottom';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {Settings} from 'lucide-react';
import CustomSlickSlider from '~/components/CustomProductSliderSlick';

import CustomSwiperSlider from '~/components/CustomProductSliderSwiper';
import CustomSwiperSlider147 from '~/components/CustomSwiper';

// import CustomFlickitySlider from '~/components/CustomFlickitySlider';

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
    heroImageHome
  ] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(CURATED_COLLECTION_QUERY),
    context.storefront.query(THE_LOOK_COLLECTION),
    context.storefront.query(WAYFARER_COLLECTION),
    context.storefront.query(TOP_COLLECTIONS),
    context.storefront.query(HERO_IMAGE_HOME_QUERY),
  ]);

  return {
    featuredCollection: featuredResults.collections.nodes,
    curatedCollection: curatedResults.collections.nodes,
    TheLookCollection: theLookCollectionResults.collections.nodes,
    WayfarerCollection: wayfarerCollectionResults.collections.nodes,
    TopCollections: topCollectionsResults.collections.nodes,
    heroImageHome: heroImageHome.node
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
      console.error('Best selling products query error:', error);
      return null;
    });

  // const heroImageHome = context.storefront
  //   .query(HERO_IMAGE_HOME_QUERY)
  //   .catch((error) => {
  //     console.error('Hero image home query error:', error);
  //     return { node: null }; // Maintain consistent structure even on error
  //   });

  return {
    bestSellingProducts,
    // heroImageHome,
  };
}


export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  {
    // console.log(data, 'data');
  }
  return (
    <div className="home">
    
      <HeroSectionHome heroImageHome={data.heroImageHome}/>
      <FeaturedCollection collection={data.featuredCollection} />
      {/* {console.log(data.featuredCollection, "data.featuredCollection")} */}
      <CuratedCollection collection={data.curatedCollection} />
      {/* <BestSellingProducts products={data.bestSellingProducts} /> */}
      <BestSellers products={data.bestSellingProducts} />
      {/* {console.log(data.bestSellingProducts, 'best selling products')} */}
      <TheLookCollection
        products={data.TheLookCollection[0].products.nodes}
        collection={data.TheLookCollection[0]}
      />
      {/* {console.log(data.TheLookCollection[0], 'collectionnn')} */}
      <WayfarerCollection
        products={data.WayfarerCollection[0].products.nodes}
        collection={data.WayfarerCollection[0]}
      />

      <TopCollections collections={data.TopCollections} />
      <NewsletterComponent />
      <FeatureSectionBottom />

      {/* {console.log(data.TopCollections, 'top collections')} */}
      <div> Lorem </div>
    </div>
  );
}

function HeroSectionHome({heroImageHome}) {
  

  // console.log(HeroSectionImage ,"heroo image data")


  const dta = (
    <div
      style={{backgroundImage: `url(${HeroSectionImage})`}}
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
  );

  const imgData = `https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766`;

  return (
    <>
      <div
        className="film_section_home_image  jjs"
        style={{'--PT': '0px', '--PB': '0px', '--section_width': '600px', 'min-height': 'calc(397px + var(--header_top_height))','zIndex' : '1'}}
      >
        <div className="fixed_wrapper fixed_y_padding">
          <div className="film_section_home_inner">
            <div className="film_section_content_wrapper text_align_justify_center">
              <div className="film_section_content film_section_home_content_transparent jjs">
                <div
                  className="common_text_use text_style_white film_section_home_backdrop"
                  style={{'--bg': '#000000', '--opacity': '0.1'}}
                >
                  <div className="film_brand_text_1 common_size_four ">
                    <p>A Conscious Wardrobe</p>
                  </div>
                  <div className="film_section_title common_heading_size_ten">
                    <p>Timeless Style Sustainable Design</p>
                  </div>
                  <div className="film_cta_wrapper">
                    <Link
                      className="common_cta film_button b_t_n uppercase button_style_white button_style_long"
                      to="collections/all"
                    >
                      View products
                    </Link>
                    <Link
                      className="common_cta film_button button_text_thick_line button_style_neutral button_style_long"
                      to="pages/about"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="image_film_frame aspect-[var(--pc_ratio_mobile)] md:aspect-[var(--pc_ratio)] screen_3_quarters " style={{'minHeight': 'calc(397px + var(--header_top_height)'}}>
              <div className="image_film_pane">
                <div
                  className="image_film_scale h-[var(--pc_height_mobile)] md:h-[var(--pc_height)]"
                  style={{
                    '--pc_height': '66.65714285714284vw',
                    '--pc_height_mobile': '129.39545202440377vw',
                  }}
                >
                  <picture
                    className="relative block w-full h-full overflow-hidden aspect-[var(--pc_ratio)]"
                    style={{
                      '--pc_ratio': '1.5002143163309045',
                      '--asp_ratio_mobile': '1.5002143163309045',
                    }}
                  >
                    <source
                      media="(min-width: 768px)"
                      sizes="100vw"
                      srcSet="
 https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=352 352w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=400 400w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=768 768w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=932 932w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=1024 1024w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=1200 1200w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=1920 1920w, 
  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=3500 3500w"
                    />
                    <source
                      media="(max-width: 768px)"
                      sizes="100vw"
                      srcSet="
 https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img-mobile.webp?v=1746703826&width=352 352w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img-mobile.webp?v=1746703826&width=400 400w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img-mobile.webp?v=1746703826&width=768 768w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img-mobile.webp?v=1746703826&width=932 932w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img-mobile.webp?v=1746703826&width=1024 1024w,  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img-mobile.webp?v=1746703826&width=1200 1200w, 
  https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img-mobile.webp?v=1746703826&width=1803 1803w"
                    />
                    <img
                      src={heroImageHome.image.url}
                      alt='Hero Image'
                      width={2000}
                      height={1333}
                      loading="eager"
                      className="block overflow-hidden w-full h-full object-cover  position_bg_mobile"
                      srcSet={`https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=352 352w, 
                        https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=400 400w, 
                        https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=768 768w, 
                        https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=932 932w, 
                        https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=1024 1024w, 
                        https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=1200 1200w, 
                        https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=1920 1920w, 
                        https://cdn.shopify.com/s/files/1/0668/9144/8501/files/home-section-hero-img.webp?v=1746702766&width=3500 3500w`}
                        
                      sizes="100vw"
                      fetchpriority="high"
                      style={{
                        'object-position': 'var(--main_point, center)',
                        '--obj_position_mobile': '49.1073% 0.0651%',
                        '--obj_position_pc': '62.7913% 0.0%',
                      }}
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
    // console.log(collection, 'collection data');
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
      // console.log(emblaApi.slideNodes(), 'embla'); // Access API
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
                  {/* {console.log(response, 'response')} */}
                  {response
                    ? response.products.nodes.map((product, productIndex) => (
                        <>
                          {/* {console.log(products, 'best selling products')} */}
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
  // console.log(collection, 'curated collection data');

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
      <div className="custom-collection overflow-hidden">
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
                            <div className="custom-collection-image-wrapper relative block w-full h-full overflow-hidden aspect-[--pc_ratio]">
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

  const [selectedHotspot, setSelectedHotspot] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );

  // Drag scroll state
  // We no longer need these state variables as we'll use local variables instead
  // for better performance

  const sliderRef = useRef(null);
  const productRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add drag scroll functionality for mobile view - optimized version
  useEffect(() => {
    // Only apply drag scroll on mobile view
    if (isDesktop || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    // Prevent text selection during drag
    const preventDefault = (e) => {
      e.preventDefault();
      return false;
    };

    const handleMouseDown = (e) => {
      isDown = true;
      // Add no-select class to prevent text selection during drag
      scrollContainer.classList.add('no-select');
      scrollContainer.style.cursor = 'grabbing';
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      // Prevent default behavior to avoid text selection
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // Increased for smoother feel
      requestAnimationFrame(() => {
        scrollContainer.scrollLeft = scrollLeft - walk;
      });
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.classList.remove('no-select');
      scrollContainer.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
      if (isDown) {
        isDown = false;
        scrollContainer.classList.remove('no-select');
        scrollContainer.style.cursor = 'grab';
      }
    };

    // Touch events for mobile - optimized
    const handleTouchStart = (e) => {
      isDown = true;
      scrollContainer.classList.add('no-select');
      startX = e.touches[0].pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      // Don't prevent default completely as it breaks scrolling on some devices
    };

    const handleTouchMove = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      requestAnimationFrame(() => {
        scrollContainer.scrollLeft = scrollLeft - walk;
      });
    };

    const handleTouchEnd = () => {
      isDown = false;
      scrollContainer.classList.remove('no-select');
    };

    // Add listeners for selection prevention during drag
    scrollContainer.addEventListener('dragstart', preventDefault);
    scrollContainer.addEventListener('selectstart', preventDefault);

    // Add event listeners
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchmove', handleTouchMove);
    scrollContainer.addEventListener('touchend', handleTouchEnd);

    // Add user-select: none CSS to the container in JavaScript
    const originalUserSelect = scrollContainer.style.userSelect;
    const originalWebkitUserSelect = scrollContainer.style.webkitUserSelect;
    const originalMsUserSelect = scrollContainer.style.msUserSelect;

    scrollContainer.style.userSelect = 'none';
    scrollContainer.style.webkitUserSelect = 'none';
    scrollContainer.style.msUserSelect = 'none';

    // Clean up event listeners
    return () => {
      scrollContainer.removeEventListener('dragstart', preventDefault);
      scrollContainer.removeEventListener('selectstart', preventDefault);
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);

      // Restore original user-select values
      scrollContainer.style.userSelect = originalUserSelect;
      scrollContainer.style.webkitUserSelect = originalWebkitUserSelect;
      scrollContainer.style.msUserSelect = originalMsUserSelect;
    };
  }, [isDesktop]);

  const handleHotspotClick = (index) => {
    setSelectedHotspot(index);
    if (isDesktop && sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    } else if (productRefs.current[index]) {
      productRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  };

  const CustomNextArrow = ({className, style, onClick}) => (
    <button
      className={`${className} custom-slick-arrow custom-slick-next hidden md:block`}
      style={{...style}}
      onClick={onClick}
      type="button"
    >
      <svg className="slick-slider-button-icon" viewBox="0 0 100 100">
        <title>Next</title>
        <path
          d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
          className="arrow"
          transform="translate(100, 100) rotate(180)"
        />
      </svg>
    </button>
  );

  const CustomPrevArrow = ({className, style, onClick}) => (
    <button
      className={`${className} custom-slick-arrow custom-slick-prev hidden md:block`}
      style={{...style}}
      onClick={onClick}
      type="button"
    >
      <svg className="slick-slider-button-icon" viewBox="0 0 100 100">
        <title>Previous</title>
        <path
          d="M 10, 50 L 60, 100 L 67.5, 92.5 L 25, 50 L 67.5, 7.5 L 60, 0 Z"
          className="arrow"
        />
      </svg>
    </button>
  );

  const slickSettings = {
    dots: isDesktop,
    infinite: false,
    swipeToSlide: true,
    touchMove: true,
    draggable: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    arrows: isDesktop,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    focusOnSelect: true,
    beforeChange: (current, next) => setSelectedHotspot(next),
    afterChange: (index) => setSelectedHotspot(index),
    responsive: [
      {
        breakpoint: 768,
        settings: 'unslick',
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[715px] bg-[#f7f7f7]">
      {/* Product/Slider Section */}
      <div className="w-full md:w-1/2 order-2 md:order-1 min-h-[713px] h-auto relative">
        <div className="min-h-[713px] text-[#333] flex h-full px-4 items-center bg-[#f7f7f7]">
          <div className="w-full">
            <div className="mx-auto max-w-full text-center">
              <div className="flex w-full text-center flex-col items-center gap-4">
                <div className="the-look-hero-kicker">
                  <p role="heading" aria-level={3}>
                    Shop the look
                  </p>
                </div>
              </div>

              <div className="custom-slider-container slick-slick-slick">
                {products && Array.isArray(products) ? (
                  isDesktop ? (
                    <Slider ref={sliderRef} {...slickSettings}>
                      {products.map((product, index) => (
                        <div
                          key={index}
                          className="the-look-product"
                          style={{width: '350px'}}
                        >
                          <ProductCardQuickAdd
                            product={product}
                            productIndex={index}
                            collectionIndex={3}
                            usePrefix="the-look-collection"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div
                      ref={scrollContainerRef}
                      className="slider-mobile-container flex overflow-x-auto scroll-smooth snap-x px-2 cursor-grab"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                      }} // Hide scrollbar and prevent text selection
                    >
                      {products.map((product, index) => (
                        <div
                          key={index}
                          ref={(el) => (productRefs.current[index] = el)}
                          className={`the-look-product min-w-[300px] snap-center `}
                        >
                          <ProductCardQuickAdd
                            product={product}
                            productIndex={index}
                            collectionIndex={3}
                            usePrefix="the-look-collection"
                          />
                        </div>
                      ))}
                    </div>
                  )
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
          src={collection?.image?.url || '/api/placeholder/400/320'}
          alt="Look showcase"
          className="w-full h-full object-cover"
        />
        {hotspots.map((hotspot, index) => (
          <div key={index}>
            <button
              className={`products-hotspot-button ${
                selectedHotspot === index ? 'is-selected' : ''
              }`}
              style={{
                top: isDesktop ? hotspot.top : hotspot.topMobile,
                left: isDesktop ? hotspot.left : hotspot.leftMobile,
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
          </div>
        ))}
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
  const [selectedHotspot, setSelectedHotspot] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );
  const sliderRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const productRefs = useRef([]);

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

              {/* <CustomSwiperSlider products={products}/> */}
              <CustomSwiperSlider147 products={products} />
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

function TopCollections({collections}) {
  return (
    <div
      className="top-collections-wrapper"
      style={{
        '--PT': '36px',
        '--PB': '36px',
        '--aspect-ratio': '66.66666666666666%',
      }}
    >
      <div className="top-collections-container overflow-hidden fixed_padding_page">
        <h2 className="top-collections-title mb-r11">Top collections</h2>

        <div
          className="top-collections-grid"
          style={{
            '--grid-large-items': '2',
            '--grid-medium-items': '2',
            '--grid-small-items': '1.5',
          }}
        >
          {collections.map((collection, index) => (
            <div key={index} className="top-collections-item">
              <div className="top-collections-item-inner white--text">
                <Link
                  to={`/collections/${collection.handle}`}
                  className="top-collections-item-link"
                  aria-label={collection.title}
                >
                  <div className="top-collections-item-content">
                    <p className="top-collections-item-count">
                      {collection.metafield.value} products
                    </p>
                    <p className="top-collections-item-title">
                      {collection.title}
                    </p>

                    <span className="top-collections-item-btn">
                      View the collection
                    </span>
                  </div>
                </Link>

                <div
                  className="top-collections-item-overlay"
                  style={{
                    '--overlay-opacity': collection.overlayOpacity || 0.1,
                    '--overlay-bg': collection.overlayColor || '#000000',
                  }}
                ></div>

                <div className="top-collections-item-image-frame fade-in-child aspect-[--pc_ratio_mobile] md:aspect-[--pc_ratio] none">
                  <div className="top-collections-item-image-pane">
                    <div
                      className="top-collections-item-image-scale h-[--pc_height_mobile] md:h-[--pc_height]"
                      style={{
                        '--pc_height': '66.66666666666666vw',
                        '--pc_height_mobile': '66.66666666666666vw',
                      }}
                    >
                      <div
                        className="top-collections-item-image-container relative block w-full h-full overflow-hidden aspect-[--pc_ratio]"
                        style={{'--pc_ratio': '1.5'}}
                      >
                        <img
                          src={collection.image.url}
                          alt={collection.image.altText || collection.title}
                          className="top-collections-item-image"
                          loading="lazy"
                          fetchPriority="auto"
                          sizes="100vw"
                          style={{objectPosition: 'center center'}}
                          srcSet={`
                            ${collection.image.url}&width=${352} ${352}w,
                            ${collection.image.url}&width=${400} ${400}w,
                            ${collection.image.url}&width=${768} ${768}w,
                            ${collection.image.url}&width=${932} ${932}w,
                            ${collection.image.url}&width=${1024} ${1024}w,
                            ${collection.image.url}&width=${1200} ${1200}w,
                            ${collection.image.url}&width=${1920} ${1920}w,
                            ${collection.image.url}&width=${3000} ${3000}w,
                            `}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
}

function NewsletterComponent() {
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   alert('Subscribed successfully!');
  // };

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically validate or send the email to your backend
    // For demonstration, we'll simulate an existing subscription
    if (email === 'existing@example.com') {
      setIsSubscribed(true);
    }
  };

  return (
    <div
      className="newsletter-wrapper"
      style={{'--PT': '60px', '--PB': '22px', '--BRICK-GUTTER': '0px'}}
    >
      <div className="newsletter-section" style={{minHeight: '255px'}}>
        <div className="newsletter-block">
          <div
            className="newsletter-text-block"
            style={{'--bg': '#fffffff', minHeight: '253px'}}
          >
            <div className="newsletter-text-block-inner">
              <div className="newsletter-content">
                <h2 className="newsletter-heading">Always In The Know</h2>
                <p className="newsletter-description">
                  Join our newsletter to get special offers, free giveaways, and
                  once-in-a-lifetime deals.
                </p>
                <div className="newsletter-input-holder">
                  <form className="newsletter-form" onSubmit={handleSubmit}>
                    {/* Hidden fields for form processing */}
                    <input type="hidden" name="form_type" value="customer" />
                    <input
                      type="hidden"
                      name="contact[tags]"
                      value="newsletter"
                    />
                    <input
                      type="hidden"
                      name="contact[accepts_marketing]"
                      value="true"
                    />

                    {/* Error message for existing subscriptions */}
                    {isSubmitted && isSubscribed && (
                      <p className="newsletter-form__error-message">
                        This email is already subscribed
                      </p>
                    )}

                    {/* Success message could be added here */}
                    {isSubmitted && !isSubscribed && (
                      <p className="newsletter-form__success-message">
                        <em>Thank you for joining our mailing list!</em>
                      </p>
                    )}

                    <div className="newsletter-form__input-group">
                      <label
                        htmlFor="newsletter-email-input"
                        className="newsletter-form__label"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="newsletter-form__input"
                        id="newsletter-email-input"
                        placeholder="your-email@example.com"
                        aria-label="Enter your email to subscribe"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <span className="newsletter-button-wrapper">
                        <button
                          type="submit"
                          className="newsletter-form__button"
                          aria-label="Subscribe to newsletter"
                        >
                          Join
                        </button>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



const HERO_IMAGE_HOME_QUERY = `#graphql
    query HeroImageHome {
      node(id: "gid://shopify/MediaImage/32214693216437") {
        ... on MediaImage {
          id
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
`;

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

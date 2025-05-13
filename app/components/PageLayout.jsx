import {Await, Link, Navigate, useNavigate} from '@remix-run/react';
import {Suspense, useId, useEffect, useState} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import GirlImage from '/images/girl-1134567_1280.jpg?url';
import GirlImage1Portrait from '/images/GirlImage1Portrait.png?url';
// import GirlImage1Portrait from '/images/white-london-having-womans-female-new.jpg?url';
// import GirlImage1Landscape from '/images/york-work-portrait-london-outdoors-person.jpg?url';
import GirlImage1Landscape from '/images/GirlImage1Landscape.png?url';

// srolling logo images
import LouisVittonLogo from '/images/louis-vuitton-logo.png?url';
import RolexLogo from '/images/rolex-logo.png?url';
import PradaLogo from '/images/prada-logo.png?url';
import GucciLogo from '/images/gucci-logo.png?url';
import CalvinKleinLogo from '/images/calvin-klein-logo.png?url';

import {use} from 'react';
import {ChevronRight, X} from 'lucide-react';
import {useAside} from '~/components/Aside';
import {validate} from 'graphql';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  footer,
  footerSubMenu,
  header,
  isLoggedIn,
  publicStoreDomain,
  headerMenuCollectionsList,
  collectionsListHeader,
}) {
  const [current_height, setCurrent_height] = useState(0);
  const [current_width, setCurrent_width] = useState(0);
  const [divBgImage, setDivBgImage] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access the document object here

      setCurrent_height(document.documentElement.clientHeight);
      setCurrent_width(document.documentElement.clientWidth);
      if (document.documentElement.clientWidth > 768) {
        setDivBgImage(GirlImage1Landscape);
      } else {
        setDivBgImage(GirlImage1Portrait);
      }

      let currentLocation = window.location;
      // console.log(currentLocation.pathname , "cc");

      if (currentLocation.pathname === '/') {
        document.documentElement.style.setProperty('--text-color', '#fff');
        document.documentElement.style.setProperty(
          '--toolbar-top-bg',
          'transparent',
        );

        document.querySelector('.logo-container').style.display = 'block';
        document.querySelector('.main_header_top').style.borderBottomColor =
          'transparent';
      } else {
        document.querySelector('.logo-container').style.display = 'none';
        document.querySelector('.main_header_top').style.borderBottomColor =
          '#f7f5f4';

        document.documentElement.style.setProperty('--text-color', '#000');
        document.documentElement.style.setProperty(
          '--toolbar-top-bg',
          '#f7f5f4',
        );
      }
    }
  });

if (typeof window !== 'undefined') {
    const [screenSize, setScreenSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      document.documentElement.style.setProperty(
        '--c-screen-height',
        `${screenSize.height - 94}px`,
      );
    }, [screenSize]);
}

  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
          headerMenuCollectionsList={headerMenuCollectionsList}
          collectionsListHeader={collectionsListHeader}
        />
      )}
      <main>
        <span
          className={`z-1 hidden transition-opacity duration-300 ease-in fixed top-0 left-0 h-full w-full`}
        >
          <span className="bg-white opacity-60 transition-all duration-300 ease-in block absolute top-0 left-0 h-full w-full pointer-events-none "></span>
          <span className="backdrop-blur-md transition-all block absolute top-0 left-0 h-full w-full pointer-events-none "></span>
        </span>

        {/* <div
          style={{backgroundImage: `url(${divBgImage})`}}
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
        </div> */}

        <div className="">{children}</div>

        {/* scrolling logos */}

        <div className="logo-container">
          <div className="logo-scroll">
            <div className="logo-scroll__wrapper">
              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />
            </div>

            <div className="logo-scroll__wrapper">
              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />
            </div>

            <div className="logo-scroll__wrapper">
              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />

              <img className="logo-item" src={GucciLogo} alt="Gucci Logo" />
              <img className="logo-item" src={PradaLogo} alt="Prada Logo" />
            </div>
          </div>
        </div>
      </main>
      <Footer
        footer={footer}
        footerSubMenu={footerSubMenu}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

/**
 * @param {{cart: PageLayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

/**
 * @param {{filter: PageLayoutProps['filter']}}
 */
function FilterAside({filter}) {
  return (
    <Aside type="filter" heading="FILTER">
      <Suspense fallback={<p>Loading cart ...</p>}>
        {/* <Await resolve={filter}>
          {(filter) => {
            // return <layout="aside" />;
          }}
        </Await> */}
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const navigate = useNavigate();
  const queriesDatalistId = useId();
  const {type: activeType, close} = useAside();
  // console.log(activeType , "cccc")

  useEffect(() => {
    if (activeType === 'search') {
      document.getElementById('search-input').focus();
    }
  }, [activeType]);

  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search fixed_padding_page">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                autoFocus={true}
                name="q"
                id="search-input"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                enterKeyHint="search"
                onKeyPress={function (e) {
                  if (
                    e.code === 'Enter' &&
                    inputRef.current.value.length === 0
                  ) {
                    e.preventDefault();
                  }
                  if (inputRef.current.value.length > 0) {
                    if (e.code === 'Enter') {
                      // goToSearch
                      // <Link to={"/search"}></Link>
                      // navigate(`/search`);
                      goToSearch();
                    }
                  }
                }}
              />
              &nbsp;
              {/* <button onClick={goToSearch}>Search</button> */}
              {/* {console.log(inputRef.current , "saa")} */}
              {inputRef.current !== null &&
                inputRef.current.value.length > 0 && (
                  // console.log(inputRef.current.value , "saa")
                  <div>
                    <button
                      className="clear-btn-search"
                      type="reset"
                      aria-label="Reset"
                    >
                      Clear
                    </button>
                  </div>
                )}
              <div className="text-left w-22.5 h-full ">
                <button
                  className="close  reset"
                  onClick={close}
                  aria-label="Close"
                >
                  <X className="close_menu_icon " />
                </button>
              </div>
            </>
          )}
        </SearchFormPredictive>
      </div>

      <SearchResultsPredictive>
        {({items, total, term, state, closeSearch, goToSearch}) => {
          const {articles, collections, pages, products, queries} = items;

          // console.log(items, 'itemss');
          // if (state === 'loading' && term.current) {
          //   return <div className='bg-white text-center'>Loading...</div>;
          // }

          if (!total) {
            return (
              <>
                {/* {term.current.length > 0 && ( */}
                <SearchResultsPredictive.Empty
                  term={term}
                  closeSearch={closeSearch}
                  goToSearch={goToSearch}
                />
                {/* )} */}
              </>
            );
          }

          return (
            <>
              <div
                id="predictive-search-result-main-div"
                className={`fixed_padding_page predictive-search-result-main-div ${
                  term.current.length > 0 ? 'oppen' : 'closee'
                } bg-white h-screen`}
              >
                <div
                  className={`predictive-search-result-wrapper ${
                    term.current.length > 0
                      ? 'predictive-search-result-open'
                      : ''
                  }`}
                >
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                    closeSearch={closeSearch}
                    goToSearch={goToSearch}
                  />
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total ? (
                    <div className="pb-7.5">
                      <button
                        className="predictive-search-go-btn"
                        onClick={goToSearch}
                      >
                        <div className="flex items-center justify-between">
                          <span>search for &ldquo;{term.current}&rdquo;</span>
                          <span className="ml-1">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          );
        }}
      </SearchResultsPredictive>
    </Aside>
  );
}

/**
 * @param {{
 *   header: PageLayoutProps['header'];
 *   publicStoreDomain: PageLayoutProps['publicStoreDomain'];
 * }}
 */
function MobileMenuAside({header, publicStoreDomain}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<FooterQuery|null>} footer
 * @property {Promise<FooterSubMenuQuery|null>} footerSubMenu
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').FooterSubMenuQuery} FooterSubMenuQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */

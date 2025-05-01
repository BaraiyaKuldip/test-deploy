import {Suspense, useEffect, useId, useState} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {TopSide, useTopSide} from './topside';
import {ChevronRight, Menu, Search, ShoppingBag, ShoppingCart, User, X} from 'lucide-react';
import SiteLogoIconWhite from '/images/site_logo_mezzo_white.png?url';
import SiteLogoIconBlack from '/images/site_logo_mezzo_black.png?url';
import {SearchForm} from './SearchForm';
import {SearchFormPredictive} from './SearchFormPredictive';
import { SearchResultsPredictive } from './SearchResultsPredictive';
// import { P } from 'dist/client/assets/ProductPrice-kwE0Sy2X';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;

  const [isScrolled, setIsSrolled] = useState(false);
  const [isSrollingUp, setIsSrollinUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {type: asideType} = useAside();
  const [siteLogo, setSiteLogo] = useState('');

  useEffect(() => {
    if (window !== undefined) {
      let currentLocation = window.location;
      if (currentLocation.pathname === '/') {
        setSiteLogo(SiteLogoIconWhite);
        // console.log("logo changed.. white")
      } else {
        setSiteLogo(SiteLogoIconBlack);
        // console.log("logo changed.. black")
      }
    }
  });
  // console.log(siteLogo);

  useEffect(() => {
    // const root = document.documentElement;

    // root.style.setProperty('--announcement-height' , isScrolled ? '0px' : '40px');
    // root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');

    const handleScroll = () => {
      if (asideType !== 'closed') return;

      const currentSrollY = window.scrollY;

      setIsSrollinUp(currentSrollY < lastScrollY);
      setLastScrollY(currentSrollY);

      setIsSrolled(currentSrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isScrolled, asideType]);

  return (
    <>
      {/* Announcement Bar  */}

      <div className={`main_header_top text-white w-full fixed_padding_page`}>
        <div className="scrolling_infinite_animation_wrapper">
          <div className=" text-center announcebar_border_color scrolling_infinite_animation_strip h-7.5">
            <div className="scrolling_infinite_animation_item">
              <p>Fall collection is out now</p>
              <b>&nbsp; | &nbsp;</b>
              <a href="#">Shop our fall collection</a>
            </div>

            <div
              className=" scrolling_infinite_animation_item2 "
              aria-hidden={true}
            >
              <p>Fall collection is out now</p>
              <b>&nbsp; | &nbsp;</b>
              <a href="#">Shop our fall collection</a>
            </div>

            <div
              className=" scrolling_infinite_animation_item2"
              aria-hidden={true}
            >
              <p>Fall collection is out now</p>
              <b>&nbsp; | &nbsp;</b>
              <a href="#">Shop our fall collection</a>
            </div>
          </div>
        </div>
        {/* Main Header */}

        <header
          className={`h-16 text-white w-full flex items-center justify-between bg-transparent `}
        >
          <div className={`container`}>
            {/* Mobile logo 550px and below */}

            <div className={`hidden max-[768px]:block text-center `}>
              <div className="flex justify-between items-center">
                <div className={`lg:hidden`}>
                  <HeaderMenuMobileToggle />
                </div>

                <NavLink
                  prefetch="intent"
                  to="/"
                  className={`text-2xl tracking-normal inline-block`}
                >
                  <h1 className={`font-medium my-0`}>
                    {/* {shop.name} */}
                    <img
                      src={siteLogo}
                      alt="Logo"
                      style={{height: '28px', width: '130px'}}
                    />
                  </h1>
                </NavLink>

                <div className={`lg:hidden p-1`}>
                  <CartToggle />
                </div>
              </div>
            </div>

            {/* Header Content  */}

            <div className={`flex items-center justify-between `}>
              {/* Mobile Menu Toggle  */}

              {/* <div className={`lg:hidden`}>
                <HeaderMenuMobileToggle />
              </div> */}

              {/* Logo Above 550px  */}

              <NavLink
                prefetch="intent"
                to="/"
                className={`tracking-wider max-[768px]:hidden`}
              >
                <h1 className="font-medium">
                  
                  <img
                    src={siteLogo}
                    alt="Logo"
                    style={{height: '28px', width: '130px'}}
                  />
                </h1>
              </NavLink>

              {/* Desktop Navigation  */}

              <div className="max-[768px]:hidden">
                <HeaderMenu
                  menu={menu}
                  viewport="desktop"
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </div>

              {/* CTAS  */}
              <div className="max-[768px]:hidden">
                <div className="flex items-center">
                  <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* <header className="header">  

        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          <strong>{shop.name}</strong>
        </NavLink>
        
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />

      </header> */}
    </>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();
  const queriesDatalistId = useId();

  function myFunction() {
    if(typeof window !== "undefined"){
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('mySearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById('myMenu');
    li = ul.getElementsByTagName('li');
    ul.style.display = '';
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName('a')[0];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
    }
  }

  return (
    <>
      {viewport === 'mobile' && (
        <div className="search_menu_mobile">
          {/* <input
            type="text"
            id="mySearch"
            onKeyUp={myFunction}
            placeholder="Search..."
            title=""
          /> */}

          <SearchFormPredictive className="search-bar-mobile">
            {({fetchResults, goToSearch, inputRef}) => (
              <div className="flex items-center justify-between">
                <input
                  autoFocus={true}
                  className="search-input-mobile"
                  name="q"
                  id="search-input"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Search..."
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

                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="search-mobile-svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.316 9.825c0 3.368-2.05 6.404-5.194 7.692a8.47 8.47 0 0 1-9.164-1.81A8.265 8.265 0 0 1 2.144 6.63C3.45 3.52 6.519 1.495 9.921 1.5c4.638.007 8.395 3.732 8.395 8.325ZM22.5 22.5l-6.558-6.87L22.5 22.5Z"
                    ></path>
                  </svg>
                </div>
              </div>
            )}
          </SearchFormPredictive>

          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch, goToSearch}) => {
              const {articles, collections, pages, products, queries} = items;

              // console.log(items, 'itemss');
              // if (state === 'loading' && term.current) {
              //   return <div className='bg-white text-center'>Loading...</div>;
              // }

              if (!total ) {
                return (
                  
                  <>
                  {/* {console.log(term.current.length , "term.")} */}
                    {term.current.length > 0 && (
                    <SearchResultsPredictive.Empty
                      term={term}
                      closeSearch={closeSearch}
                      goToSearch={goToSearch}
                    />
                     )}
                  </>
                );
              }

              return (
                <>
                  <div
                    className={`fixed_padding_page predictive-search-result-main-div ${
                      term.current.length > 0 ? 'oppen' : 'closee'
                    } bg-white`}
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
                        <div className='pb-7.5' >
                          <button
                            className="predictive-search-go-btn"
                            onClick={goToSearch}
                          >
                            <div className="flex items-center justify-between">
                              <span>
                                search for &ldquo;{term.current}&rdquo;
                              </span>
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

          <ul id="myMenu" style={{display: 'none'}}>
            <li>
              <a href="#">HTML</a>
            </li>
            <li>
              <a href="#">CSS</a>
            </li>
            <li>
              <a href="#">JavaScript</a>
            </li>
            <li>
              <a href="#">PHP</a>
            </li>
            <li>
              <a href="#">Python</a>
            </li>
            <li>
              <a href="#">jQuery</a>
            </li>
            <li>
              <a href="#">SQL</a>
            </li>
            <li>
              <a href="#">Bootstrap</a>
            </li>
            <li>
              <a href="#">Node.js</a>
            </li>
          </ul>
        </div>
      )}

      <nav className={`${className}`} role="navigation">
        {/* {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          
        </NavLink>
      )} */}
        <div className={`slider_type_menu ${className} `}>
          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null;

            // if the url is internal, we strip the domain
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            return (
              <>
                {/* <div className='slider_type_menu_wrapper'> */}

                {/* <button key={item.id} onClick={close} style={viewport === 'desktop' ? activeLinkStyleDesktop : activeLinkStyle} className='header-menu-item link-hover-effect-nav'>{item.title}</button> */}
                {viewport === 'mobile' && (
                  <NavLink
                    className={`header-menu-item link-hover-effect-nav `}
                    end
                    id="mobile_header_link"
                    key={item.id}
                    onClick={close}
                    prefetch="intent"
                    style={
                      viewport === 'desktop'
                        ? activeLinkStyleDesktop
                        : activeLinkStyle
                    }
                    to={url}
                  >
                    <span className="slider_type_menu_item">{item.title}</span>
                    <span className="font-normal">&#10095;</span>
                  </NavLink>
                )}
                {viewport !== 'mobile' && (
                  <NavLink
                    className={`header-menu-item link-hover-effect-nav `}
                    end
                    key={item.id}
                    onClick={close}
                    prefetch="intent"
                    style={
                      viewport === 'desktop'
                        ? activeLinkStyleDesktop
                        : activeLinkStyle
                    }
                    to={url}
                  >
                    {item.title}
                  </NavLink>
                )}
                {/* </div> */}

                {/* <NavLink
            className={`header-menu-item link-hover-effect-nav `}
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={viewport === 'desktop' ? activeLinkStyleDesktop : activeLinkStyle}
            to={url}
          >
            {viewport === 'mobile' && (
              <div className='slider_type_menu_wrapper'>
                
                {item.title}
              </div>
            )}
            {viewport !== 'mobile' && (
               <>
                  {item.title}
               </> 
            )}
          </NavLink> */}
              </>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink
        prefetch="intent"
        to="/account"
        style={activeLinkStyleDesktop}
        className="px-5 py-1.25"
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            <span className="sr-only">
              {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
            </span>
            {/* <User className="w-5 h-5" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-5 h-5 lucide-icon-h" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 1.5c-2.575 0-4.49 1.593-4.49 5.747s1.664 4.985 1.954 5.27c.267.358.267.855 0 1.213-.238.245-4.544 1.116-6.115 2.723a4.647 4.647 0 0 0-1.665 2.915c-.069.293-.135 1.14-.181 1.88-.043.67.434 1.252 1.443 1.252h18.118c.491 0 1.477-.573 1.435-1.237-.047-.743-.113-1.6-.183-1.895a4.645 4.645 0 0 0-1.664-2.887c-1.572-1.621-5.878-2.493-6.116-2.724a1.019 1.019 0 0 1 0-1.212c.29-.286 1.955-1.103 1.955-5.27 0-4.168-1.85-5.775-4.49-5.775Z"></path></svg>
          </Await>
        </Suspense>
      </NavLink>

      <TopSide.Provider>
        <SearchToggle />
      </TopSide.Provider>

      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button className="p-2 -ml-2" onClick={() => open('mobile')}>
      <Menu className="w-5 h-5 lucide-icon-h" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="reset hover:cursor-pointer px-3.75 py-1.25"
      onClick={() => open('search')}
    >
      {/* <Search className="w-5 h-5" /> */}

      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-5 h-5 lucide-icon-h" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.316 9.825c0 3.368-2.05 6.404-5.194 7.692a8.47 8.47 0 0 1-9.164-1.81A8.265 8.265 0 0 1 2.144 6.63C3.45 3.52 6.519 1.495 9.921 1.5c4.638.007 8.395 3.732 8.395 8.325ZM22.5 22.5l-6.558-6.87L22.5 22.5Z"></path></svg>
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      className="relative lg:px-5 lg:py-1.25 md:px-5 md:py-1.25"
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      {/* <ShoppingCart className="w-5 h-5 lucide-icon-h" />   */}
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-5 h-5 lucide-icon-h" viewBox="0 0 24 24"><path d="M16.25 7.8V5.7h4.2l1.05 16.8H2.6L3.65 5.7h4.2a4.2 4.2 0 0 1 8.4 0h-8.4v2.1"></path>
      {/* <circle class="icon-cart-full" cx="12" cy="15" r="4"></circle> */}
      </svg>
      {/* {count !== null && count > 0 && (
        <span className='absolute top-0 right-6 bg-orange-400 text-black text-[12px] font-medium rounded-full w-3 h-3 flex justify-center items-center'>
          {count > 9 ? '9+' : count}
        </span>
       )} */}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    // color: isPending ? 'grey' : 'black',
  };
}

function activeLinkStyleDesktop({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    // color: isPending ? 'grey' : 'white',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */

import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import { TopSide, useTopSide } from './topside';
import {Menu, Search, ShoppingBag, ShoppingCart, User} from 'lucide-react';
import SiteLogoIconWhite from '/images/site_logo_mezzo_white.png?url';
import SiteLogoIconBlack from '/images/site_logo_mezzo_black.png?url';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;

  const [isScrolled, setIsSrolled] = useState(false);
  const [isSrollingUp, setIsSrollinUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {type: asideType} = useAside();
  const [siteLogo , setSiteLogo] = useState('');

  useEffect(()=>{
    if(window !== undefined){
      let currentLocation = window.location;
    if(currentLocation.pathname === '/'){
      setSiteLogo(SiteLogoIconWhite);
      // console.log("logo changed.. white")
    }
    else{
      setSiteLogo(SiteLogoIconBlack);
      // console.log("logo changed.. black")
    }
  }
  
})
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

            <div className={`hidden max-[550px]:block text-center `}>
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
                className={`tracking-wider text-center max-[550px]:hidden absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:text-left transition-all duration-300 ease-in-out`}
              >
                <h1 className="font-medium">
                  {/* {shop.name} */}
                  <img
                    src={siteLogo}
                    alt="Logo"
                    style={{height: '28px', width: '130px'}}
                  />
                </h1>
              </NavLink>

              {/* Desktop Navigation  */}

              <div className="hidden lg:block">
                <HeaderMenu
                  menu={menu}
                  viewport="desktop"
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </div>

              {/* CTAS  */}
              <div className="hidden lg:block">
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

  function myFunction() {
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

  return (
    <>
      {viewport === 'mobile' && (
        <div className="search_menu_mobile">
          <input
            type="text"
            id="mySearch"
            onKeyUp={myFunction}
            placeholder="Search..."
            title=""
          />
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

                {/* <button key={item.id} onClick={close} style={viewport === 'desktop' ? activeLinkStyleDesktop : activeLinkStyle} className='header-menu-item'>{item.title}</button> */}
                {viewport === 'mobile' && (
                  <NavLink
                    className={`header-menu-item `}
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
                    className={`header-menu-item `}
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
            className={`header-menu-item `}
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
            <User className="w-6 h-6" />
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
      <Menu className="w-6 h-6 lucide-icon-h" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset hover:cursor-pointer px-5 py-1.25" onClick={() => open('search')}>
      <Search className="w-6 h-6" />
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
      className="relative px-5 py-1.25"
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
      <ShoppingCart className="w-6 h-6 lucide-icon-h" />
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

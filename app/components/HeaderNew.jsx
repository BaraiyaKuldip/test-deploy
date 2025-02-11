import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import { Menu, User } from 'lucide-react';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;

  const [isScrolled,setIsSrolled] = useState(false);
  const [isSrollingUp,setIsSrollinUp] = useState(false);
  const [lastScrollY,setLastScrollY] = useState(0);
  const {type : asideType} = useAside();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--announcement-height' , isScrolled ? '0px' : '40px');
    root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');

    const handleScroll = () => {
      if(asideType !== 'closed') return;

      const currentSrollY = window.scrollY ;

      setIsSrollinUp(currentSrollY < lastScrollY);
      setLastScrollY(currentSrollY);

      setIsSrolled(currentSrollY > 50);

    }

    window.addEventListener('scroll' , handleScroll, {passive: true});

    return () => window.removeEventListener('scroll' , handleScroll)

  },[lastScrollY , isScrolled , asideType]);
 
  return (
    <>

      {/* Announcement Bar  */}

      <div className={` fixed w-full z-40 transition-transform duration-500 ease-in-out px-12.5
        ${!isSrollingUp && isScrolled && asideType === 'closed' ? '-translate-y-full' : 'translate-y-0'} `}>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isScrolled ? 'max-h-0' : 'max-h-12'}`}>
          <div className='container mx-auto text-center py-1 border-b  border-gray-100'>
            <span className='flex justify-center animate-loop-scroll group-hover:paused'>
              <p>
                Fall collection is out now 
              </p>
              <b>&nbsp; | &nbsp;</b>
              <p>
                Shop our fall collection
              </p>
            </span>
            {/* <span className='flex justify-center animate-loop-scroll group-hover:paused' aria-hidden='true'>
              <p>
                Fall collection is out now 
              </p>
              <b>&nbsp; | &nbsp;</b>
              <p>
                Shop our fall collection
              </p>
            </span> */}
          </div>
        </div>
      </div>

      {/* Main Header */}

      <header className={`px-12.5 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white'} `}>

        <div className={`container mx-auto`}>
        
        {/* Mobile logo 550px and below */}

          <div className={`hidden max-[550px]:block text-center transition-all duration-300 ease-in-out ${isScrolled ? 'py-1' : 'py-2'} `}>
            <NavLink
            prefetch='intent'
            to='/'
            className={`text-2xl tracking-normal inline-block`}
            >
              <h1 className={`font-medium my-0`}>
                {/* {shop.name} */}
                Mezzo
              </h1>
            </NavLink>
          </div>

          {/* Header Content  */}

            <div className={`flex items-center justify-between transition-all duration-300 ease-in-out ${isScrolled ? 'py-3 sm:py-4' : ''}`}>

            {/* Mobile Menu Toggle  */}

              <div className={`lg:hidden`}>
                <HeaderMenuMobileToggle />
              </div>

              {/* Logo Above 550px  */}

              <NavLink 
              prefetch='intent'
              to='/'
              className={`tracking-wider text-center max-[550px]:hidden absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:text-left transition-all duration-300 ease-in-out ${isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[28px]' }`}
              >
                <h1 className='font-medium'>
                  {/* {shop.name} */}
                  Mezzo
                </h1>
              </NavLink>

              {/* Desktop Navigation  */}

              <div className='hidden lg:block flex-1-px-12'>
                <HeaderMenu
                  menu={menu}
                  viewport='desktop'
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </div>


          </div>

        </div>

      </header>

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

  const baseClassName = " transition-all duration-200 relative ";

  const desktopClassName = " flex items-center justify-center space-x-12 text-sm uppercase tracking-wider";
  const mobileClassName = " flex flex-col col-6 ";

  return (
    <nav 
      className={viewport === 'desktop' ? desktopClassName : mobileClassName}
      role='navigation'
    >
      {viewport === 'mobile' && (
        <>
          {/* Mobile Navigation Links  */}
          <div className='space-x-6 py-4'>
            {
              menu?.items.map((item) => {
                if(!item.url) return null;
      
                const url = item.url.includes("myshopify.com") || 
                item.url.includes(publicStoreDomain) || // param-patel-102.com/collections
                item.url.includes(primaryDomainUrl)  // store.param-patel-102.com/collections
                ? new URL(item.url).pathname  //  /collections
                : item.url; //  partner.param-patel-102.com (redirect person to another site)
       
      
                return(
                  <NavLink
                    className={`${baseClassName}`}
                    end
                    key={item.id}
                    onClick={close}
                    prefetch='intent'
                    to={url}
                  >
                    {item.title}
                  </NavLink>
                );
              })}
          </div>

          {/* Mobile Footer Links  */}

          <div className='mt-auto border-t border-gray-100 py-6'>
            <div className='space-y-4'>
              <NavLink
                to='/account'
                className='flex items-center'
              >
                <User className='w-5 h-5'/>
                <span className='text-base'>Account</span>
                {/* <ShoppingBag />  */}
              </NavLink>
            </div>
          </div>

        </>
      )}

      {viewport === 'desktop' && (
        // Desktop Menu 
        menu?.items.map((item) => {
          if(!item.url) return null;

          const url = item.url.includes("myshopify.com") || 
          item.url.includes(publicStoreDomain) || // param-patel-102.com/collections
          item.url.includes(primaryDomainUrl)  // store.param-patel-102.com/collections
          ? new URL(item.url).pathname  //  /collections
          : item.url; //  partner.param-patel-102.com (redirect person to another site)
 

          return(
            <NavLink
              className={`${baseClassName}`}
              end
              key={item.id}
              onClick={close}
              prefetch='intent'
              to={url}
            >
              {item.title}
            </NavLink>
          )
        })
      )}

    </nav>
  )

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
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
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 -ml-2"
      onClick={() => open('mobile')}
    >
      <Menu className='w-6 h-6'/>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
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
      Cart {count === null ? <span>&nbsp;</span> : count}
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
    color: isPending ? 'grey' : 'black',
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

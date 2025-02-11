import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import { Menu , Search, ShoppingBag, ShoppingCart , User } from 'lucide-react';
import SiteLogoIcon from '/images/site_logo_mezzo_white.png?url';

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
      // const root = document.documentElement;

      // root.style.setProperty('--announcement-height' , isScrolled ? '0px' : '40px');
      // root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');

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

      <div className={`main_header_top text-white w-full `}>
          
          <div className='fixed_padding_page text-center announcebar_border_color scrolling_infinite_animation_strip h-7.5'>
            <div className='scrolling_infinite_animation_item'>
              <p>
                Fall collection is out now 
              </p>
              <b>&nbsp; | &nbsp;</b>
              <a href='#' >
                Shop our fall collection
              </a>
            </div>

            <div className=' scrolling_infinite_animation_item2 ' aria-hidden={true}>
              <p>
                Fall collection is out now 
              </p>
              <b>&nbsp; | &nbsp;</b>
              <a href='#'>
                Shop our fall collection
              </a>
            </div>
             
            <div className=' scrolling_infinite_animation_item2' aria-hidden={true}>
              <p>
                Fall collection is out now 
              </p>
              <b>&nbsp; | &nbsp;</b>
              <a href='#'>
                Shop our fall collection
              </a>
            </div>
            
          </div>
          {/* Main Header */}

      <header className={`h-16 text-white w-full flex items-center justify-between fixed_padding_page bg-transparent `}>

        <div className={`container`}>
        
        {/* Mobile logo 550px and below */}

          <div className={`hidden max-[550px]:block text-center `}>
            
            <div className='flex justify-between items-center'>

            <div className={`lg:hidden`}>
              <HeaderMenuMobileToggle />
            </div>

            <NavLink
            prefetch='intent'
            to='/'
            className={`text-2xl tracking-normal inline-block`}
            >
              <h1 className={`font-medium my-0`}>
                {/* {shop.name} */}
                <img src={SiteLogoIcon} alt="Logo" style={{height:"28px" , width:"130px"}} />
              </h1>
            </NavLink>

            <div className={`lg:hidden p-1`}>
            <CartToggle/>
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
              prefetch='intent'
              to='/'
              className={`tracking-wider text-center max-[550px]:hidden absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:text-left transition-all duration-300 ease-in-out`}
              >
                <h1 className='font-medium'>
                  {/* {shop.name} */}
                  <img src={SiteLogoIcon} alt="Logo" style={{height:"28px" , width:"130px"}} />
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

              <div className='hidden lg:block'>
              <div className='flex justify-between gap-4'>
                <User className='w-6 h-6'/>
                <Search className='w-6 h-6'/>
                <CartToggle/>
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

  
  return (
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
            className={`header-menu-item `}
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={viewport === 'desktop' ? activeLinkStyleDesktop : activeLinkStyle}
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
      <ShoppingCart className='w-6 h-6'/> 
       {/* {count === null ? <span>&nbsp;</span> : count} */}
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

function activeLinkStyleDesktop({isActive, isPending}){
  return{
    fontWeight : isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  }
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

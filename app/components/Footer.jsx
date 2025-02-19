import {defer} from '@shopify/remix-oxygen';
import {Await, NavLink, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import FooterGirlImage from '/images/girl-image-footer.jpg?url';
import SiteLogoIcon from '/images/site_logo_mezzo_white.png?url';
import SiteFooterLogoIcon from '/images/site_footer_logo_mezzo_white.png?url';

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
async function loadCriticalData({context, param}) {
  const {storefront} = context;
  const {handle} = param;
  const {footerSubMenu} = await Promise.all([
    storefront.query(FOOTER_SUB_MENU_QUERY, {
      variables: {handle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {footerSubMenu};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

/**
 * @param {FooterProps}
 */
export function Footer({
  footer: footerPromise,
  footerSubMenu: footerSubMenuPromise,
  header,
  publicStoreDomain,
}) {
  return (
    <Suspense>
      {console.log('footer sub menu', footerPromise)}
      {/* {console.log(footerSubMenu)} */}
      <footer className="footer">
        <div className="footer-holder">
          <div className="footer-wrapper-full footer-padding-custom ">
            <div className="footer-container ftr-con-rev">
              <div className="footer-aside">
                <div className="footer-newsletter">
                  <div className="footer-newsletter-image">
                    <div className="footer-newsletter-image-div relative block w-full h-full overflow-hidden aspect-[2] ">
                      <img
                        src={FooterGirlImage}
                        className="block object-center overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                        alt="newsletterimage"
                        style={{objectPosition: 'center center'}}
                      />
                    </div>
                  </div>
                  <div className="footer-newsletter-body">
                    <p className="footer-newsletter-title">
                      OUR WEEKLY NEWSLETTER
                    </p>
                    <h3>SKIP TO THE DETAILS</h3>
                    <div className="fnt footer-text-4">
                      <p>
                        {' '}
                        join to get special offers, free giveaways, and
                        once-in-a-lifetime deals.
                      </p>
                    </div>

                    <form>
                      <p>
                        <em>Thank you for joining our mailing list!</em>
                      </p>
                      <div>
                        <label htmlFor=""></label>
                        <input type="email" />
                        <span>
                          <button></button>
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="footer-content">
                <div className="footer-content-inner">
                  <div className="footer-logo-div">
                    <a href="/">
                      <img
                        src={SiteFooterLogoIcon}
                        alt="Logo"
                        style={{height: '49px', width: '230px'}}
                      />
                    </a>
                  </div>
                  <div className="float-grid-box">
                    <Await resolve={footerPromise}>
                      {(footer) => (
                        <>
                          {console.log(footer)}
                          {footer?.menu && header.shop.primaryDomain?.url && (
                            <>
                              <FooterMenu
                                menu={footer.menu}
                                subMenu={footerSubMenuPromise}
                                primaryDomainUrl={header.shop.primaryDomain.url}
                                publicStoreDomain={publicStoreDomain}
                              />
                            </>
                          )}

                          {/* {console.log(footerSubMenuPromise)} */}
                          {/* {console.log(header)} */}
                        </>
                      )}
                    </Await>
                  </div>
                </div>
                <div className="footer-social">
                  <h3 className="footer-heading-8">Stay in touch.</h3>
                  <div className="footer-social-inner">
                    <a
                      href="https://www.facebook.com/shopify"
                      target="_blank"
                      className="footer-social-icon"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 50 50"
                        style={{fill: '#FFFFFF'}}
                      >
                        <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
                      </svg>
                      <span className="sr-only">Facebook</span>
                    </a>

                    <a
                      href="https://twitter.com/shopify"
                      target="_blank"
                      className="footer-social-icon"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0,0,256,256"
                        style={{fill: '#FFFFFF'}}
                      >
                        <g
                          fill="#ffffff"
                          fillRule="nonzero"
                          stroke="none"
                          strokeWidth="1"
                          strokeLinecap="butt"
                          strokeLinejoin="miter"
                          strokeMiterlimit="10"
                          strokeDasharray=""
                          strokedashoffsetfset="0"
                          fontFamily="none"
                          fontWeight="none"
                          fontSize="none"
                          textAnchor="none"
                          style={{mixBlendMode: 'normal'}}
                        >
                          <g transform="scale(4,4)">
                            <path d="M61.932,15.439c-2.099,0.93 -4.356,1.55 -6.737,1.843c2.421,-1.437 4.283,-3.729 5.157,-6.437c-2.265,1.328 -4.774,2.303 -7.444,2.817c-2.132,-2.26 -5.173,-3.662 -8.542,-3.662c-6.472,0 -11.717,5.2 -11.717,11.611c0,0.907 0.106,1.791 0.306,2.649c-9.736,-0.489 -18.371,-5.117 -24.148,-12.141c-1.015,1.716 -1.586,3.726 -1.586,5.847c0,4.031 2.064,7.579 5.211,9.67c-1.921,-0.059 -3.729,-0.593 -5.312,-1.45c0,0.035 0,0.087 0,0.136c0,5.633 4.04,10.323 9.395,11.391c-0.979,0.268 -2.013,0.417 -3.079,0.417c-0.757,0 -1.494,-0.086 -2.208,-0.214c1.491,4.603 5.817,7.968 10.942,8.067c-4.01,3.109 -9.06,4.971 -14.552,4.971c-0.949,0 -1.876,-0.054 -2.793,-0.165c5.187,3.285 11.348,5.211 17.961,5.211c21.549,0 33.337,-17.696 33.337,-33.047c0,-0.503 -0.016,-1.004 -0.04,-1.499c2.301,-1.624 4.283,-3.674 5.849,-6.015"></path>
                          </g>
                        </g>
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </a>

                    <a
                      href="https://instagram.com/shopify"
                      target="_blank"
                      className="footer-social-icon"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0,0,256,256"
                        style={{fill: '#FFFFFF'}}
                      >
                        <g
                          fill="#ffffff"
                          fillRule="nonzero"
                          stroke="none"
                          strokeWidth="1"
                          strokeLinecap="butt"
                          strokeLinejoin="miter"
                          strokeMiterlimit="10"
                          strokeDasharray=""
                          strokedashoffsetfset="0"
                          fontFamily="none"
                          fontWeight="none"
                          fontSize="none"
                          textAnchor="none"
                          style={{mixBlendMode: 'normal'}}
                        >
                          <g transform="scale(9.84615,9.84615)">
                            <path d="M7.54688,0c-4.15625,0 -7.54687,3.39063 -7.54687,7.54688v10.90625c0,4.15625 3.39063,7.54688 7.54688,7.54688h10.90625c4.15625,0 7.54688,-3.39062 7.54688,-7.54687v-10.90625c0,-4.15625 -3.39062,-7.54687 -7.54687,-7.54687zM7.54688,2h10.90625c3.07422,0 5.54688,2.46875 5.54688,5.54688v10.90625c0,3.07422 -2.46875,5.54688 -5.54687,5.54688h-10.90625c-3.07422,0 -5.54687,-2.46875 -5.54687,-5.54687v-10.90625c0,-3.07422 2.46875,-5.54687 5.54688,-5.54687zM20.5,4c-0.82812,0 -1.5,0.67188 -1.5,1.5c0,0.82813 0.67188,1.5 1.5,1.5c0.82813,0 1.5,-0.67187 1.5,-1.5c0,-0.82812 -0.67187,-1.5 -1.5,-1.5zM13,6c-3.85547,0 -7,3.14453 -7,7c0,3.85547 3.14453,7 7,7c3.85547,0 7,-3.14453 7,-7c0,-3.85547 -3.14453,-7 -7,-7zM13,8c2.77344,0 5,2.22656 5,5c0,2.77344 -2.22656,5 -5,5c-2.77344,0 -5,-2.22656 -5,-5c0,-2.77344 2.22656,-5 5,-5z"></path>
                          </g>
                        </g>
                      </svg>
                      <span className="sr-only">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   subMenu: FooterSubMenuQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */

function FooterMenu({menu, subMenu, primaryDomainUrl, publicStoreDomain}) {
  // const {footerSubMenu} = useLoaderData();
  return (
    <>
      {console.log(menu)}

      <>
        {/* {console.log(menu)} */}
        {menu.items.map((item) => {
          // console.log(item)
          if (!item.url) return null;
          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          // return isExternal ? (
          //   <a
          //     href={url}
          //     key={item.id}
          //     rel="noopener noreferrer"
          //     target="_blank"
          //   >
          //     {item.title}
          //   </a>
          // ) : (
          //   <>{item.title}</>
          // );
          return (
            <div className="float-grid-box-item">
              <p>{item.title}</p>
              <input type="text" name="" id="" />
              <label htmlFor=""></label>
              <ul>
                <FooterSubMenu
                  subMenu={subMenu}
                  primaryDomainUrl={primaryDomainUrl}
                  publicStoreDomain={publicStoreDomain}
                />
              </ul>
            </div>
          );
        })}
      </>
    </>
  );
}

/**
 * @param {{
 *   subMenu: FooterSubMenuQuery['subMenu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */

function FooterSubMenu({subMenu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <>
      {console.log('subMenu sub menu ', subMenu)}
      <>
        <Await resolve={subMenu}>
          {(subMenuItems) => (
            <>
              
              

              {console.log("subMenuItems ",subMenuItems)}
              {/* {console.log(header)} */}
            </>
          )}
        </Await>
        {/* {console.log(menu)} */}
        {/* {subMenu.items.map((item) => {
          // console.log(item)
          if (!item.url) return null;
          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          // return isExternal ? (
          //   <a
          //     href={url}
          //     key={item.id}
          //     rel="noopener noreferrer"
          //     target="_blank"
          //   >
          //     {item.title}
          //   </a>
          // ) : (
          //   <>{item.title}</>
          // );
            return(
            <li>
              <p>
                {item.title}
              </p>
            </li>
              
            );
        })} */}
      </>
    </>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
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
    color: isPending ? 'grey' : 'white',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {Promise<FooterSubMenuQuery|null>} footerSubMenu
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').FooterSubMenuQuery} FooterSubMenuQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */

// Query the product title by its ID
const FOOTER_SUB_MENU_QUERY = `#graphql
  menu(handle: $handle) {
    items{
      id
      title
      type
      url
  }`;

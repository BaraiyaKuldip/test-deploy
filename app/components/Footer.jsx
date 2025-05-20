import {defer} from '@shopify/remix-oxygen';
import {Await, NavLink, useLoaderData, Link} from '@remix-run/react';
import {Suspense, useState} from 'react';
import FooterGirlImage from '/images/girl-image-footer.jpg?url';
import SiteLogoIcon from '/images/site_logo_mezzo_white.png?url';
import SiteFooterLogoIcon from '/images/site_footer_logo_mezzo_white.png?url';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Select,
} from '@headlessui/react';
import {ChevronDown, ChevronRight, ChevronUp, MoveRight} from 'lucide-react';

/**
 * @param {FooterProps}
 */
export function Footer({
  footer: footerPromise,
  footerSubMenu: footerSubMenuPromise,
  header,
  publicStoreDomain,
}) {

function CurrencySelectorFooter  ()  {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState({
    country: "United States",
    code: "US",
    currency: "USD",
    symbol: "$",
  });

  const options = [
    { country: "Canada", code: "CA", currency: "CAD", symbol: "$" },
    { country: "United Kingdom", code: "GB", currency: "GBP", symbol: "£" },
    { country: "United States", code: "US", currency: "USD", symbol: "$" },
  ];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Button to toggle dropdown */}
      <button
        onClick={toggleDropdown}
        className="custom-popout-sel w-fit flex items-center justify-between bg-[#1d1d1d] text-white text-left px-4 py-2 focus:outline-none border-[1px] border-[rgba(213,213,213,0.15)] rounded-[3px] cursor-pointer"
        aria-expanded={isOpen}
      >
        <span >{`${selected.country} (${selected.code} ${selected.symbol})`}</span>
        
        <svg style={{marginInlineStart: ".2em", marginBlockStart: ".1em", fontSize: "1.4em", transition: "transform .3s cubic-bezier(.215,.61,.355,1)"}} xmlns="http://www.w3.org/2000/svg" stroke-linecap="square" stroke-linejoin="arcs" aria-hidden="true" className={`w-[1em] h-[1em] flex items-center ${isOpen ? "rotate-180" : ""}`} fill='none' stroke='currentColor' strokeMiterlimit={10} strokeWidth={"2px"} viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul className="absolute bottom-12 bg-[#1d1d1d] border-[1px] border-[rgba(213,213,213,0.15)] cursor-pointer w-53 mt-1 z-10">
          {options.map((option) => (
            <li
              key={option.code}
              className={`relative px-4 py-2 hover-effect-fixed cursor-pointer ${
                selected.code === option.code
                  ? ""
                  : "hover:bg-[rgba(223,223,223,0.05)]"
              }`}
              onClick={() => handleSelect(option)}
            >
              <span className={`${
                selected.code === option.code
                  ? "border-b-[1px] border-[rgba(223,223,223,0.15)]"
                  : ""
              }`}>{`${option.country} (${option.code} ${option.symbol})`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

  return (
    <>
      <Suspense>
        {/* {console.log('footer sub menu', footerPromise)} */}
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
                    <div className="footer-newsletter-body fixed_padding_page">
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
                          {/* <em>Thank you for joining our mailing list!</em> */}
                        </p>
                        <div className="footer-input-group">
                          <label htmlFor=""></label>
                          <input
                            className="footer-newsletter-mail"
                            type="email"
                            placeholder="your-email@example.com"
                            id="footer-newsletter-mail"
                            autoCorrect="off"
                          />
                          <span>
                            <button className="flex" type="submit">
                              <MoveRight
                                strokeWidth={1}
                                className="w-5 h-5 text-[rgba(255,255,255,0.9)]"
                              />
                            </button>
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="footer-content">
                  <div className="footer-content-inner">
                    <div className="footer-logo-div">
                      <Link to="/">
                        <img
                          src={SiteFooterLogoIcon}
                          alt="Logo"
                          style={{height: '49px', width: '230px'}}
                        />
                      </Link>
                    </div>
                    <div className="float-grid-box ">
                      <Await resolve={footerPromise}>
                        {(footer) => (
                          <>
                            {/* {console.log(footer)} */}
                            {footer?.menu && header.shop.primaryDomain?.url && (
                              <>
                                <FooterMenu
                                  menu={footer.menu}
                                  subMenu={footerSubMenuPromise}
                                  primaryDomainUrl={
                                    header.shop.primaryDomain.url
                                  }
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
                          aria-hidden="true"
                          class="icon-social icon-social-facebook"
                          viewBox="0 0 30 30"
                        >
                          <path
                            d="M30 15.091C30 6.756 23.285 0 15 0S0 6.756 0 15.091C0 22.625 5.484 28.868 12.656 30V19.454H8.848V15.09h3.808v-3.324c0-3.782 2.239-5.872 5.666-5.872 1.64 0 3.358.295 3.358.295v3.714h-1.893c-1.863 0-2.443 1.164-2.443 2.358v2.83h4.16l-.665 4.362h-3.495V30C24.516 28.868 30 22.625 30 15.091z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <span className="sr-only">Facebook</span>
                      </a>

                      <a
                        href="https://twitter.com/shopify"
                        target="_blank"
                        className="footer-social-icon"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          class="icon-social icon-social-x"
                          style={{fill: '#FFFFFF'}}
                        >
                          <path
                            fill-rule="nonzero"
                            d="m13.903 10.435 7.445-8.655h-1.764l-6.465 7.515L7.955 1.78H2l7.808 11.364L2 22.22h1.764l6.828-7.936 5.453 7.936H22zm-2.417 2.81-.791-1.132L4.4 3.109h2.71l5.08 7.266.791 1.132 6.604 9.445h-2.71z"
                          ></path>
                        </svg>
                        <span className="sr-only">X</span>
                      </a>

                      <a
                        href="https://instagram.com/shopify"
                        target="_blank"
                        className="footer-social-icon"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          class="icon-social icon-social-tiktok"
                          viewBox="0 0 15 17"
                        >
                          <path
                            fill="currentColor"
                            fill-rule="nonzero"
                            d="M10.917 0c.289 2.412 1.674 3.85 4.083 4.004v2.713c-1.396.133-2.619-.311-4.04-1.148v5.075c0 6.447-7.232 8.461-10.14 3.84-1.867-2.973-.723-8.19 5.27-8.4v2.862a8.879 8.879 0 0 0-1.391.331c-1.333.439-2.089 1.26-1.879 2.708.404 2.775 5.641 3.596 5.206-1.825V.005h2.891V0Z"
                          ></path>
                        </svg>
                        <span className="sr-only">TikTok</span>
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
          <section className="sub-footer">
            <div className="sub-footer-wrapper footer-wrapper-full">
              <div className="sub-footer-div">
                <div className="sub-footer-item-select">
                  
                  <CurrencySelectorFooter/>
                  
                </div>
                <div className="sub-footer-item-copyright flex gap-1.25">
                  <span> © </span>
                  <Link
                    target="_blank"
                    className="hover-effect-fixed relative"
                    to="https://meetanshi.com/"
                  >
                    MEETANSHI
                  </Link>
                  <span> 2025 </span>
                </div>
              </div>
            </div>
          </section>
        </footer>
      </Suspense>
    </>
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
      {/* {console.log('menu2 ', menu)} */}

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
            <div key={item.id} className="float-grid-box-item">
              <Disclosure>
                {({open}) => (
                  <>
                    <Disclosure.Button className="text-left md:cursor-default flex justify-between items-center w-full footer-nav-button ">
                      <h3 className="flex justify-between footer-nav-title">
                        {item.title}
                      </h3>
                      <span className="md:hidden footer-nav-caret">
                        {open ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </span>
                    </Disclosure.Button>
                    {/* {item?.items?.length > 0 ? ( */}
                    <div
                      className={`${
                        open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                      } overflow-hidden transition-all duration-300`}
                    >
                      <Disclosure.Panel static>
                        <ul className="footer-nav-ul">
                          <Await resolve={subMenu}>
                            {(subMenuItems) => (
                              <>
                                {/* {console.log(
                                  'subMenuItems ',
                                  subMenuItems.menu.items,
                                )} */}
                                {/* {console.log(subMenuItems ,"submenuitems")} */}

                                {subMenuItems.menu.items.map((subItem) => {
                                  if (
                                    (item.type === 'COLLECTIONS' &&
                                      subItem.type === 'COLLECTION') ||
                                    subItem.type === item.type
                                  ) {
                                    if (!subItem.url) return null;
                                    // if the url is internal, we strip the domain
                                    const url =
                                      subItem.url.includes('myshopify.com') ||
                                      subItem.url.includes(publicStoreDomain) ||
                                      subItem.url.includes(primaryDomainUrl)
                                        ? new URL(subItem.url).pathname
                                        : subItem.url;

                                    return (
                                      <li
                                        key={subItem.id}
                                        className="footer-nav-li"
                                      >
                                        <Link
                                          to={subItem.url}
                                          target="_blank"
                                          rel="noopener noreferrer "
                                          className="relative hover-effect-fixed"
                                        >
                                          {subItem.title}
                                        </Link>
                                      </li>
                                    );
                                  }
                                })}
                              </>
                            )}
                          </Await>
                        </ul>
                      </Disclosure.Panel>
                    </div>
                    {/* ) : null} */}
                  </>
                )}
              </Disclosure>
            </div>
          );
        })}
      </>
    </>
  );
}

// /**
//  * @param {{
//  *   subMenu: FooterSubMenuQuery['subMenu'];
//  *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
//  *   publicStoreDomain: string;
//  * }}
//  */

// function FooterSubMenu({subMenu, primaryDomainUrl, publicStoreDomain}) {
//   return (
//     <>
//       {console.log('subMenu sub menu ', subMenu)}
//       <>
//         <Await resolve={subMenu}>
//           {(subMenuItems) => (
//             <>
//               {/* {console.log(subMenuItems.menu.item.map((item)=>{return item}))} */}

//               {console.log('subMenuItems ', subMenuItems.menu.items)}
//               {/* {console.log(header)} */}

//               {subMenuItems.menu.items.map((item) => {

//                 if (!item.url) return null;
//                 // if the url is internal, we strip the domain
//                 const url =
//                   item.url.includes('myshopify.com') ||
//                   item.url.includes(publicStoreDomain) ||
//                   item.url.includes(primaryDomainUrl)
//                     ? new URL(item.url).pathname
//                     : item.url;
//                 const isExternal = !url.startsWith('/');

//                 return (
//                   <li key={item.id}>
//                     <p>{item.title}</p>
//                   </li>
//                 );
//               })}
//             </>
//           )}
//         </Await>
//         {/* {console.log(menu)} */}
//       </>
//     </>
//   );
// }

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

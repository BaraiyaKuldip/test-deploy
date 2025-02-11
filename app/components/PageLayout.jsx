import {Await, Link} from '@remix-run/react';
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
import GirlImage1Portrait from '/images/white-london-having-womans-female-new.jpg?url';
import GirlImage1Landscape from '/images/york-work-portrait-london-outdoors-person.jpg?url';
import { use } from 'react';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}) {
  const [current_height, setCurrent_height] = useState(0);
  const [current_width, setCurrent_width] = useState(0);
  const [divBgImage,setDivBgImage] = useState("");
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access the document object here

      setCurrent_height(document.documentElement.clientHeight);
      setCurrent_width(document.documentElement.clientWidth);
      if(document.documentElement.clientWidth > 768){
        setDivBgImage(GirlImage1Landscape);
      }
      else{
        setDivBgImage(GirlImage1Portrait);
      }
      // ... do something with the element
    }
  }, [current_height,current_width]);

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
        />
      )}
      <main>
        {/* <div>

           {current_width < 768 &&(
            <img src={GirlImage1Portrait} alt="img" style={{width:"100%" , height:"500px" , objectFit:'fill'}} />
          )} 

          {current_width > 768 &&(
            <img src={GirlImage1Landscape} alt="img" style={{width:"100%" , height:"600px" , objectFit:'fill'}}/>
          )}
          
        </div> */}

        <div
          style={{backgroundImage: `url(${divBgImage})`}}
          className='div_bg_image'
        >
          <div className='mx-6 mt-20 p-12.5'>
           <div style={{zIndex: 1}}>
            <p className='font-semibold'>A CONSCIOUS WARDROBE</p>
            <p className='alegreya-font-style'>Timeless Style <br /> Sustainable Design </p> 
            {/* <p className='alegreya-font-style'></p> */}
            <div className='flex justify-around items-center py-5 '>
              <button
                style={{
                  fontSize:"13px",
                  fontWeight:"bold",
                  width:"200px",
                  height:"50px",
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
              <a
                style={{
                  fontWeight:"bold",
                  color: 'white',
                  border: 'none',
                  fontSize:"13px",
                  cursor: 'pointer',
                  margin: '5px',
                }}
                href='#'
              >
                LEARN MORE
              </a>
            </div>
           </div>
          </div>
          
        </div>

        <div className="fixed_padding_page">{children}</div>
      </main>
      <Footer
        footer={footer}
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

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
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
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
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
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */

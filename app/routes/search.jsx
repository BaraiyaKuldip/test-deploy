import React, {useEffect, useRef, useState} from 'react';
import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {getEmptyPredictiveSearchResult} from '~/lib/search';
import {ChevronRight, RotateCcw, X} from 'lucide-react';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: `Hydrogen | Search`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise = isPredictive
    ? predictiveSearch({request, context})
    : regularSearch({request, context});

  searchPromise.catch((error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return json(await searchPromise);
}

/**
 * Search form component that sends search requests to the `/search` route.
 * @example
 * ```tsx
 * <SearchForm>
 *  {({inputRef}) => (
 *    <>
 *      <input
 *        ref={inputRef}
 *        type="search"
 *        defaultValue={term}
 *        name="q"
 *        placeholder="Search…"
 *      />
 *      <button type="submit">Search</button>
 *   </>
 *  )}
 *  </SearchForm>
 @param {SearchFormProps}* 
 */

function SearchPageContent() {
  /** @type {LoaderReturnData} */
  const {type, term, result, error} = useLoaderData();
  if (type === 'predictive') return null;
  // console.log(type, 'ttt');

  const [filtersVisible, setFiltersVisible] = useState(true);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const FilterGroup = ({title, options}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [height, setHeight] = useState('auto');
    const listRef = useRef(null); // Ref to get the DOM element

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
      const listElement = listRef.current;
      if (listElement) {
        if (isOpen) {
          setHeight(`${listElement.scrollHeight}px`);
        } else {
          setHeight('0px');
        }
      }
    }, [isOpen]);

    return (
      <div className="filter-group">
        <button
          className={`filter-group-heading ${isOpen ? 'open' : 'closed'}`}
          onClick={toggleAccordion}
          type="button"
          aria-expanded={isOpen}
        >
          <span>{title}</span>
          <span className="filter-group-chevron">
            <ChevronRight />
          </span>
        </button>

        <ul
          ref={listRef} // Attach the ref to the ul element
          className={`filter-group-list filter-group-list-${title} ${
            isOpen ? 'open' : 'closed'
          }`}
          style={{
            height: height,
            overflow: 'hidden',
          }}
        >
          {options.map((option, index) => (
            <li key={index} className="filter-group-item">
              <input
                type="checkbox"
                id={`filter-${title}-${index}`}
                name={`filter-${title}`}
                value={option}
                className="filter-input"
              />
              <label
                htmlFor={`filter-${title}-${index}`}
                className="filter-label"
                aria-label={option}
              >
                {option}

                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  className="svg-filter-icon"
                  viewBox="0 0 20 20"
                >
                  <path
                    className="filter-checkbox-border"
                    stroke="currentColor"
                    d="M.5.5h19v19H.5z"
                  ></path>
                  <path
                    className="filter-checkbox-inner"
                    fill="#000"
                    d="M5 5h10v10H5z"
                  ></path>
                </svg>

                <RotateCcw
                  size={12}
                  strokeWidth={2.25}
                  className="filter-rotate-icon"
                />
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // const SearchResults = () => {
  //   const results = [
  //     {
  //       title: 'The Marfa Suede Ankle Boot',
  //       price: '£396.00',
  //       image:
  //         '//pipeline-theme-fashion.myshopify.com/cdn/shop/products/MarfaSuedeAnkleBoot_CHAU001_Saddle-Brown_1.jpg?v=1639855981&width=70',
  //       link: '/products/marfa-suede-ankle-boot-brown',
  //     },
  //     {
  //       title: 'The Marfa Suede Ankle Boot',
  //       price: '£396.00',
  //       image:
  //         '//pipeline-theme-fashion.myshopify.com/cdn/shop/products/MarfaSuedeAnkleBoot_CHAU001_Antler_1.jpg?v=1639855989&width=70',
  //       link: '/products/marfa-suede-ankle-boot-tan',
  //     },
  //     // Add more results as needed
  //   ];

  //   return (
  //     <>
  //       {/* // <div className="search-results"> */}
  //       {results.map((result, index) => (
  //         <>
  //           <div key={index} className="search-result-item">
  //             <div className="search-result-image">
  //               <a href={result.link} title={result.title}>
  //                 <div className="relative block w-full h-full overflow-hidden aspect-[0.75]">
  //                   <img
  //                     src={result.image}
  //                     alt={result.title}
  //                     className="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
  //                     style={{objectPosition: 'center center'}}
  //                   />
  //                 </div>
  //               </a>
  //             </div>
  //             <div className="search-result-text">
  //               <p className="search-result-title">
  //                 <a href={result.link}>{result.title}</a>
  //               </p>
  //               <p className="search-result-price">{result.price}</p>
  //             </div>
  //           </div>
  //           <hr />
  //         </>
  //       ))}
  //       {/* </div> */}
  //     </>
  //   );
  // };

  return (
    <section
      className="search-page-wrapper fixed_padding_page"
      style={{paddingTop: '36px', paddingBottom: '36px'}}
    >
      <div className="search-page-heading">
        <SearchForm className="search-bar">
          {({inputRef}) => (
            <div className="search-input-group">
              <input
                name="q"
                id="search-input"
                placeholder="Search our store"
                ref={inputRef}
                type="search"
                className="search-input"
              />
              {/* {console.log(inputRef.current.value.length , "newww")}    */}
              {/* {console.log(inputRef.current.value, 'newww')} */}

              <div className="search-input-buttons">
                {inputRef.current !== null &&
                  inputRef.current.value.length > 0 && (
                    <button
                      type="reset"
                      className="px-5 h-12 hover:cursor-pointer"
                      aria-label="Reset"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                <button type="submit" className="search-submit-button">
                  Search
                </button>
              </div>
            </div>
          )}
        </SearchForm>
      </div>
      {console.log(result)}
      {term.length !== 0 && (
        <>
          <div className="search-query-note">
            {result.items.products.nodes.length !== 0 ? (
              <p className="search-query-text">
                Results for <strong>{term}</strong>
              </p>
            ) : (
              <p className="search-query-text">
                No results for <strong>{term}</strong>
              </p>
            )}
          </div>

          {result.items.products.nodes.length > 0 && (
            <>
              <nav className="collection-navigation">
                <div className="collection-navigation-buttons">
                  <button
                    className="collection-filters-toggle"
                    onClick={toggleFilters}
                    aria-expanded={filtersVisible}
                  >
                    <span>{filtersVisible ? 'Hide filters' : 'Filter'}</span>
                    {/* <span className='filter_count_badge'>1</span> */}
                    <svg
                      className="svg-search-stroke"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      strokeWidth={2}
                    >
                      <path d="M21 7H3M18 12H6M15 17H9" />
                    </svg>
                  </button>
                </div>
              </nav>

              {/* <div className='collection-filter-active-wrapper'>
            <div className='collection-filter-active'>
              
              <span>X</span>
            </div>
            <div className='collection-filter-active-count'>
              <strong></strong>
              result
            </div>
          </div> */}

              <div className="collection-content">
                <div
                  className={`collection-filters-wrapper ${
                    filtersVisible ? 'visible' : 'hidden'
                  }`}
                >
                  <div className="collection-filters-outer">
                    <div className="collection-filters-header">
                      <div className="collection-filters-title-div">
                        <p className="collection-filters-title">Filter</p>
                      </div>
                      <button
                        className="filters-close-btn"
                        onClick={toggleFilters}
                      >
                        <X className="w-5 h-5 aside_close_btn_effect" />
                      </button>
                    </div>
                    <div className="collection-filters-inner">
                      <form className="filters-form">
                        {console.log(result, 'result searchh')}
                        <FilterGroup
                          title="Product type"
                          options={['Dresses', 'Tops', 'Bottoms', 'Outerwear']}
                        />
                        <FilterGroup
                          title="Color"
                          options={[
                            'brown',
                            'green',
                            'grey',
                            'stripe',
                            'white',
                          ]}
                        />
                        <FilterGroup
                          title="Size"
                          options={[
                            'XS',
                            'S',
                            'M',
                            'L',
                            '6',
                            '7',
                            '8',
                            '9',
                            '10',
                          ]}
                        />
                        <FilterGroup
                          title="Fabric"
                          options={[
                            'cashmere',
                            'cotton',
                            'sued',
                            'vegan leather',
                          ]}
                        />
                        <FilterGroup
                          title="Fit"
                          options={['boxy', 'original']}
                        />
                        <FilterGroup
                          title="Availability"
                          options={['In stock', 'Out of stock']}
                        />
                      </form>
                    </div>
                  </div>
                </div>

                <div className="collection-products">
                  <SearchResults result={result} term={term}>
                    {({articles, pages, products, term}) => (
                      <div className="search-results-product-container">
                        <SearchResults.Products
                          products={products}
                          term={term}
                        />

                        {/* <SearchResults.Pages pages={pages} term={term} /> */}
                        {/* <SearchResults.Articles articles={articles} term={term} /> */}
                      </div>
                    )}
                  </SearchResults>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
  /** @type {LoaderReturnData} */
  const {type, term, result, error} = useLoaderData();
  if (type === 'predictive') return null;

  return (
    <>
      {/* <div className="search">
        <h1>Search</h1>
        <SearchForm>
          {({inputRef}) => (
            <>
              <input
                defaultValue={term}
                name="q"
                placeholder="Search…"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button type="submit">Search</button>
            </>
          )}
        </SearchForm>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {!term || !result?.total ? (
          <SearchResults.Empty />
        ) : (
          <SearchResults result={result} term={term}>
            {({articles, pages, products, term}) => (
              <div>
                <SearchResults.Products products={products} term={term} />
                <SearchResults.Pages pages={pages} term={term} />
                <SearchResults.Articles articles={articles} term={term} />
              </div>
            )}
          </SearchResults>
        )}
        <Analytics.SearchView
          data={{searchTerm: term, searchResults: result}}
        />
      </div> */}

      <SearchPageContent />
    </>
  );
}

/**
 * Regular search query and fragments
 * (adjust as needed)
 */

// const SEARCH_PRODUCT_FRAGMENT = `#graphql
//   fragment SearchProduct on Product {
//     # ... existing fields
//     productType
//     options {
//       name
//       values
//     }
//     adjacentVariants{
//       selectedOptions{
//         name
//         value
//       }
//       }
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//       maxVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     # ... rest of existing fragment
//   }
// `;

const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    options{
      name
      optionValues{
        name
        firstSelectableVariant{
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
            width
            height
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
        }
        swatch{
          color
          image{
            previewImage{
              url
            }   
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
`;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Regular search fetcher
 * @param {Pick<
 *   LoaderFunctionArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<RegularSearchReturn>}
 */
async function regularSearch({request, context}) {
  console.log(context, 'cccc');
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(url.searchParams.get('q') || '');

  // Search articles, pages, and products for the `q` term
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
`;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
`;

/**
 * Predictive search fetcher
 * @param {Pick<
 *   ActionFunctionArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<PredictiveSearchReturn>}
 */
async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 25);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

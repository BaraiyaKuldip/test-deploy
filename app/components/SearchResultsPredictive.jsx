import {Link, useFetcher , useNavigate} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
} from '~/lib/search';
import {useAside} from './Aside';
import {ChevronRight} from 'lucide-react';
export const SEARCH_ENDPOINT = '/search';

/**
 * Component that renders predictive search results
 * @param {SearchResultsPredictiveProps}
 * @return {React.ReactNode}
 */
export function SearchResultsPredictive({children}) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  let tempTime = 10;
  useEffect(() => {
    let elements = document.getElementsByClassName('animation-item');
    // console.log(elements, 'itm');

    for (let i = 0; i < elements.length; i++) {
      tempTime = tempTime + 90;
      // console.log(elements[i].style , "style"); // Do something with each element
      elements[i].style.animationDelay = tempTime + 'ms';
      // console.log(elements[i].style.animationDelay);
      // console.log(tempTime + "ms");
      // console.log(elements.length);
    }
  });
    const navigate = useNavigate();
    
  

  function goToSearch() {
      const term = inputRef?.current?.value;
      navigate(SEARCH_ENDPOINT + (term ? `?q=${term}` : ''));
      aside.close();
    }

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    goToSearch,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

/**
 * @param {PartialPredictiveSearchResult<'articles'>}
 */
function SearchResultsPredictiveArticles({term, articles, closeSearch}) {
  if (!articles.length) return null;

  return (
    <div className="predictive-search-result" key="articles">
      <div className="predictive-search-result-heading">
        <h5 className="predictive-search-result-title">Articles</h5>
        <span className="count_badge">{articles.length}</span>
      </div>
      <ul>
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <div
              className="predictive-search-result-item animation-item"
              key={article.id}
            >
              <Link onClick={closeSearch} to={articleUrl}>
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={50}
                    height={50}
                  />
                )}
                <div>
                  <s>{article.title}</s>
                </div>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * @param {PartialPredictiveSearchResult<'collections'>}
 */
function SearchResultsPredictiveCollections({term, collections, closeSearch}) {
  if (!collections.length) return null;

  return (
    <div className="predictive-search-result" key="collections">
      <div className="predictive-search-result-heading">
        <h5 className="predictive-search-result-title">Collections</h5>
        <span className="count_badge">{collections.length}</span>
      </div>
      <ul>
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <div
              className="predictive-search-result-item animation-item"
              key={collection.id}
            >
              <p className="search-result-other-title">
                <Link onClick={closeSearch} to={collectionUrl}>
                  {collection.title}
                </Link>
              </p>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * @param {PartialPredictiveSearchResult<'pages'>}
 */
function SearchResultsPredictivePages({term, pages, closeSearch}) {
  if (!pages.length) return null;

  return (
    <div className="predictive-search-result" key="pages">
      <div className="predictive-search-result-heading">
        <h5 className="predictive-search-result-title">Pages</h5>
        <span className="count_badge">{pages.length}</span>
      </div>
      <ul>
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <div
              className="predictive-search-result-item animation-item"
              key={page.id}
            >
              <p className="search-result-other-title">
                <Link onClick={closeSearch} to={pageUrl}>
                  {page.title}
                </Link>
              </p>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * @param {PartialPredictiveSearchResult<'products'>}
 */
function SearchResultsPredictiveProducts({term, products, closeSearch}) {
  if (!products.length) return null;

  return (
    <div className="predictive-search-result" key="products">
      <div className="predictive-search-result-heading">
        <h5 className="predictive-search-result-title">Products</h5>
        <span className="count_badge">{products.length}</span>
      </div>

      <ul>
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <div
              className="predictive-search-result-item animation-item"
              key={product.id}
            >
              <Link to={productUrl} onClick={closeSearch}>
                {image && (
                  <Image
                    alt={image.altText ?? ''}
                    src={image.url}
                    height="auto"
                    width={70}
                    className="search-result-product-img"
                  />
                )}
                <div>
                  <p className="search-result-product-title">{product.title}</p>
                  <p>{price && <Money data={price} />}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * @param {PartialPredictiveSearchResult<'queries', never> & {
 *   queriesDatalistId: string;
 * }}
 */
function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
  closeSearch,
}) {
  if (!queries.length) return null;

  return (
    <div className="predictive-search-result" key="products">
      <div className="predictive-search-result-heading">
        <h5 className="predictive-search-result-title">Suggetions</h5>
        <span className="count_badge">{queries.length}</span>
      </div>

      <ul>
        {queries.map((suggestion) => {
          if (!suggestion) return null;
          // console.log(suggestion, 'sugg');
          return (
            <div
              className="predictive-search-result-item animation-item"
              key={queriesDatalistId}
            >
              <p className="search-result-other-title">
                <Link to={'/search'} onClick={closeSearch}>
                  {suggestion.text}
                </Link>
              </p>
            </div>
          );
        })}
      </ul>
    </div>
    // <datalist id={queriesDatalistId}>
    //   {queries.map((suggestion) => {
    //     console.log(suggestion , 'suggestion');
    //     if (!suggestion) return null;
    //     return <option key={suggestion.text} value={suggestion.text} />;
    //   })}
    // </datalist>
  );
}

/**
 * @param {{
 *   term: React.MutableRefObject<string>;
 * }}
 */
function SearchResultsPredictiveEmpty({term , closeSearch , goToSearch}) {
  if (!term.current) {
    return null;
  }

  return (
    <>
      <div className="bg-white fixed_padding_page pb-7.5 ">
        <div>
          <p className=" text-center pb-2.5">No results for {term.current}</p>
        </div>

        <div>
          <button className="predictive-search-go-btn">
            <Link to={`${SEARCH_ENDPOINT}` + `?q=${term.current}`}>
            <div className="flex items-center justify-between">
              <span>search for &ldquo;{term.current}&rdquo;</span>
              <span className="ml-1">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 * @return {UsePredictiveSearchReturn}
 */
function usePredictiveSearch() {
  const fetcher = useFetcher({key: 'search'});
  const term = useRef('');
  const inputRef = useRef(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}

/** @typedef {PredictiveSearchReturn['result']['items']} PredictiveSearchItems */
/**
 * @typedef {{
 *   term: React.MutableRefObject<string>;
 *   total: number;
 *   inputRef: React.MutableRefObject<HTMLInputElement | null>;
 *   items: PredictiveSearchItems;
 *   fetcher: Fetcher<PredictiveSearchReturn>;
 * }} UsePredictiveSearchReturn
 */
/**
 * @typedef {Pick<
 *   UsePredictiveSearchReturn,
 *   'term' | 'total' | 'inputRef' | 'items'
 * > & {
 *   state: Fetcher['state'];
 *   closeSearch: () => void;
 *   goToSearch: () => void;
 * }} SearchResultsPredictiveArgs
 */
/**
 * @typedef {Pick<PredictiveSearchItems, ItemType> &
 *   Pick<SearchResultsPredictiveArgs, ExtraProps>} PartialPredictiveSearchResult
 * @template {keyof PredictiveSearchItems} ItemType
 * @template {keyof SearchResultsPredictiveArgs} [ExtraProps='term' | 'closeSearch']
 */
/**
 * @typedef {{
 *   children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
 * }} SearchResultsPredictiveProps
 */

/** @template T @typedef {import('@remix-run/react').Fetcher<T>} Fetcher */
/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */

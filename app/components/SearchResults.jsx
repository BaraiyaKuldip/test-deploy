import {Link} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams} from '~/lib/search';

/**
 * @param {Omit<SearchResultsProps, 'error' | 'type'>}
 */
export function SearchResults({term, result, children}) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;


import { useState, useCallback, useEffect } from "react";

const PaginationBoxX = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  queryParam,
  pageRangeDisplayed = 5
}) => {
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setLocalCurrentPage(newPage);
        onPageChange(newPage, queryParam);
      }
    },
    [totalPages, onPageChange, queryParam]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        handlePageChange(localCurrentPage - 1);
      } else if (e.key === "ArrowRight") {
        handlePageChange(localCurrentPage + 1);
      }
    },
    [localCurrentPage, handlePageChange]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const leftSiblingIndex = Math.max(localCurrentPage - Math.floor(pageRangeDisplayed / 2), 1);
    const rightSiblingIndex = Math.min(
      leftSiblingIndex + pageRangeDisplayed - 1,
      totalPages
    );

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i);
    }

    if (leftSiblingIndex > 1) {
      pageNumbers.unshift("...");
      pageNumbers.unshift(1);
    }

    if (rightSiblingIndex < totalPages) {
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const renderPageButton = (pageNumber, index) => {
    const isCurrentPage = pageNumber === localCurrentPage;
    const isEllipsis = pageNumber === "...";

    if (isEllipsis) {
      return (
        <span
          key={`ellipsis-${index}`}
          className="px-3 py-2 text-gray-500"
          aria-hidden="true"
        >
          ...
        </span>
      );
    }

    return (
      <button
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
        className={`px-3 py-2 mx-1 ${
          isCurrentPage
            ? " bg-transparent  text-black "
            : "bg-transparent text-gray-700 hover:border-b border-black"
        } transition-colors duration-200 ease-in-out    disabled:cursor-not-allowed `} 
        
        aria-label={`Page ${pageNumber}`}
        aria-current={isCurrentPage ? "page" : undefined}
      >
        <span className='hover:border-b border-black'>
        {pageNumber}
        </span>
      </button>
    );
  };

  return (
    <nav
      className="page-nav flex items-center justify-center w-75 rounded"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <button
        onClick={() => handlePageChange(localCurrentPage - 1)}
        disabled={localCurrentPage === 1}
        className="pagination-left-btn p-2 h-full disabled:opacity-50 disabled:cursor-not-allowed "
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center h-10 border-y border-[rgba(66,66,66,0.2)]">
        {getPageNumbers().map((pageNumber, index) => renderPageButton(pageNumber, index))}
      </div>

      <button
        onClick={() => handlePageChange(localCurrentPage + 1)}
        disabled={localCurrentPage === totalPages}
        className="pagination-right-btn p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5"/>
      </button>
      
    </nav>
  );
};



import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react';

const PaginationBox = ({
  currentPage,
  totalPages,
  query,
  basePath = '/search',
}) => {
  const generatePagesArray = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push('ellipsis');

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) end = 3;
    else if (currentPage >= totalPages - 2) start = totalPages - 2;

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('ellipsis');

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const getHref = (page) => {
    return `${basePath}?page=${page}&q=${encodeURIComponent(query)}`;
  };

  const pages = generatePagesArray();

  return (
    <ul className="flex items-center space-x-2">
      {/* Previous Arrow */}
      <li
        className={`flex items-center ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {currentPage === 1 ? (
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              strokeLinecap="square"
              strokeLinejoin="arcs"
              aria-hidden="true"
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </span>
        ) : (
          <a href={getHref(currentPage - 1)} title="Previous">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              strokeLinecap="square"
              strokeLinejoin="arcs"
              aria-hidden="true"
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </a>
        )}
      </li>

      {/* Page Numbers */}
      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <li key={`ellipsis-${index}`} className="mx-1">
            <span>…</span>
          </li>
        ) : (
          <li
            key={page}
            className={`mx-1 ${
              page === currentPage
                ? 'font-bold text-blue-500'
                : 'text-gray-700 hover:text-blue-500'
            }`}
          >
            {page === currentPage ? (
              <span>{page}</span>
            ) : (
              <a href={getHref(page)} title="">
                {page}
              </a>
            )}
          </li>
        ),
      )}

      {/* Next Arrow */}
      <li
        className={`flex items-center ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        }`}
      >
        {currentPage === totalPages ? (
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              strokeLinecap="square"
              strokeLinejoin="arcs"
              aria-hidden="true"
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        ) : (
          <a href={getHref(currentPage + 1)} title="Next">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              strokeLinecap="square"
              strokeLinejoin="arcs"
              aria-hidden="true"
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        )}
      </li>
    </ul>
  );
};

export default PaginationBox;

/**
 * @param {PartialSearchResult<'articles'>}
 */
function SearchResultsArticles({term, articles}) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}

/**
 * @param {PartialSearchResult<'pages'>}
 */
function SearchResultsPages({term, pages}) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}

/**
 * @param {PartialSearchResult<'products'>}
 */
function SearchResultsProducts({term, products}) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <Pagination connection={products}>
      
      {({nodes, isLoading, NextLink, PreviousLink}) => {
        const ItemsMarkup = nodes.map((product) => {
          // console.log(product, 'pppp');
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term,
          });
          
          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;

          return (
            <>
              <div className="search-result-item" key={product.id}>
                {image && (
                  <div className="search-result-image">
                    <Link prefetch="intent" to={productUrl}>
                      <Image
                        data={image}
                        alt={product.title}
                        width={70}
                        height={93}
                        className="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                        style={{objectPosition: 'center center'}}
                      />
                    </Link>
                  </div>
                )}
                {price && (
                  <div className="search-result-text">
                    <p className="search-result-title">
                      <Link prefetch="intent" to={productUrl}>
                        {product.title}
                      </Link>
                    </p>
                    <p className="search-result-price">
                      <Money data={price} />
                    </p>
                  </div>
                )}

                {/* <Link prefetch="intent" to={productUrl}>
                {image && <Image data={image} alt={product.title} width={50} />}
                <div>
                  <p>{product.title}</p>
                  <small>{price && <Money data={price} />}</small>
                </div>
              </Link> */}
              </div>
              <hr />
            </>
          );
        });

        const PageInfoData = products;
        // console.log(PageInfoData, 'pageInfo');

        return (
          <div>
            <div>
              <PreviousLink>
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
            </div>
            <div>
              {ItemsMarkup}
              
            </div>
            <div>
              <NextLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <span>
                    <PaginationBoxX onPageChange={console.log("page changed..")} currentPage={1} totalPages={12} pageRangeDisplayed={3}/>
                  </span>
                )}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="search-query-note">
      <p className="search-query-text">
        Results for <strong></strong>
      </p>
    </div>
  );
}

/** @typedef {RegularSearchReturn['result']['items']} SearchItems */
/**
 * @typedef {Pick<
 *   SearchItems,
 *   ItemType
 * > &
 *   Pick<RegularSearchReturn, 'term'>} PartialSearchResult
 * @template {keyof SearchItems} ItemType
 */
/**
 * @typedef {RegularSearchReturn & {
 *   children: (args: SearchItems & {term: string}) => React.ReactNode;
 * }} SearchResultsProps
 */

/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */

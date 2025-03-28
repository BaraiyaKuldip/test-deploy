import React from 'react';
import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import SwiperComponent from './ProductCard';
import {Link} from '@remix-run/react';
import {AddToCartButton} from './AddToCartButton';
import {Money} from '@shopify/hydrogen';
import {ProductImage} from './ProductImage';
import {Image} from '@shopify/hydrogen';

export default function ProductCardQuickAdd({
  product,
  productIndex,
  collectionIndex,
}) {
  return (
    <>
    {console.log(product , "products on quick add page")}
      <div key={productIndex} className="collection-tabs-content embla__slide">
        {/* {console.log(product.images, 'product map')} */}
        <div className="tabs-products-items-container ">
          <div className="tabs-products-items-error"></div>
          <Link
            to={`products/${product.adjacentVariants.handle}`}
            className="tabs-products-a-tag"
          >
            <div className="tabs-products-pagination"></div>
            <div className="tabs-products-images aspect-[0.9]">
              <SwiperComponent
                images={product.images}
                collectionIndex={collectionIndex}
                productIndex={productIndex}
              />
            </div>
          </Link>

          {!product?.selectedOrFirstAvailableVariant?.availableForSale && (
            <div className="tabs-product-sold-out-btn">Sold Out</div>
          )}

          <div className="tabs-product-variants-box min-h-[40px] md:min-h-[48px]">
            <div className="tabs-product-variants-box-wrapper">
              <div className="h-full w-full">
                <button
                  className={`tabs-product-variants-btn ${
                    product?.options[0].name !== 'Title'
                      ? 'variants_available'
                      : ''
                  }`}
                >
                  {/* <span>Quick Add</span> */}
                  <AddToCartButton
                    disabled={
                      !product?.selectedOrFirstAvailableVariant ||
                      !product?.selectedOrFirstAvailableVariant
                        ?.availableForSale
                    }
                    onClick={() => {
                      open('cart');
                    }}
                    lines={
                      product?.selectedOrFirstAvailableVariant
                        ? [
                            {
                              merchandiseId:
                                product?.selectedOrFirstAvailableVariant.id,
                              quantity: 1,
                            },
                          ]
                        : []
                    }
                  >
                    {/* {console.log(
                      product.selectedOrFirstAvailableVariant,
                      'product selected first available variant',
                    )} */}
                    <span
                      className={` cursor-pointer ${
                        product?.selectedOrFirstAvailableVariant
                          ?.availableForSale
                          ? 'opacity-100'
                          : 'opacity-30'
                      }`}
                    >
                      {product?.options[0].name !== 'Title'
                        ? 'Quick Add'
                        : 'Add To Cart'}
                    </span>
                  </AddToCartButton>
                </button>
                {/* <div className="tabs-product-variants"> */}

                {product?.options[0].name !== 'Title' && (
                  <div className="ket_option_variants">
                    <div
                      className="variant-selects flex flex-row items-center flex-wrap justify-center space-x-r2 py-r4 md:gap-y-r2 cursor-pointer"
                      id="variant-selects-template"
                    >
                      {/* {console.log(
                        product?.options[0].name === 'Title',
                        'psops',
                      )} */}
                      {product?.options.map((option) => (
                        <>
                          {option.name === 'Size' && (
                            <>
                              {/* {console.log(product, 'psops')} */}

                              {option.optionValues.map(
                                (optionValue, optionValueIndex) => {
                                  
                                  return (
                                    <>
                                      <fieldset
                                        key={optionValueIndex}
                                        className="product-form__input product-form__input--pill h-12"
                                      >
                                        <div className="w-full h-full">
                                          <form
                                            method="post"
                                            action="/cart/add"
                                            onSubmit={console.log(
                                              'selected input ',
                                            )}
                                            className="form w-full h-full"
                                            encType="multipart/form-data"
                                            noValidate
                                          >
                                            <input
                                              type="hidden"
                                              name="form_type"
                                              value="product"
                                            />
                                            <input
                                              type="hidden"
                                              name="utf8"
                                              value="✓"
                                            />
                                            <input
                                              type="hidden"
                                              name="id"
                                              value="46910603919600"
                                              className="product-variant-id"
                                            />
                                            <div className="product-form__buttons w-full h-full">
                                              <button
                                                type="submit"
                                                name="add"
                                                value={optionValue.name}
                                                className="product-form__submit button button--full-width group-option-btn h-full w-full cursor-pointer"
                                              >
                                                <span className="tabs-variant-select-btn inline-block whitespace-nowrap text-button-contrast px-r4 py-r4 group-hover-option-button-text-button-contrast group-hover-option-button-bg-button-contrast-5">
                                                  {optionValue.name}
                                                </span>
                                                <div className="loading__spinner hidden">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="spinner"
                                                    viewBox="0 0 66 66"
                                                  >
                                                    <circle
                                                      strokeWidth="6"
                                                      cx="33"
                                                      cy="33"
                                                      r="30"
                                                      fill="none"
                                                      className="path"
                                                    ></circle>
                                                  </svg>
                                                </div>
                                              </button>
                                            </div>
                                            <input
                                              type="hidden"
                                              name="product-id"
                                              value="9144418861296"
                                            />
                                            <input
                                              type="hidden"
                                              name="section-id"
                                              value="template--18996264501488__featured_collection_tabs_egEfMA"
                                            />
                                          </form>
                                        </div>
                                      </fieldset>
                                    </>
                                  );
                                },
                              )}

                              {/* <a
                                className="ket_extar_variants"
                                href="/products/the-lori-off-shoulder"
                              >
                                2+
                              </a> */}
                            </>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                )}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="tabs-products-info text-left">
          <a href="#">
            <p className="visually-hidden">{product.title}</p>
            <div className="tabs-products-title-wrapper">
              <p className="tabs-products-title">{product.title}</p>
            </div>

            <div className="tabs-products-price-wrapper">
              {product.selectedOrFirstAvailableVariant.selectedOptions.map(
                (selectedOption) => (
                  <>
                    <span
                      className={`tabs-products-price-cutline`}
                      style={{
                        display: `${
                          selectedOption.name === 'Color' ? 'block' : 'none'
                        }`,
                      }}
                    >
                      {selectedOption.name === 'Color' && (
                        <>{selectedOption.value}</>
                      )}
                    </span>
                  </>
                ),
              )}
              {/* color */}
              {/* {console.log(
                product.selectedOrFirstAvailableVariant.selectedOptions,
                'product selected or first',
              )} */}
              <span className="tabs-products-price">
                {product?.selectedOrFirstAvailableVariant?.price ? (
                  <Money
                    data={product?.selectedOrFirstAvailableVariant?.price}
                  />
                ) : null}
              </span>
            </div>

            {!product?.selectedOrFirstAvailableVariant?.availableForSale && (
              <p className="tabs-products-sold-out">
                <em>Sold Out</em>
              </p>
            )}

            {product.options.map((option) => (
              <>
                {console.log(option, 'optionss')}
                {option.name === 'Color' && option.optionValues.length > 1 && (
                  <>
                    <div className="tabs-products-swatch-main-container">
                      <div className="tabs-products-swatch-sub-container">
                        <p className="tabs-products-swatch-title">
                          {option.optionValues.length} Colors Available
                        </p>
                        <div className="tabs-products-swatch-main-wrapper">
                          <div className="tabs-products-swatch-sub-wrapper">
                            <div className="tabs-products-swatch-inner">
                              {option.optionValues.map((optionValue) => (
                                <>
                                  {console.log(optionValue, 'option valueee')}
                                  <div
                                    className={`tabs-products-swatch-holder ${
                                      optionValue.firstSelectableVariant
                                        .availableForSale
                                        ? ''
                                        : 'sold-out'
                                    }`}
                                  >
                                    <a
                                      href="#"
                                      className="tabs-products-swatch-link"
                                    >
                                      <div className="tabs-products-swatch">
                                        <div className="tabs-products-swatch-size">
                                          {optionValue.swatch !== null &&
                                            optionValue.swatch.image
                                              .previewImage !== null && (
                                              <div className="relative block w-full h-full overflow-hidden aspect-[1.0]">
                                                {/* <ProductImage product={ optionValue.swatch.image.previewImage}/> */}
                                                {/* {console.log(optionValue.swatch.image.previewImage.url ,"urll")} */}
                                                <Image
                                                  data={
                                                    optionValue.swatch.image
                                                      .previewImage
                                                  }
                                                  class="block overflow-hidden w-full h-full object-cover transition-opacity duration-300 ease-linear"
                                                  height="35"
                                                  width="26"
                                                  loading="lazy"
                                                  fetchPriority="low"
                                                  style={{
                                                    objectPosition:
                                                      'center center',
                                                  }}
                                                />

                                                {/* <img src={ optionValue.swatch.image.previewImage.url} alt={optionValue.swatch.image.previewImage.altText} height={35} width={26} style={{objectPosition:"center center"}}/> */}

                                                {/* {optionValue.swatch.image.previewImage !== undefined && (
                                                  <>
                                                    <span>
                                                      {
                                                        optionValue.swatch
                                                          .previewImage.altText
                                                      }
                                                    </span>
                                                    <span>
                                                      {
                                                        optionValue.swatch
                                                          .previewImage.url
                                                      }
                                                      
                                                    </span>
                                                  </>
                                                )} */}
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </a>
                                  </div>
                                </>
                              ))}
                              {option.optionValues.length > 5 && (
                                  <>
                                  <a href="#" className='  tabs-products-swatch-more-links'>
                                    {option.optionValues.length - 5}+
                                  </a>
                                  </>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
          </a>
        </div>
      </div>
    </>
  );
}

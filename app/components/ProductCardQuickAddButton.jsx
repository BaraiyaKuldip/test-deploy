  import React, {useState, useRef, useEffect} from 'react';
  import {AddToCartButton} from './AddToCartButton';
  import {useAside} from './Aside';
  import {useNavigate} from '@remix-run/react';
  import {
    getAdjacentAndFirstAvailableVariants,
    getProductOptions,
    useOptimisticVariant,
  } from '@shopify/hydrogen';

  const QuickAddButtonForm = ({
    size,
    soldOut,
    color,
    variant,
    product,
    selectedOption,
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const {open} = useAside();

    const handleAddToCart = (e) => {
      if (soldOut) return;
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 1500);
      }, 500);
    };

    return (
      <div className="product-add-button-form">
        <AddToCartButton
          disabled={!variant || !variant.availableForSale}
          onClick={() => {
            setTimeout(() => {
              open('cart');
            }, 1000);
          }}
          lines={[
            {
              merchandiseId: variant.id,
              quantity: 1,
            },
          ]}
        >
          <button
            onClick={handleAddToCart}
            className={`
              add-to-cart-button
              ${isSuccess ? 'has-success' : ''}
              ${isLoading ? 'is-loading' : ''}
              ${soldOut ? 'is-sold-out' : ''}
            `}
            disabled={soldOut}
            aria-busy={isLoading}
            title={soldOut ? `Add ${size} to Cart - Sold Out` : `Add ${size} to Cart`}
            aria-label={soldOut ? `Add ${size} to Cart - Sold Out` : `Add ${size} to Cart`}
          >
            <span className="button-ready-state">{size}</span>
            <span className="button-loading-state">
              <svg height="18" width="18" className="loading-svg">
                <circle r="7" cx="9" cy="9"></circle>
                <circle className="loading-circle" r="7" cx="9" cy="9"></circle>
              </svg>
            </span>
            <span className="button-complete-state">&nbsp;</span>
          </button>
        </AddToCartButton>
      </div>
    );
  };

  const ProductCardQuickAddButton = ({
    product,
    productOptions,
    selectedVariant,
    currentVariant,
  }) => {
    const navigate = useNavigate();
    const {open} = useAside();

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const openMenu = () => {
      setIsOpen(true);
    };
    const closeMenu = () => {
      setIsOpen(false);
    };

    return (
      <div className="quick-actions-toolbar">
        <button
          className={`quick-add-button ${isOpen ? 'is-open' : ''} ${
            product?.options[0].name !== 'Title' ? `'variants_available' ${currentVariant.availableForSale ? 'opacity-100' : 'opacity-60'}` : ''
          }`}
          title="Quick add"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={openMenu}
          onMouseOver={openMenu}
          ref={buttonRef}
          aria-label="Quick add"
        >
          <span className={`button-text`}>
            <AddToCartButton
              disabled={
                product?.options[0].name !== 'Title' || !product?.availableForSale
              }
              onClick={() => {
                open('cart');
              }}
              lines={
                currentVariant
                  ? [
                      {
                        merchandiseId: currentVariant.id,
                        quantity: 1,
                      },
                    ]
                  : []
              }
            >
              {console.log(currentVariant, 'current variant quick add page')}
              <span
                className={`desktop-text h-full w-full flex items-center justify-center cursor-pointer `}
              >
                {product?.options[0].name !== 'Title'
                  ? 'Quick Add'
                  : 'Add To Cart'}
              </span>

              <span className="mobile-text" aria-hidden="true" onClick={openMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="cart-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.5 16.5H5.715l1.082-4.195-2.126-7.456L3.715 1.5H1.5m5.22 10h11.702l3.002-6.13s.428-.87-.745-.87H4.5m2 16.986a1 1 0 1 0 2 .028 1 1 0 0 0-2-.028Zm11 .014a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"></path>
                </svg>
              </span>
            </AddToCartButton>
          </span>
        </button>

        {product?.options[0].name !== 'Title' && (
          <>
            {(
              <div
                className={`quick-add-menu-popover `}
                role="popover"
                ref={menuRef}
              >
                <div
                  className={`quick-add-menu-container ${
                    isOpen ? 'is-visible' : 'is-hide'
                  }`}
                  onMouseLeave={closeMenu}
                >
                  <div
                    className={`quick-add-menu-content ${
                      isOpen ? 'is-visible' : 'is-hide'
                    }`}
                    style={{opacity: `${!product.availableForSale ? 1 : 0.6}`}}
                  >
                    <div className="quick-add-toolbar" role="toolbar">
                      {product.variants.nodes.map((variant) => (
                        <>
                          {variant.selectedOptions.map((selectedOption) => {
                            const variantColor = variant.selectedOptions.find(
                              (opt) => opt.name === 'Color',
                            )?.value;

                            const selectedColor =
                              currentVariant.selectedOptions.find(
                                (opt) => opt.name === 'Color',
                              )?.value;

                            return (
                              <>
                                {variantColor === selectedColor &&
                                  selectedOption.name === 'Size' && (
                                    <>
                                      <QuickAddButtonForm
                                        key={variant.id}
                                        size={selectedOption.value}
                                        soldOut={!variant.availableForSale}
                                        color={variantColor}
                                        variant={variant} // Pass the actual variant here
                                        product={product}
                                      />
                                    </>
                                  )}
                              </>
                            );
                          })}
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  export default ProductCardQuickAddButton;

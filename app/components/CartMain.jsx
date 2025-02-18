import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);
  // console.log(originalCart.totalQuantity)
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className =  `'cart-main ' ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity > 0;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className=' cart_empty'>
      <div className='empty_cart_div '>
        <div className='cart_empty_top'>
          <div className='w-full max-w-[1450px]'>
          <p className='cart_empty_font'>
            Your cart is Empty.
          </p>
          <div className='empty_cart_overlay'></div>
          </div>
        </div>
        <a href="/collections" className='flex justify-center items-center flex-col -mt-20 pb-5 cart_circle_a'>
          <div className='empty_cart_circle'>
            <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
              <circle cx="7.5" cy="18.5" r="1.5" fill="#000000"/>
              <circle cx="16.5" cy="18.5" r="1.5" fill="#000000"/>
              <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l.6 3m0 0L7 15h10l2-7H5.6z"/>
            </svg>
          </div>
          <p className='empty_cart_continue_link'>Continue shopping</p>
        </a>
      </div>
      
      {/* <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link> */}
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */

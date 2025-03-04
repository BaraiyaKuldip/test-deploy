import { createContext, useContext, useEffect, useState } from 'react';
import { User, X } from 'lucide-react';

/**
 * A top bar component with Overlay
 * @example
 * ```jsx
 * <TopSide type="search" heading="SEARCH">
 *   <input type="search" />
 *   ...
 * </TopSide>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   type: TopSideType;
 *   heading: React.ReactNode;
 * }}
 */
export function TopSide({ children, heading, type }) {
  const { type: activeType, close } = useTopSide();
  const expanded = type === activeType;

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const scrollY = window.scrollY;

    const originalStyles = {
      overflow: document.body.style.overflow,
      height: document.body.style.height,
      position: document.body.style.position,
      width: document.body.style.width,
      top: document.body.style.top,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.height = originalStyles.height;
      document.body.style.position = originalStyles.position;
      document.body.style.width = originalStyles.width;
      document.body.style.top = originalStyles.top;

      window.scrollTo(0, scrollY);
    };
  }, [expanded]);

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event) {
          if (event.key === 'Escape') {
            close();
          }
        },
        { signal: abortController.signal }
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div aria-modal className={`overlay ${expanded ? 'expanded' : ''}`} role="dialog">
      <button className="close-outside" onClick={close} />
      <header className="topside">
        <button className="close reset" onClick={close} aria-label="Close">
          <X className="close_menu_icon topside_close_btn_effect" />
        </button>

        <div className="topside-content">
          {/* {MENU TOPSIDE} */}
          {heading === 'MENU' && (
            <div className="flex h-full items-center">
              <div className="flex h-full items-center me-5 pe-1 border-e border_color_light">
                <select name="country" id="country">
                  <option defaultValue="canada">CANADA (CA $)</option>
                  <option value="uk">UNITED KINGDOM (GB £)</option>
                  <option value="us">UNITED STATES (US $)</option>
                  <option value="india">INDIA (INR ₹)</option>
                </select>
              </div>
              <User className="w-5 h-5" />
            </div>
          )}

          {/* {SEARCH TOPSIDE} */}
          {heading === 'SEARCH' && (
            <input type="search" className="search-input" placeholder="Search..." />
          )}

          {/* {CART TOPSIDE} */}
          {heading === 'CART' && (
            <button className="cart-button">
              Cart
            </button>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

const TopSideContext = createContext(null);

TopSide.Provider = function TopSideProvider({ children }) {
  const [type, setType] = useState('closed');

  return (
    <TopSideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </TopSideContext.Provider>
  );
};

export function useTopSide() {
  const topSide = useContext(TopSideContext);
  if (!topSide) {
    throw new Error('useTopSide must be used within a TopSideProvider');
  }
  return topSide;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} TopSideType */
/**
 * @typedef {{
 *   type: TopSideType;
 *   open: (mode: TopSideType) => void;
 *   close: () => void;
 * }} TopSideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */

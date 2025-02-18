import { User, X } from 'lucide-react';
import {createContext, useContext, useEffect, useState} from 'react';


// type AsideType = 'search' | 'cart' | 'mobile' | 'closed' ;
// type AsideContextValue = {
//   type : AsideType;
//   open: (mode:AsideType) => void; 
//   close: () => void;
// }

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   type: AsideType;
 *   heading: React.ReactNode;
 * }}
 */
export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    if(!expanded){
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

    window.scrollTo(0,scrollY);
    }

  },[expanded])


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
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
  
          {/* {CART ASIDE} */}
          {heading === 'CART' && (
            <>{heading}</>
          )}

          {/* {MENU ASIDE} */}
          {heading === 'MENU' && (
          <div className='flex h-full w-full items-center'>
          <div className=' flex h-full items-center me-5 pe-1 border-e border_color_light'>

            <select name="country" id="country">
              <option defaultValue="canada" > CANADA (CA $) </option>
              <option value="uk">UNITED KINGDOM (GB £)</option>
              <option value="us">UNITED STATES (US $)</option>
              <option value="india" >INDIA (INR ₹)</option>
            </select>

          </div> 
          <User className='w-5 h-5'/>
          </div>
          )}

          {/* {SEARCH ASIDE} */}
          {heading === 'SEARCH' && (
            <>
            </>
          )}
          

          <button className="close  reset" onClick={close} aria-label="Close">
            <X className='close_menu_icon aside_close_btn_effect'/>
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */

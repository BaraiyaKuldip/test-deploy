import {User, X} from 'lucide-react';
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
  const [isMounted, setIsMounted] = useState(false);
  const expanded = isMounted && type === activeType;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    if (expanded) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [expanded, isMounted]);


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
// console.log(heading ,"jjjjj")



function CurrencySelectorAside() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState({
      country: 'United States',
      code: 'US',
      currency: 'USD',
      symbol: '$',
    });

    const options = [
      {country: 'Canada', code: 'CA', currency: 'CAD', symbol: '$'},
      {country: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£'},
      {country: 'United States', code: 'US', currency: 'USD', symbol: '$'},
    ];

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (option) => {
      setSelected(option);
      setIsOpen(false);
    };

    return (
      <div className="relative hidden max-[768px]:flex w-full h-full items-center justify-center
      ">
        {/* Button to toggle dropdown */}
        <button
          onClick={toggleDropdown}
          className="custom-popout-sel w-full h-full flex items-center justify-between bg-transparent text-white text-left px-4 py-2 focus:outline-none cursor-pointer"
          aria-expanded={isOpen}
        >
          <span className='h-full w-full flex items-center justify-center'>{`${selected.country} (${selected.code} ${selected.symbol})`}</span>

          <svg
            style={{
              marginInlineStart: '.2em',
              marginBlockStart: '.1em',
              fontSize: '1.4em',
              transition: 'transform .3s cubic-bezier(.215,.61,.355,1)',
            }}
            xmlns="http://www.w3.org/2000/svg"
            stroke-linecap="square"
            stroke-linejoin="arcs"
            aria-hidden="true"
            className={`w-[1em] h-[1em] flex items-center ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeMiterlimit={10}
            strokeWidth={'2px'}
            viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>

        {/* Dropdown list */}
        {isOpen && (
          <ul style={{width:"calc(100% + 1.5px)" , top:"46.4px"}} className="absolute bg-[#fff] border-[1px] border-[rgba(0,0,0,0.1)] cursor-pointer mt-1 z-10">
            {options.map((option) => (
              <li
                key={option.code}
                className={`relative !m-0 px-4 py-2 text-[var(--text-color-42)] whitespace-normal cursor-pointer hover:bg-[rgba(66,66,66,0.05)] `}
                style={{
                  fontFamily: 'var(--font-family-ms)',
                  fontStyle: 'var(--font-style-nrml)',
                  fontWeight: 'var(--font-weight-5)',
                  textTransform: 'var(--text-transform-up)',
                  letterSpacing: 'var(--letter-spacing-9)',
                  fontSize: 'calc(var(--font-size-13) * var(--font-adjust))',
                }}
                onClick={() => handleSelect(option)}
              >
                <span
                  className={`${
                    selected.code === option.code
                      ? 'border-b-[1px] border-[rgba(66,66,66, 0.05)]'
                      : ''
                  }`}
                >{`${option.country} (${option.code} ${option.symbol})`}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''} ${
        heading === 'SEARCH' ? 'searchAsideComponent' : heading === 'MENU' ? 'menuAsideComponent' : heading === 'CART' ? 'cartAsideComponent' : ''
      }`}
      role="dialog"
    >
      {heading !== 'SEARCH' && (
        <button className="close-outside" onClick={close} />
      )}
      <aside className="aside-tag">
        {heading !== 'SEARCH' && (
          <header>
            {/* {CART ASIDE} */}
            {heading === 'CART' && <>{heading}</>}

            {/* {MENU ASIDE} */}
            {heading === 'MENU' && (
              <div className="flex h-full w-full items-center ms-[-15px]">
                <div className=" flex h-full items-center me-5 border-e border_color_light">
                  <CurrencySelectorAside/>
                </div>
                <User className="w-5 h-5" />
              </div>
            )}

            {/* {SEARCH ASIDE} */}
            {heading === 'SEARCH' && <></>}

            <button className="close  reset" onClick={close} aria-label="Close">
              <X className="close_menu_icon aside_close_btn_effect" />
            </button>
          </header>
        )}
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

/** @typedef {'search' | 'cart' | 'mobile' | 'closed' | 'filter'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */

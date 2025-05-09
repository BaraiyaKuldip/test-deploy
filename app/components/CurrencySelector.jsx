import React, { useState } from 'react';

const CurrencySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('US');

  const currencies = [
    { value: 'CA', currency: 'CAD', label: 'Canada (CA $)' },
    { value: 'GB', currency: 'GBP', label: 'United Kingdom (GB £)' },
    { value: 'US', currency: 'USD', label: 'United States (US $)', current: true },
  ];

  const togglePopout = () => {
    setIsOpen(!isOpen);
  };

  const handleCurrencySelect = (value) => {
    setSelectedCurrency(value);
    setIsOpen(false);
  };

  return (
    <div className="popout" data-popout="">
      <button
        type="button"
        className="popout__toggle"
        aria-expanded={isOpen}
        aria-controls="currency-list-localization-form-footer"
        aria-describedby="currency-heading-localization-form-footer"
        onClick={togglePopout}
      >
        {currencies.find(currency => currency.value === selectedCurrency).label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          strokeLinecap="square"
          strokeLinejoin="arcs"
          aria-hidden="true"
          className="icon-theme icon-theme-stroke icon-core-chevron-down"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>

      {isOpen && (
        <ul id="currency-list-localization-form-footer" className="popout-list" data-popout-list="" data-scroll-lock-scrollable="" style={{ maxWidth: '1215px' }}>
          {currencies.map(currency => (
            <li key={currency.value} className={`popout-list__item ${currency.current ? 'popout-list__item--current' : ''}`}>
              <a
                className="popout-list__option"
                href="#"
                data-value={currency.value}
                data-currency={currency.currency}
                onClick={() => handleCurrencySelect(currency.value)}
                aria-current={currency.current ? 'true' : 'false'}
              >
                <span>{currency.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <input
        type="hidden"
        name="country_code"
        id="CurrencySelector-localization-form-footer"
        value={selectedCurrency}
        data-popout-input=""
      />
    </div>
  );
};

export default CurrencySelector;

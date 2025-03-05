import React from 'react';

const MobileHeader = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <button className="p-2 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      <div className="flex items-center">
        <a href="/" className="flex items-center">
          <img
            src="//pipeline-theme-fashion.myshopify.com/cdn/shop/files/Mezzo.png?v=1652287363&width=130"
            alt="Pipeline Clean"
            className="h-8"
          />
        </a>
      </div>

      <div className="flex items-center space-x-4">
        <a href="/cart" className="p-2 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16.25 7.8V5.7h4.2l1.05 16.8H2.6L3.65 5.7h4.2a4.2 4.2 0 0 1 8.4 0h-8.4v2.1" />
            <circle className="icon-cart-full" cx="12" cy="15" r="4" />
          </svg>
          <span className="text-sm">£0.00 (0)</span>
        </a>
      </div>
    </div>
  );
};

export default MobileHeader;
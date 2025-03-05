import React from 'react';

const DesktopHeader = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center space-x-8">
        <a href="/" className="flex items-center">
          <img
            src="//pipeline-theme-fashion.myshopify.com/cdn/shop/files/Mezzo.png?v=1652287363&width=130"
            alt="Pipeline Clean"
            className="h-8"
          />
        </a>
      </div>

      <nav className="flex items-center space-x-8">
        <a href="/collections/all" className="text-sm font-medium hover:text-blue-500">
          Shop
        </a>
        <a href="/pages/lookbooks" className="text-sm font-medium hover:text-blue-500">
          Lookbooks
        </a>
        <a href="/pages/contact" className="text-sm font-medium hover:text-blue-500">
          Contact
        </a>
        <a href="/blogs/news" className="text-sm font-medium hover:text-blue-500">
          News
        </a>
      </nav>

      <div className="flex items-center space-x-4">
        <a href="/account" className="p-2 focus:outline-none">
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
            <path d="M12 1.5c-2.575 0-4.49 1.593-4.49 5.747s1.664 4.985 1.954 5.27c.267.358.267.855 0 1.213-.238.245-4.544 1.116-6.115 2.723a4.647 4.647 0 0 0-1.665 2.915c-.069.293-.135 1.14-.181 1.88-.043.67.434 1.252 1.443 1.252h18.118c.491 0 1.477-.573 1.435-1.237-.047-.743-.113-1.6-.183-1.895a4.645 4.645 0 0 0-1.664-2.887c-1.572-1.621-5.878-2.493-6.116-2.724a1.019 1.019 0 0 1 0-1.212c.29-.286 1.955-1.103 1.955-5.27 0-4.168-1.85-5.775-4.49-5.775Z" />
          </svg>
        </a>
        <a href="/search" className="p-2 focus:outline-none">
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
            <path d="M18.316 9.825c0 3.368-2.05 6.404-5.194 7.692a8.47 8.47 0 0 1-9.164-1.81A8.265 8.265 0 0 1 2.144 6.63C3.45 3.52 6.519 1.495 9.921 1.5c4.638.007 8.395 3.732 8.395 8.325ZM22.5 22.5l-6.558-6.87L22.5 22.5Z" />
          </svg>
        </a>
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

export default DesktopHeader;
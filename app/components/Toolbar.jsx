import React from 'react';

const Toolbar = () => {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-100">
      <div className="flex items-center space-x-4">
        <div className="toolbar__text">
          <p className="text-sm">
            Fall collection is out now <strong>|</strong>{' '}
            <a href="/collections/fall-2021" title="Fall 2021" className="text-blue-500 hover:underline">
              Shop our fall collection
            </a>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <form method="post" action="/localization" id="localization-form-drawer" className="flex items-center">
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-1 text-sm bg-white border border-gray-300 rounded-md px-3 py-1"
            >
              <span>United Kingdom (GB £)</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <ul className="absolute hidden mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
              <li className="px-3 py-2 hover:bg-gray-100">
                <a href="#" className="block">
                  Canada (CA $)
                </a>
              </li>
              <li className="px-3 py-2 bg-gray-100">
                <a href="#" className="block" aria-current="true">
                  United Kingdom (GB £)
                </a>
              </li>
              <li className="px-3 py-2 hover:bg-gray-100">
                <a href="#" className="block">
                  United States (US $)
                </a>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Toolbar;
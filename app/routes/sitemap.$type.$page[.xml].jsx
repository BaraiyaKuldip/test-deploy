import {getSitemap} from '@shopify/hydrogen';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context: {storefront}}) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    // locales: ['EN-US', 'EN-CA', 'FR-CA'],  // kuldip commented
    getLink: ({type, baseUrl, handle, locale}) => {
      // if (!locale) return `${baseUrl}/${type}/${handle}`; // kuldip commented
      // return `${baseUrl}/${locale}/${type}/${handle}`; // kuldip commented
        return `${baseUrl}/${type}/${handle}`; // kuldip new line added
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

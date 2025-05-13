import {defer} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import ContactPageHeroImg from '/images/contact-page-hero-img.jpg?url';
import FeatureSectionBottom from '~/components/FeatureSectionBottom';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  console.log(page, 'page data ');
  return (
    <div className="page">
      {/* <header>
        <h1>{page.title}</h1>

      </header> */}
      <ContactPage />
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

function ContactPage() {
  function IconSection() {
    return (
      <div
        className="section-icons section-padding palette--light bg--accent"
        style={{paddingTop: '40px', paddingBottom: '40px'}}
      >
        <div className="fixed_content_wrapper icon--top max-w-7xl mx-auto px-4">
          <div className="float-grid grid--slider grid--uniform grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Free Returns */}
            <div className="grid__item text-center">
              <div className="icon__column icon--top">
                <div className="icon__column__icon">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                    className="icon icon-art-basket-return"
                    viewBox="0 0 24 24"
                  >
                    <g
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 18.75h-3.75v3.75M22.667 19.483a5.572 5.572 0 0 1-10.74-.733M19.5 15.75h3.75V12M11.833 15.017a5.572 5.572 0 0 1 10.74.733" />
                      <path d="M7.875 17.25H4.314a1.441 1.441 0 0 1-1.383-1.136l-2.138-9A1.484 1.484 0 0 1 2.176 5.25h18.148a1.484 1.484 0 0 1 1.383 1.864l-.3 1.256M3.75 5.25l4.5-4.5M18.75 5.25L14.25.752" />
                    </g>
                  </svg>
                </div>
                <div className="icon__column__text">
                  <p className="icon__column__heading">Free returns</p>
                  <div className="icon__column__paragraph">
                    <p>Returns within 30 days receive a full refund.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Worldwide Shipping */}
            <div className="grid__item text-center">
              <div className="icon__column icon--top">
                <div className="icon__column__icon">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                    className="icon icon-art-shipment-world"
                    viewBox="0 0 24 24"
                  >
                    <g
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7.538 21.75H6.75a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v5.288M17.25 14.25h3a3 3 0 0 1 3 3v3a1.5 1.5 0 0 1-1.5 1.5h-2.288" />
                      <path d="M17.625 19.5a1.874 1.874 0 1 1 .001 3.749 1.874 1.874 0 0 1-.001-3.749zM9.375 19.5a1.874 1.874 0 1 1 .001 3.749 1.874 1.874 0 0 1-.001-3.749zM15.788 21.75h-4.576M23.25 17.25h-3M1.757 13.891A9 9 0 1 1 18.75 9.749M9.75.75a11.853 11.853 0 0 0-3.75 9M9.75.75a11.853 11.853 0 0 1 3.75 9M1.263 6.75h16.971" />
                    </g>
                  </svg>
                </div>
                <div className="icon__column__text">
                  <p className="icon__column__heading">Worldwide shipping</p>
                  <div className="icon__column__paragraph">
                    <p>Ship anywhere, rates available at checkout.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="grid__item text-center">
              <div className="icon__column icon--top">
                <div className="icon__column__icon">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                    className="icon icon-art-phone"
                    viewBox="0 0 24 24"
                  >
                    <g
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4.285 2.24h-.011A4.5 4.5 0 0 0 .75 6.635v.89a1.5 1.5 0 0 0 1.5 1.5H6a1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 0 1.5 1.5h3.75a1.5 1.5 0 0 0 1.5-1.5v-.89a4.5 4.5 0 0 0-3.524-4.393h-.011a40.594 40.594 0 0 0-15.43-.002zM3.75 12.025v6a4.5 4.5 0 0 0 4.5 4.5h7.5a4.5 4.5 0 0 0 4.5-4.5v-6" />
                      <path d="M7.875 13.525a.375.375 0 1 0 .375.375.375.375 0 0 0-.375-.375M12 13.525a.375.375 0 1 0 .375.375.375.375 0 0 0-.375-.375M16.125 13.525a.375.375 0 1 0 .375.375.375.375 0 0 0-.375-.375M7.875 17.275a.375.375 0 1 0 0 .75.375.375 0 0 0 0-.75M12 17.275a.375.375 0 1 0 0 .75.375.375 0 0 0 0-.75M16.125 17.275a.375.375 0 1 0 0 .75.375.375 0 0 0 0-.75" />
                    </g>
                  </svg>
                </div>
                <div className="icon__column__text">
                  <p className="icon__column__heading">24/7 support</p>
                  <div className="icon__column__paragraph">
                    <p>Call us anytime at 1(800) 555-1234.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ContactForm() {
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form submitted');
    };

    return (
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-inner">
            <form onSubmit={handleSubmit} className="contact-form">
              <div>
                {/* <label htmlFor="full-name" className="contact-label">
                Full Name
              </label> */}
                <input
                  type="text"
                  id="full-name"
                  name="full-name"
                  placeholder="Full Name"
                  className="contact-input"
                  autoCapitalize="words"
                />
              </div>

              <div>
                {/* <label htmlFor="email" className="contact-label">
                Email
              </label> */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="contact-input"
                  autoCorrect="off"
                  autoCapitalize="none"
                />
              </div>

              <div>
                {/* <label htmlFor="message" className="contact-label">
                Message
              </label> */}
                <textarea
                  id="message"
                  name="message"
                  rows="10"
                  placeholder="Message"
                  className="contact-textarea"
                ></textarea>
              </div>

              <button type="submit" className="contact-button">
                Send
              </button>

              <div className="contact-privacy">
                <p>
                  This site is protected by hCaptcha and the hCaptcha{' '}
                  <a href="https://hcaptcha.com/privacy">Privacy Policy</a> and{' '}
                  <a href="https://hcaptcha.com/terms">Terms of Service</a>{' '}
                  apply.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }

  function ContactDesktopSection  ()  {
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form submitted');
    };

    return (
      <section className="contact-desktop-wrapper">
        <div className="contact-desktop-container">
          <div className="contact-desktop-content">
            <form onSubmit={handleSubmit} className="contact-desktop-form">
              <div className="form-group">
                {/* <label htmlFor="full-name" className="form-label">
                Full Name
              </label> */}
                <input
                  type="text"
                  id="full-name"
                  name="full-name"
                  placeholder="Full Name"
                  className="form-input"
                  autoCapitalize="words"
                />
              </div>

              <div className="form-group">
                {/* <label htmlFor="email" className="form-label">
                Email
              </label> */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="form-input"
                  autoCorrect="off"
                  autoCapitalize="none"
                />
              </div>

              <div className="form-group">
                {/* <label htmlFor="message" className="form-label">
                Message
              </label> */}
                <textarea
                  id="message"
                  name="message"
                  rows="10"
                  placeholder="Message"
                  className="form-textarea"
                ></textarea>
              </div>

              <button type="submit" className="form-button">
                Send
              </button>

              <div className="form-privacy-note">
                <p>
                  This site is protected by hCaptcha and the hCaptcha{' '}
                  <a href="https://hcaptcha.com/privacy">Privacy Policy</a> and{' '}
                  <a href="https://hcaptcha.com/terms">Terms of Service</a>{' '}
                  apply.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  };

function FlagshipStoreSection  ()  {
  return (
    <div className="flagship-wrapper">
      {/* Text Section */}
      <div className="flagship-text">
        <h2 className="flagship-heading">
          Flagship
          <span className="flagship-underline"></span>
        </h2>
        <div className="flagship-info">
          <p>
            123 Curtain Rd
            <br />
            London, UK
          </p>
          <p className="flagship-hours">
            Mon - Fri, 10am - 9pm
            <br />
            Weekends, 11am - 4pm
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="flagship-image">
        <img
          src="https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-flagship-img.webp?v=1747143251"
          alt="People browsing clothes in store"
        />
      </div>
    </div>
  );
};


  return (
    <>
      <div
        className="film_section_home_image  jjs"
        style={{
          '--PT': '0px',
          '--PB': '0px',
          '--section_width': '600px',
          'min-height': 'calc(397px + var(--header_top_height))',
          zIndex: '1',
        }}
      >
        <div className="fixed_wrapper fixed_y_padding">
          <div className="film_section_home_inner">
            <div className="film_section_content_wrapper text_align_justify_center">
              <div className="film_section_content film_section_home_content_transparent jjs">
                <div
                  className="common_text_use text_style_white film_section_home_backdrop"
                  style={{'--bg': '#000000', '--opacity': '0.1'}}
                >
                  <div className="film_section_title common_heading_size_ten">
                    <p>Contact Us</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="image_film_frame h-[500px] aspect-[var(--pc_ratio_mobile)] md:aspect-[var(--pc_ratio)] screen_3_quarters "
              style={{minHeight: 'calc(397px + var(--header_top_height)'}}
            >
              <div className="image_film_pane">
                <div
                  className="image_film_scale h-[var(--pc_height_mobile)] md:h-[var(--pc_height)]"
                  style={{
                    '--pc_height': '66.7vw',
                    '--pc_height_mobile': '66.7vw',
                  }}
                >
                  {/* <picture
                        className="relative block w-full h-full overflow-hidden aspect-[var(--pc_ratio)]"
                        style={{
                          '--pc_ratio': '1.5002143163309045',
                          '--asp_ratio_mobile': '1.5002143163309045',
                        }}
                      > */}

                  <img
                    src={
                      'https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954'
                    }
                    alt="Contact Page Hero Image"
                    width={2000}
                    height={1333}
                    loading="eager"
                    className="block overflow-hidden w-full h-full object-cover  position_bg_mobile"
                    srcSet={`https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954&width=352 352w, 
                            https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954&width=400 400w, 
                            https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954&width=768 768w, 
                            https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954&width=932 932w, 
                            https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954&width=1024 1024w, 
                            https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954&width=1200 1200w, 
                            https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954&width=1920 1920w, 
                            https://cdn.shopify.com/s/files/1/0668/9144/8501/files/contact-page-hero-img.webp?v=1747133954&width=3500 3500w`}
                    sizes="100vw"
                    fetchpriority="high"
                    style={{
                      'object-position': 'var(--main_point, center)',
                      '--obj_position_mobile': '49.1073% 0.0651%',
                      '--obj_position_pc': '62.7913% 0.0%',
                    }}
                  />
                  {/* </picture> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <IconSection />

      <div
        className="wrapper--narrow fixed_y_padding"
        style={{
          '--PT': '80px',
          '--PB': '0px',
          '--FLEX-POSITION': 'center',
          '--CONTENT-WIDTH': '500px',
        }}
      >
        <div className="text__standard text-center">
          <div className="standard__kicker accent-size-3 block__kicker--flourished mb-r5 ">
            <p>Get In Touch</p>
          </div>
          <div className="standard__heading heading-size-8">
            <p>Reach Out To Our Team</p>
          </div>
        </div>
      </div>

      {/* <ContactForm /> */}
      <ContactDesktopSection />

      {/* <div class="wrapper section-padding">
        <div class="common_text_use text-center">
          <div class="standard__heading heading-size-8 ">
            <p>Come visit all of our locations</p>
          </div>

          <div class="film_cta_wrapper">
            <a
              class="common_cta film_button btn--outline uppercase button_style_neutral btn--large button_style_long"
              href="/pages/locations"
            >
              View Directions
            </a>
          </div>
        </div>
      </div> */}

      {/* <div className="wrapper section-padding" style={{"--PT": "80px",
      "--PB": "0px",
      "--FLEX-POSITION": "center",
      "--CONTENT-WIDTH": "500px" , background: "#f7f5f4"}}>
          <div className="text__standard text-center">
            <div className="standard__heading heading-size-8">
              <p>Frequently Asked Questions</p>
            </div>
          </div>
        </div> */}

<FlagshipStoreSection/>


      <div
        class="text--neutral palette--light bg--accent"
        
        style={{"--PT": "80px","--PB": "80px","--FLEX-POSITION": "center","--CONTENT-WIDTH":" 2000px"}}
      >
        <div class="wrapper section-padding">
          <div class="text__standard text-center">
            <div
              class="standard__heading heading-size-8 "
              
            >
              <p>Come visit all of our locations</p>
            </div>

            <div class="hero__cta__wrapper">
              <a
                class="standard__cta hero__btn btn--outline uppercase btn--neutral btn--large btn--long "
                href="/pages/locations"
                
              >
                View Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

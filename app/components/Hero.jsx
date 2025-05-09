import React from 'react';
import GirlImage1Landscape from '/images/GirlImage1Landscape.png?url';

const Hero = () => {
  return (
    <div
      id="shopify-section-template--18847776375000__hero"
      className="shopify-section"
    >
      <div
        className="section--image fade-in-child js-overflow-container has-overlay"
        style={{
          '--PT': '0px',
          '--PB': '0px',
          '--CONTENT-WIDTH': '600px',
          '--full-screen': '489px',
          minHeight: 'calc(397px + var(--menu-height))',
        }}
      >
        <div className="wrapper--none section-padding">
          <div className="section__inner">
            <div className="hero__content__wrapper align--middle-center">
              <div className="hero__content hero__content--transparent js-overflow-content">
                <div
                  className="text__standard text--white backdrop--hero"
                  style={{ '--bg': '#000000', '--opacity': '0.1' }}
                >
                  <div
                    className="hero__kicker accent-size-4 aos-init aos-animate"
                    data-aos="hero"
                    data-aos-anchor="[data-section-id='template--18847776375000__hero']"
                    data-aos-order="1"
                  >
                    <p>A Conscious Wardrobe</p>
                  </div>

                  <div
                    className="hero__title heading-size-10 aos-init aos-animate"
                    data-aos="hero"
                    data-aos-anchor="[data-section-id='template--18847776375000__hero']"
                    data-aos-order="2"
                  >
                    <p>Timeless Style & Sustainable Design</p>
                  </div>

                  <div className="hero__cta__wrapper">
                    <a
                      className="standard__cta hero__btn btn uppercase btn--white btn--long aos-init aos-animate"
                      href="/collections/all"
                      data-aos="hero"
                      data-aos-anchor="[data-section-id='template--18847776375000__hero']"
                      data-aos-order="3"
                    >
                      View products
                    </a>

                    <a
                      className="standard__cta hero__btn btn-text-thick-line btn--neutral btn--long aos-init aos-animate"
                      href="/pages/about"
                      data-aos="hero"
                      data-aos-anchor="[data-section-id='template--18847776375000__hero']"
                      data-aos-order="4"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="image__hero__frame fade-in-child aspect-[--pc-ratio-mobile] md:aspect-[--wh-ratio] use_screen_three_quarters"
              data-overflow-background=""
              data-parallax-wrapper=""
              style={{ minHeight: 'calc(397px + var(--menu-height))' }}
            >
              <div className="image__hero__pane">
                <div
                  className="image__hero__scale h-[--height-mobile] md:h-[--height]"
                  style={{
                    '--height': '66.65714285714284vw',
                    '--height-mobile': '129.39545202440377vw',
                    transform: 'translate3d(0px, 30px, 0px)',
                  }}
                  data-parallax-img=""
                >
                  <picture
                    className="relative block w-full h-full overflow-hidden aspect-[--wh-ratio]"
                    style={{ '--wh-ratio': '1.5002143163309045' }}
                  >
                    <source
                      media="(min-width: 768px)"
                      sizes="100vw"
                      srcSet={GirlImage1Landscape}
                    />
                    <source
                      media="(max-width: 767px)"
                      sizes="100vw"
                      srcSet={GirlImage1Landscape}
                    />
                    <img
                      src={GirlImage1Landscape}
                      alt="Banner Image"
                      width="2000"
                      height="1333"
                      loading="eager"
                      className="block overflow-hidden w-full h-full object-cover reposition-background-mobile"
                      style={{
                        objectPosition: 'var(--focal-point, center)',
                        '--OBJECT-POSITION-MOBILE': '49.1073% 0.0651%',
                        '--OBJECT-POSITION-DESKTOP': '62.7913% 0.0%',
                      }}
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
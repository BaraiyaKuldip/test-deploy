import React, { useEffect } from 'react';


const FeatureCard = ({ iconSvg, heading, paragraph }) => (
  <div className="feature-section-bottom-card">
    <div className="feature-section-bottom-card-inner">
      <div
        className="feature-section-bottom-icon"
        dangerouslySetInnerHTML={{ __html: iconSvg }}
      />
      <div className="feature-section-bottom-text">
        <p className="feature-section-bottom-text-heading">{heading}</p>
        <div className="feature-section-bottom-text-paragraph">{paragraph}</div>
      </div>
    </div>
  </div>
);

const FeatureSectionBottom = () => {

  const features = [
    {
      iconSvg: `<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-art-basket-return" viewBox="0 0 24 24"><g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18.75h-3.75v3.75M22.667 19.483a5.572 5.572 0 0 1-10.74-.733M19.5 15.75h3.75V12M11.833 15.017a5.572 5.572 0 0 1 10.74.733"></path><path d="M7.875 17.25H4.314a1.441 1.441 0 0 1-1.383-1.136l-2.138-9A1.484 1.484 0 0 1 2.176 5.25h18.148a1.484 1.484 0 0 1 1.383 1.864l-.3 1.256M3.75 5.25l4.5-4.5M18.75 5.25L14.25.752"></path></g></svg>`, // Replace with full SVGs
      heading: "Free returns",
      paragraph: "Returns within 30 days receive a full refund.",
      aosDelay: "200",
    },
    {
      iconSvg: `<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-art-shipment-world" viewBox="0 0 24 24"><g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.538 21.75H6.75a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v5.288M17.25 14.25h3a3 3 0 0 1 3 3v3a1.5 1.5 0 0 1-1.5 1.5h-2.288"></path><path d="M17.625 19.5a1.874 1.874 0 1 1 .001 3.749 1.874 1.874 0 0 1-.001-3.749zM9.375 19.5a1.874 1.874 0 1 1 .001 3.749 1.874 1.874 0 0 1-.001-3.749zM15.788 21.75h-4.576M23.25 17.25h-3M1.757 13.891A9 9 0 1 1 18.75 9.749M9.75.75a11.853 11.853 0 0 0-3.75 9M9.75.75a11.853 11.853 0 0 1 3.75 9M1.263 6.75h16.971"></path></g></svg>`,
      heading: "Worldwide shipping",
      paragraph: "Ship anywhere, rates available at checkout.",
      aosDelay: "300",
    },
    {
      iconSvg: `<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-art-phone" viewBox="0 0 24 24"><g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.285 2.24h-.011A4.5 4.5 0 0 0 .75 6.635v.89a1.5 1.5 0 0 0 1.5 1.5H6a1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 0 1.5 1.5h3.75a1.5 1.5 0 0 0 1.5-1.5v-.89a4.5 4.5 0 0 0-3.524-4.393h-.011a40.594 40.594 0 0 0-15.43-.002zM3.75 12.025v6a4.5 4.5 0 0 0 4.5 4.5h7.5a4.5 4.5 0 0 0 4.5-4.5v-6M7.875 13.525"></path><path d="M7.875 13.525a.375.375 0 1 0 .375.375.375.375 0 0 0-.375-.375M12 13.525a.375.375 0 1 0 .375.375.375.375 0 0 0-.375-.375M16.125 13.525a.375.375 0 1 0 .375.375.375.375 0 0 0-.375-.375M7.875 17.275a.375.375 0 1 0 0 .75.375.375 0 0 0 0-.75M12 17.275a.375.375 0 1 0 0 .75.375.375 0 0 0 0-.75M16.125 17.275a.375.375 0 1 0 0 .75.375.375 0 0 0 0-.75"></path></g></svg>`,
      heading: "24/7 support",
      paragraph: "Call us anytime at 1(800) 555-1234.",
      aosDelay: "400",
    },
  ];

  return (
    <section className="feature-section-bottom">
      <div className="feature-section-bottom-container">
        <div className="feature-section-bottom-grid">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSectionBottom;

import React from 'react';
import StaticPageLayout from './StaticPageLayout';

export default function PressPage() {
  return (
    <StaticPageLayout
      title="Press & Media"
      subtitle="News, updates, and media resources from Chiantin"
    >
      <section className="mb-12">
        <h2>About Chiantin</h2>
        <p>
          Chiantin is a European digital banking platform providing secure current accounts, payment cards, and 
          SEPA transfers to individuals and businesses across the European Union. Our platform is built with a 
          focus on regulatory compliance, data protection, and financial accessibility.
        </p>
      </section>

      <section className="mb-12">
        <h2>Media Resources</h2>
        <p>
          Members of the press and media professionals may contact our communications team for press kits, 
          brand assets, interview requests, or any media-related enquiries. We are committed to providing 
          timely and accurate information to journalists and media outlets.
        </p>
      </section>

      <section className="mb-12">
        <h2>Brand Guidelines</h2>
        <p>
          When referencing Chiantin in publications, please adhere to the following guidelines:
        </p>
        <ul>
          <li>The official company name is <strong>Chiantin</strong> (always capitalised)</li>
          <li>Please do not alter, abbreviate, or modify our brand name in any way</li>
          <li>For logo usage, please contact our team to obtain approved brand assets</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2>Key Facts</h2>
        <ul>
          <li><strong>Industry:</strong> Financial Technology / Digital Banking</li>
          <li><strong>Services:</strong> Current Accounts, Payment Cards, SEPA Transfers</li>
          <li><strong>Market:</strong> European Union</li>
          <li><strong>Founded:</strong> 2024</li>
          <li><strong>Headquarters:</strong> European Union</li>
        </ul>
      </section>

      <section>
        <h2>Press Contact</h2>
        <p>
          For all press and media enquiries, please contact us at{' '}
          <a href="mailto:support@chiantin.eu">support@chiantin.eu</a> with the subject line 
          "Press Enquiry". We aim to respond to all media requests within 24 hours.
        </p>
        <p>
          Please note that Chiantin does not comment on individual customer accounts or transactions. 
          All press communications are handled exclusively through our official channels.
        </p>
      </section>
    </StaticPageLayout>
  );
}

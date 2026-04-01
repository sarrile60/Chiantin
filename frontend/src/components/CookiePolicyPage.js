import React from 'react';
import StaticPageLayout from './StaticPageLayout';

export default function CookiePolicyPage() {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      subtitle="Last updated: 1 January 2026"
    >
      <section className="mb-10">
        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how Chiantin ("we", "us", "our") uses cookies and similar tracking 
          technologies when you visit our website and use our digital banking platform (the "Services"). 
          This policy should be read in conjunction with our <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>

      <section className="mb-10">
        <h2>2. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) 
          when you visit a website. They are widely used to make websites work more efficiently and to 
          provide information to website operators. Cookies may be "session cookies" (which are deleted when 
          you close your browser) or "persistent cookies" (which remain on your device for a set period or 
          until you delete them).
        </p>
      </section>

      <section className="mb-10">
        <h2>3. Cookies We Use</h2>
        <p>We use the following categories of cookies:</p>

        <h3>3.1 Strictly Necessary Cookies</h3>
        <p>
          These cookies are essential for the operation of our Services. They enable core functionality such 
          as authentication, session management, and security features. Without these cookies, our Services 
          cannot function properly. These cookies do not require your consent.
        </p>
        <ul>
          <li><strong>Authentication cookies:</strong> Used to identify you when you log in to your account and maintain your session</li>
          <li><strong>Security cookies:</strong> Used to detect and prevent fraudulent or unauthorised activity</li>
          <li><strong>Load-balancing cookies:</strong> Used to distribute traffic across our servers to ensure optimal performance</li>
        </ul>

        <h3>3.2 Functional Cookies</h3>
        <p>
          These cookies allow us to remember choices you make (such as your preferred language or theme) 
          and provide enhanced, more personalised features. If you disable these cookies, some features of 
          our Services may not function as intended.
        </p>
        <ul>
          <li><strong>Language preference:</strong> Remembers your selected language (English or Italian)</li>
          <li><strong>Theme preference:</strong> Remembers your selected display theme (light or dark mode)</li>
        </ul>

        <h3>3.3 Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our Services by collecting and reporting 
          information anonymously. This information helps us improve our platform and user experience.
        </p>
      </section>

      <section className="mb-10">
        <h2>4. Third-Party Cookies</h2>
        <p>
          Our Services may contain content from third-party providers that may set their own cookies. We do not 
          control the cookies used by these third parties. We recommend that you review the cookie policies of 
          any third-party services you interact with through our platform.
        </p>
        <p>
          We do not use third-party advertising cookies or allow third parties to track your activity on our 
          platform for advertising purposes.
        </p>
      </section>

      <section className="mb-10">
        <h2>5. Managing Cookies</h2>
        <p>
          You can manage your cookie preferences through your browser settings. Most browsers allow you to:
        </p>
        <ul>
          <li>View what cookies are stored on your device and delete them individually</li>
          <li>Block cookies from specific or all websites</li>
          <li>Block all third-party cookies</li>
          <li>Clear all cookies when you close your browser</li>
          <li>Set your browser to notify you when a cookie is being set</li>
        </ul>
        <p>
          Please note that disabling strictly necessary cookies may prevent you from using our Services. 
          If you disable functional cookies, some features may not work as expected.
        </p>
        <p>
          For more information on managing cookies in your specific browser, please refer to your browser's 
          help documentation.
        </p>
      </section>

      <section className="mb-10">
        <h2>6. Legal Basis</h2>
        <p>
          Strictly necessary cookies are placed under the legitimate interest basis, as they are essential 
          for the provision of our Services. For all other cookies, we rely on your consent, which you may 
          withdraw at any time by adjusting your browser settings or contacting us.
        </p>
      </section>

      <section className="mb-10">
        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes will be posted on this page with 
          an updated revision date. We encourage you to review this policy periodically.
        </p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          If you have any questions about our use of cookies, please contact us at{' '}
          <a href="mailto:support@chiantin.eu">support@chiantin.eu</a>.
        </p>
      </section>
    </StaticPageLayout>
  );
}

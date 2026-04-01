import React from 'react';
import StaticPageLayout from './StaticPageLayout';

export default function TermsOfServicePage() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle="Last updated: 1 January 2026"
    >
      <section className="mb-10">
        <h2>1. Introduction and Acceptance</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of the Chiantin digital banking platform, 
          including our website, applications, and all related services (collectively, the "Services"). By creating 
          an account or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, 
          you must not use our Services.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you ("Customer", "you", "your") and Chiantin 
          ("we", "us", "our"). Please read them carefully before using our Services.
        </p>
      </section>

      <section className="mb-10">
        <h2>2. Eligibility</h2>
        <p>To open an account and use our Services, you must:</p>
        <ul>
          <li>Be at least 18 years of age</li>
          <li>Be a natural person or a duly incorporated legal entity</li>
          <li>Be a resident of a country within the European Economic Area (EEA) or an eligible jurisdiction</li>
          <li>Successfully complete our Know Your Customer (KYC) identity verification process</li>
          <li>Not be subject to any sanctions imposed by the EU, United Nations, or other applicable sanctions regimes</li>
          <li>Provide accurate, complete, and current information during registration and at all times thereafter</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>3. Account Registration and KYC</h2>
        <p>
          To access our Services, you must register for an account and complete our identity verification process. 
          This process is conducted in compliance with the EU Anti-Money Laundering Directives and applicable national 
          legislation. You are required to provide:
        </p>
        <ul>
          <li>A valid government-issued identity document (passport, national ID card, or driving licence)</li>
          <li>Proof of residential address</li>
          <li>Any additional documentation we may reasonably require</li>
        </ul>
        <p>
          We reserve the right to refuse account opening, suspend, or close any account at our discretion if KYC 
          requirements are not met or if we suspect any fraudulent, illegal, or suspicious activity.
        </p>
      </section>

      <section className="mb-10">
        <h2>4. Services</h2>
        <p>Chiantin provides the following digital banking services, subject to eligibility and applicable regulations:</p>
        <ul>
          <li><strong>Current Accounts:</strong> IBAN-based euro-denominated accounts with SEPA access</li>
          <li><strong>Payment Cards:</strong> Virtual and physical debit cards for authorised transactions</li>
          <li><strong>Money Transfers:</strong> SEPA credit transfers and internal transfers between Chiantin accounts</li>
          <li><strong>Account Management:</strong> Online access to account information, statements, and transaction history</li>
        </ul>
        <p>
          We reserve the right to modify, suspend, or discontinue any feature or service at any time, with reasonable 
          notice where practicable.
        </p>
      </section>

      <section className="mb-10">
        <h2>5. Fees and Charges</h2>
        <p>
          Certain Services may be subject to fees and charges as set out in our Fee Schedule, which is available upon 
          request and may be updated from time to time. We will provide you with reasonable notice of any changes to 
          our fees. By continuing to use our Services after fee changes take effect, you accept the updated fees.
        </p>
      </section>

      <section className="mb-10">
        <h2>6. Your Responsibilities</h2>
        <p>As a Chiantin customer, you agree to:</p>
        <ul>
          <li>Keep your login credentials confidential and not share them with any third party</li>
          <li>Notify us immediately if you suspect any unauthorised access to your account</li>
          <li>Use our Services only for lawful purposes and in compliance with all applicable laws</li>
          <li>Provide accurate and up-to-date information and promptly notify us of any changes</li>
          <li>Not use our Services for money laundering, terrorist financing, fraud, or any other illegal activity</li>
          <li>Not attempt to circumvent any security measures or access controls on our platform</li>
          <li>Comply with all applicable tax obligations in your country of residence</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>7. Prohibited Activities</h2>
        <p>You may not use our Services for:</p>
        <ul>
          <li>Any activity that violates applicable laws, regulations, or sanctions</li>
          <li>Money laundering, terrorist financing, or proliferation financing</li>
          <li>Fraud, deception, or misrepresentation</li>
          <li>Transactions involving illegal goods or services</li>
          <li>Circumventing transaction limits or other controls</li>
          <li>Any activity that could damage the reputation or integrity of Chiantin</li>
        </ul>
        <p>
          We reserve the right to immediately suspend or terminate your account and report any suspicious activity 
          to the relevant authorities if we reasonably believe you are engaged in any prohibited activity.
        </p>
      </section>

      <section className="mb-10">
        <h2>8. Account Suspension and Termination</h2>
        <p>We may suspend or terminate your account at any time if:</p>
        <ul>
          <li>You breach any provision of these Terms</li>
          <li>We are required to do so by law, regulation, or court order</li>
          <li>We suspect fraudulent, illegal, or suspicious activity</li>
          <li>You fail to provide requested KYC or compliance documentation</li>
          <li>Your account has been inactive for an extended period</li>
        </ul>
        <p>
          You may close your account at any time by contacting us at{' '}
          <a href="mailto:support@chiantin.eu">support@chiantin.eu</a>. Account closure is subject to the 
          settlement of any outstanding obligations and applicable legal retention requirements.
        </p>
      </section>

      <section className="mb-10">
        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Chiantin shall not be liable for any indirect, 
          incidental, special, consequential, or punitive damages arising out of or in connection with your 
          use of our Services. Our total aggregate liability shall not exceed the fees paid by you in the 
          12 months preceding the event giving rise to the claim.
        </p>
        <p>
          Nothing in these Terms excludes or limits our liability for death or personal injury caused by our 
          negligence, fraud, or any other liability that cannot be excluded or limited under applicable law.
        </p>
      </section>

      <section className="mb-10">
        <h2>10. Intellectual Property</h2>
        <p>
          All intellectual property rights in our Services, including but not limited to trademarks, logos, 
          software, content, and design elements, are owned by or licensed to Chiantin. You may not copy, 
          modify, distribute, or create derivative works based on our intellectual property without our 
          prior written consent.
        </p>
      </section>

      <section className="mb-10">
        <h2>11. Governing Law and Disputes</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the European Union and 
          the applicable national law of the jurisdiction in which Chiantin is established. Any disputes arising 
          out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent 
          courts in that jurisdiction.
        </p>
        <p>
          If you are a consumer within the EU, you may also be entitled to submit disputes to the Online Dispute 
          Resolution (ODR) platform provided by the European Commission.
        </p>
      </section>

      <section className="mb-10">
        <h2>12. Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will provide you with reasonable notice of 
          any material changes, typically at least 30 days before they take effect. Your continued use of our 
          Services after the changes take effect constitutes your acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:support@chiantin.eu">support@chiantin.eu</a>.
        </p>
      </section>
    </StaticPageLayout>
  );
}

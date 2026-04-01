import React from 'react';
import StaticPageLayout from './StaticPageLayout';

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="Last updated: 1 January 2026"
    >
      <section className="mb-10">
        <h2>1. Introduction</h2>
        <p>
          Chiantin ("we", "us", "our") is committed to protecting and respecting your privacy. This Privacy Policy 
          explains how we collect, use, store, and protect your personal data when you use our digital banking platform, 
          website, and related services (collectively, the "Services").
        </p>
        <p>
          This policy is prepared in accordance with the General Data Protection Regulation (EU) 2016/679 ("GDPR") and 
          other applicable European Union and national data protection legislation. By using our Services, you acknowledge 
          that you have read and understood this Privacy Policy.
        </p>
      </section>

      <section className="mb-10">
        <h2>2. Data Controller</h2>
        <p>
          Chiantin is the data controller responsible for your personal data. If you have any questions about this Privacy 
          Policy or our data protection practices, you may contact us at:
        </p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:support@chiantin.eu">support@chiantin.eu</a></li>
          <li><strong>Subject line:</strong> "Data Protection Enquiry"</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>3. Personal Data We Collect</h2>
        <p>We collect and process the following categories of personal data:</p>
        
        <h3>3.1 Information You Provide</h3>
        <ul>
          <li><strong>Identity data:</strong> Full legal name, date of birth, nationality, tax identification number</li>
          <li><strong>Contact data:</strong> Email address, phone number, residential address</li>
          <li><strong>Identity verification documents:</strong> Government-issued ID (passport, national ID card, or driving licence), proof of address</li>
          <li><strong>Financial data:</strong> Account information, transaction history, payment details</li>
          <li><strong>Communication data:</strong> Correspondence with our support team, feedback, and enquiries</li>
        </ul>

        <h3>3.2 Information Collected Automatically</h3>
        <ul>
          <li><strong>Technical data:</strong> IP address, browser type, operating system, device identifiers</li>
          <li><strong>Usage data:</strong> Pages visited, features used, time spent on the platform, login timestamps</li>
          <li><strong>Cookie data:</strong> See our <a href="/cookies">Cookie Policy</a> for full details</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>4. Legal Basis for Processing</h2>
        <p>We process your personal data on the following legal bases under Article 6 of the GDPR:</p>
        <ul>
          <li><strong>Contract performance (Art. 6(1)(b)):</strong> Processing necessary for the performance of our banking services agreement with you</li>
          <li><strong>Legal obligation (Art. 6(1)(c)):</strong> Processing required to comply with EU and national laws, including AML/KYC regulations, tax reporting, and financial supervision requirements</li>
          <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> Processing necessary for fraud prevention, security monitoring, service improvement, and internal analytics</li>
          <li><strong>Consent (Art. 6(1)(a)):</strong> Where you have given explicit consent for specific processing activities, such as marketing communications</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>5. How We Use Your Data</h2>
        <p>We use your personal data for the following purposes:</p>
        <ul>
          <li>Opening and managing your account</li>
          <li>Processing transactions and providing banking services</li>
          <li>Verifying your identity in compliance with KYC and AML regulations</li>
          <li>Detecting and preventing fraud, money laundering, and financial crime</li>
          <li>Complying with legal and regulatory obligations</li>
          <li>Communicating with you about your account and services</li>
          <li>Improving and developing our Services</li>
          <li>Ensuring the security and integrity of our platform</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>6. Data Sharing and Disclosure</h2>
        <p>We may share your personal data with the following categories of recipients:</p>
        <ul>
          <li><strong>Regulatory authorities:</strong> As required by law, including financial supervisory authorities, tax authorities, and law enforcement agencies</li>
          <li><strong>Service providers:</strong> Carefully selected third-party providers who assist us in operating our platform, including identity verification providers, payment processors, and cloud hosting providers</li>
          <li><strong>Banking partners:</strong> Financial institutions involved in processing your transactions within the SEPA network</li>
        </ul>
        <p>
          All third-party service providers are contractually bound to process your data only on our instructions and 
          in accordance with applicable data protection law. We do not sell your personal data to third parties.
        </p>
      </section>

      <section className="mb-10">
        <h2>7. International Data Transfers</h2>
        <p>
          Your personal data is primarily stored and processed within the European Economic Area (EEA). In the event 
          that data is transferred outside the EEA, we ensure that appropriate safeguards are in place, such as Standard 
          Contractual Clauses approved by the European Commission, or adequacy decisions, in accordance with Chapter V of the GDPR.
        </p>
      </section>

      <section className="mb-10">
        <h2>8. Data Retention</h2>
        <p>
          We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including 
          to satisfy legal, regulatory, accounting, or reporting requirements. In particular:
        </p>
        <ul>
          <li><strong>Account data:</strong> Retained for the duration of your account relationship and for a minimum of 5 years after account closure, as required by AML regulations</li>
          <li><strong>Transaction records:</strong> Retained for a minimum of 5 years after the transaction date, in compliance with applicable financial regulations</li>
          <li><strong>KYC documentation:</strong> Retained for a minimum of 5 years after the end of the business relationship</li>
          <li><strong>Communication records:</strong> Retained for 3 years after the communication date</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>9. Your Rights</h2>
        <p>Under the GDPR, you have the following rights regarding your personal data:</p>
        <ul>
          <li><strong>Right of access (Art. 15):</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Right to rectification (Art. 16):</strong> Request correction of inaccurate or incomplete data</li>
          <li><strong>Right to erasure (Art. 17):</strong> Request deletion of your data, subject to legal retention requirements</li>
          <li><strong>Right to restriction (Art. 18):</strong> Request that we limit the processing of your data</li>
          <li><strong>Right to data portability (Art. 20):</strong> Receive your data in a structured, machine-readable format</li>
          <li><strong>Right to object (Art. 21):</strong> Object to processing based on legitimate interests</li>
          <li><strong>Right to withdraw consent (Art. 7(3)):</strong> Withdraw consent at any time where processing is based on consent</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at <a href="mailto:support@chiantin.eu">support@chiantin.eu</a> with 
          the subject line "Data Protection Request". We will respond to your request within 30 days, as required by the GDPR.
        </p>
      </section>

      <section className="mb-10">
        <h2>10. Data Security</h2>
        <p>
          We implement appropriate technical and organisational measures to protect your personal data against unauthorised 
          access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Multi-factor authentication for account access</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Strict access controls and employee training</li>
          <li>Continuous monitoring for security threats</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>11. Right to Lodge a Complaint</h2>
        <p>
          If you believe that your data protection rights have been violated, you have the right to lodge a complaint 
          with the relevant supervisory authority in your country of residence. A list of EU data protection authorities 
          can be found on the European Data Protection Board website.
        </p>
      </section>

      <section>
        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. 
          We will notify you of any material changes by posting the updated policy on our platform and, where appropriate, 
          by email. The "Last updated" date at the top of this policy indicates when it was last revised.
        </p>
      </section>
    </StaticPageLayout>
  );
}

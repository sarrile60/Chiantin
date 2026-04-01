import React from 'react';
import StaticPageLayout from './StaticPageLayout';

export default function CompliancePage() {
  return (
    <StaticPageLayout
      title="Compliance"
      subtitle="Our commitment to regulatory excellence and financial integrity"
    >
      <section className="mb-10">
        <h2>1. Regulatory Framework</h2>
        <p>
          Chiantin operates within the comprehensive regulatory framework established by the European Union 
          for financial services. We are committed to maintaining the highest standards of compliance with all 
          applicable laws and regulations, including but not limited to:
        </p>
        <ul>
          <li><strong>Anti-Money Laundering Directives (AMLD):</strong> We comply with the EU's Anti-Money Laundering Directives, including the 5th and 6th AML Directives, and implement robust measures to prevent money laundering and terrorist financing</li>
          <li><strong>Payment Services Directive 2 (PSD2):</strong> Our Services are designed in compliance with PSD2 requirements, including strong customer authentication and secure communication standards</li>
          <li><strong>General Data Protection Regulation (GDPR):</strong> We process all personal data in accordance with the GDPR and applicable national data protection laws</li>
          <li><strong>EU Sanctions Regulations:</strong> We maintain comprehensive sanctions screening procedures in compliance with EU sanctions regimes</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>2. Know Your Customer (KYC)</h2>
        <p>
          We conduct thorough identity verification on all customers before granting access to our Services. 
          Our KYC procedures include:
        </p>
        <ul>
          <li><strong>Identity verification:</strong> Verification of customer identity using government-issued documents</li>
          <li><strong>Address verification:</strong> Confirmation of residential address through appropriate documentation</li>
          <li><strong>Risk assessment:</strong> Evaluation of customer risk profile based on regulatory criteria</li>
          <li><strong>Ongoing due diligence:</strong> Continuous monitoring of customer activity and periodic review of customer information</li>
          <li><strong>Enhanced due diligence (EDD):</strong> Additional verification measures for higher-risk customers, politically exposed persons (PEPs), and complex business relationships</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>3. Anti-Money Laundering (AML)</h2>
        <p>
          Chiantin maintains a comprehensive AML programme designed to detect, prevent, and report suspicious 
          activities. Our AML measures include:
        </p>
        <ul>
          <li><strong>Transaction monitoring:</strong> Automated and manual monitoring of all transactions to identify unusual or suspicious patterns</li>
          <li><strong>Suspicious Activity Reports (SARs):</strong> Timely filing of suspicious activity reports with the relevant Financial Intelligence Unit (FIU) as required by law</li>
          <li><strong>Record keeping:</strong> Maintenance of all customer records, transaction data, and compliance documentation for the legally required retention periods</li>
          <li><strong>Employee training:</strong> Regular AML/CFT training for all employees to ensure awareness of current risks and regulatory requirements</li>
          <li><strong>Internal controls:</strong> Independent compliance oversight, regular internal audits, and risk-based assessment procedures</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>4. Sanctions Compliance</h2>
        <p>
          We screen all customers, transactions, and counterparties against applicable sanctions lists, including:
        </p>
        <ul>
          <li>EU Consolidated Sanctions List</li>
          <li>United Nations Security Council Sanctions Lists</li>
          <li>OFAC Specially Designated Nationals (SDN) List (where applicable)</li>
          <li>Relevant national sanctions lists</li>
        </ul>
        <p>
          Any match or potential match is immediately escalated for review by our compliance team, and appropriate 
          action is taken in accordance with applicable law, including blocking transactions and reporting to the 
          relevant authorities.
        </p>
      </section>

      <section className="mb-10">
        <h2>5. Counter-Terrorist Financing (CTF)</h2>
        <p>
          Chiantin implements specific measures to detect and prevent the financing of terrorism, including 
          enhanced monitoring of transactions to and from high-risk jurisdictions, screening against terrorist 
          financing lists, and cooperation with law enforcement and intelligence agencies as required by law.
        </p>
      </section>

      <section className="mb-10">
        <h2>6. Data Protection and Privacy</h2>
        <p>
          We process all personal data in strict compliance with the GDPR and applicable national data protection 
          legislation. Our data protection measures include:
        </p>
        <ul>
          <li>Appointment of a Data Protection Officer (DPO) where required</li>
          <li>Data Protection Impact Assessments (DPIAs) for high-risk processing activities</li>
          <li>Encryption of personal data in transit and at rest</li>
          <li>Strict access controls and data minimisation principles</li>
          <li>Regular review of data processing activities and third-party agreements</li>
        </ul>
        <p>
          For full details on how we process your personal data, please refer to our{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>

      <section className="mb-10">
        <h2>7. Fraud Prevention</h2>
        <p>
          We employ advanced security measures and monitoring systems to detect and prevent fraud, including:
        </p>
        <ul>
          <li>Multi-factor authentication for account access</li>
          <li>Real-time transaction monitoring and anomaly detection</li>
          <li>Device fingerprinting and behavioural analysis</li>
          <li>Automatic blocking of suspicious transactions pending review</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>8. Reporting Concerns</h2>
        <p>
          If you suspect any fraudulent, illegal, or suspicious activity on our platform, or if you wish to 
          report a compliance concern, please contact us immediately at{' '}
          <a href="mailto:support@chiantin.eu">support@chiantin.eu</a> with the subject line 
          "Compliance Report". All reports are treated confidentially and investigated thoroughly.
        </p>
        <p>
          We maintain a zero-tolerance policy towards retaliation against individuals who report compliance 
          concerns in good faith.
        </p>
      </section>

      <section>
        <h2>9. Commitment to Continuous Improvement</h2>
        <p>
          Our compliance framework is subject to regular review and enhancement. We continuously invest in 
          training, technology, and processes to ensure that our compliance programme remains effective and 
          aligned with evolving regulatory requirements and industry best practices.
        </p>
        <p>
          For any compliance-related enquiries, please contact our team at{' '}
          <a href="mailto:support@chiantin.eu">support@chiantin.eu</a>.
        </p>
      </section>
    </StaticPageLayout>
  );
}

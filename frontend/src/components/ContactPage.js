import React from 'react';
import StaticPageLayout from './StaticPageLayout';

export default function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact Us"
      subtitle="We're here to help with any questions about your account or our services"
    >
      <section className="mb-12">
        <h2>Customer Support</h2>
        <p>
          Our dedicated support team is available to assist you with any questions, concerns, or issues 
          related to your Chiantin account or services. We are committed to providing prompt, professional, 
          and helpful assistance to every customer.
        </p>

        <div className="not-prose mt-6 grid sm:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Email Support</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">For general enquiries, account questions, and support requests</p>
            <a 
              href="mailto:support@chiantin.eu" 
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              data-testid="contact-email-link"
            >
              support@chiantin.eu
            </a>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Response Time</h3>
            </div>
            <p className="text-sm text-gray-600">We aim to respond to all enquiries within <strong>24 business hours</strong>. For urgent account security matters, please include "URGENT" in your subject line.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2>Before You Contact Us</h2>
        <p>
          To help us assist you as quickly as possible, please include the following information in your message:
        </p>
        <ul>
          <li>Your full name as registered on your Chiantin account</li>
          <li>The email address associated with your account</li>
          <li>A clear description of your enquiry or issue</li>
          <li>Any relevant transaction references or dates</li>
        </ul>
        <p>
          <strong>Important:</strong> For your security, never include your full password, PIN, or card number in email 
          communications. Our team will never ask you for this information via email.
        </p>
      </section>

      <section className="mb-12">
        <h2>Account Security Concerns</h2>
        <p>
          If you suspect any unauthorised activity on your account, please contact us immediately 
          at <a href="mailto:support@chiantin.eu">support@chiantin.eu</a> with the subject line 
          "URGENT: Security Concern". Our security team will prioritise your case and respond as 
          quickly as possible.
        </p>
      </section>

      <section className="mb-12">
        <h2>Complaints</h2>
        <p>
          We take all complaints seriously and are committed to resolving them fairly and promptly. If you are 
          not satisfied with any aspect of our service, please email us at{' '}
          <a href="mailto:support@chiantin.eu">support@chiantin.eu</a> with the subject line 
          "Formal Complaint". We will acknowledge your complaint within 2 business days and aim to provide a 
          full resolution within 15 business days.
        </p>
        <p>
          If you are not satisfied with our response, you may have the right to escalate your complaint to the 
          relevant national financial ombudsman or regulatory authority in your country of residence.
        </p>
      </section>

      <section>
        <h2>Regulatory &amp; Legal Enquiries</h2>
        <p>
          For regulatory, compliance, or legal enquiries, including law enforcement requests and data protection 
          matters, please contact us at <a href="mailto:support@chiantin.eu">support@chiantin.eu</a> with the 
          subject line "Legal / Regulatory Enquiry". These requests are handled by our compliance team and are 
          treated with the utmost confidentiality.
        </p>
      </section>
    </StaticPageLayout>
  );
}

import React from 'react';
import StaticPageLayout from './StaticPageLayout';

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="About Chiantin"
      subtitle="Building the future of European digital banking"
    >
      <section className="mb-12">
        <h2>Our Mission</h2>
        <p>
          Chiantin is a European digital banking platform designed to provide secure, transparent, and accessible financial 
          services to individuals and businesses across the European Union. We believe that managing your finances should be 
          simple, secure, and available to everyone — regardless of where you are or what time it is.
        </p>
        <p>
          Founded with a commitment to regulatory excellence and customer trust, Chiantin operates under the strict guidelines 
          set forth by EU financial authorities. Our platform is built on the principles of transparency, data protection, 
          and financial inclusion.
        </p>
      </section>

      <section className="mb-12">
        <h2>What We Do</h2>
        <p>Chiantin provides a comprehensive suite of digital banking services:</p>
        <ul>
          <li><strong>Personal e-Accounts</strong> — IBAN-based current accounts with full SEPA access for everyday banking needs</li>
          <li><strong>Business Accounts</strong> — Tailored financial solutions for businesses and entrepreneurs operating within the EU</li>
          <li><strong>Payment Cards</strong> — Virtual and physical debit cards for secure online and in-store payments</li>
          <li><strong>SEPA Transfers</strong> — Fast, reliable, and low-cost money transfers across the Single Euro Payments Area</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2>Regulatory Compliance</h2>
        <p>
          Chiantin is committed to operating within the full scope of applicable European Union financial regulations. We maintain 
          rigorous compliance with Anti-Money Laundering (AML) directives, Know Your Customer (KYC) requirements, and the General 
          Data Protection Regulation (GDPR). Our compliance framework is designed to protect both our customers and the integrity 
          of the financial system.
        </p>
        <p>
          We perform thorough identity verification on all account holders through our secure KYC process, and continuously monitor 
          transactions to detect and prevent fraud, money laundering, and other financial crimes.
        </p>
      </section>

      <section className="mb-12">
        <h2>Security</h2>
        <p>
          Your security is our highest priority. Chiantin employs industry-leading security measures including end-to-end 
          encryption, multi-factor authentication, and continuous monitoring systems. All sensitive data is processed and stored 
          in compliance with EU data protection standards.
        </p>
      </section>

      <section className="mb-12">
        <h2>Our Values</h2>
        <ul>
          <li><strong>Transparency</strong> — We are open about our fees, processes, and how we handle your data</li>
          <li><strong>Security</strong> — We invest continuously in protecting your financial information and assets</li>
          <li><strong>Accessibility</strong> — We design our services to be usable by everyone, everywhere in Europe</li>
          <li><strong>Compliance</strong> — We adhere to the highest regulatory standards in the European financial sector</li>
          <li><strong>Customer Focus</strong> — Every decision we make starts with how it impacts our customers</li>
        </ul>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          For any enquiries about Chiantin, our services, or partnership opportunities, please reach out to our team 
          at <a href="mailto:support@chiantin.eu">support@chiantin.eu</a>. We are committed to responding to all 
          enquiries within 24 business hours.
        </p>
      </section>
    </StaticPageLayout>
  );
}

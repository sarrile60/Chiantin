import React from 'react';
import StaticPageLayout from './StaticPageLayout';

export default function CareersPage() {
  return (
    <StaticPageLayout
      title="Careers at Chiantin"
      subtitle="Join our team and help shape the future of European digital banking"
    >
      <section className="mb-12">
        <h2>Work With Us</h2>
        <p>
          At Chiantin, we are building a team of talented professionals who are passionate about fintech innovation, 
          regulatory excellence, and delivering exceptional customer experiences. We value diversity, integrity, and 
          a commitment to making financial services more accessible across Europe.
        </p>
      </section>

      <section className="mb-12">
        <h2>Our Culture</h2>
        <p>
          We believe that great products come from great teams. Our culture is built around collaboration, continuous 
          learning, and a shared sense of purpose. We offer our team members the opportunity to work on meaningful 
          challenges in a rapidly evolving industry, with the flexibility and support they need to do their best work.
        </p>
        <ul>
          <li><strong>Remote-first</strong> — Work from anywhere within the European Union</li>
          <li><strong>Continuous learning</strong> — We invest in your professional development</li>
          <li><strong>Impact-driven</strong> — Your work directly improves financial access for thousands of people</li>
          <li><strong>Collaborative</strong> — We work as one team, across disciplines and borders</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2>Open Positions</h2>
        <p>
          We are always looking for exceptional talent to join our growing team. While we may not have specific 
          openings listed at this time, we welcome speculative applications from professionals in the following areas:
        </p>
        <ul>
          <li>Software Engineering (Backend, Frontend, Mobile)</li>
          <li>Compliance &amp; Risk Management</li>
          <li>Customer Support &amp; Success</li>
          <li>Product Management</li>
          <li>Information Security</li>
          <li>Finance &amp; Operations</li>
        </ul>
      </section>

      <section>
        <h2>How to Apply</h2>
        <p>
          If you are interested in joining Chiantin, please send your CV and a brief cover letter to{' '}
          <a href="mailto:support@chiantin.eu">support@chiantin.eu</a> with the subject line 
          "Career Application — [Your Area of Expertise]". We review all applications carefully and will 
          respond within 10 business days.
        </p>
        <p>
          Chiantin is an equal opportunity employer. We celebrate diversity and are committed to creating an 
          inclusive environment for all employees.
        </p>
      </section>
    </StaticPageLayout>
  );
}

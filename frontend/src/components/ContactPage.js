import React from 'react';
import { useLanguage } from '../contexts/AppContext';
import StaticPageLayout from './StaticPageLayout';
import { renderSections } from './SectionRenderer';
import staticContent from '../staticContent';

export default function ContactPage() {
  const { language } = useLanguage();
  const c = staticContent.contact[language] || staticContent.contact.en;
  return (
    <StaticPageLayout title={c.title} subtitle={c.subtitle}>
      <section className="mb-12">
        <h2>{language === 'it' ? 'Assistenza clienti' : 'Customer Support'}</h2>
        <p>{language === 'it' ? 'Il nostro team di assistenza dedicato è disponibile per rispondere a qualsiasi domanda, dubbio o problema relativo al tuo conto Chiantin o ai nostri servizi. Ci impegniamo a fornire un\'assistenza tempestiva, professionale e utile a ogni cliente.' : 'Our dedicated support team is available to assist you with any questions, concerns, or issues related to your Chiantin account or services. We are committed to providing prompt, professional, and helpful assistance to every customer.'}</p>

        <div className="not-prose mt-6 grid sm:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">{c.emailSupportTitle}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{c.emailSupportDesc}</p>
            <a href="mailto:support@chiantin.im" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors" data-testid="contact-email-link">
              support@chiantin.im
            </a>
          </div>
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">{c.responseTimeTitle}</h3>
            </div>
            <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: c.responseTimeDesc }} />
          </div>
        </div>
      </section>

      {renderSections(c.sections)}
    </StaticPageLayout>
  );
}

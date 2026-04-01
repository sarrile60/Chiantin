import React from 'react';
import { useLanguage } from '../contexts/AppContext';
import StaticPageLayout from './StaticPageLayout';
import { renderSections } from './SectionRenderer';
import legalContent from '../legalContent';

export default function TermsOfServicePage() {
  const { language } = useLanguage();
  const c = legalContent.terms[language] || legalContent.terms.en;
  return (
    <StaticPageLayout title={c.title} subtitle={c.subtitle}>
      {renderSections(c.sections)}
    </StaticPageLayout>
  );
}

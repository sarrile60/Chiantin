import React from 'react';
import { useLanguage } from '../contexts/AppContext';
import StaticPageLayout from './StaticPageLayout';
import { renderSections } from './SectionRenderer';
import legalContent from '../legalContent';

export default function CookiePolicyPage() {
  const { language } = useLanguage();
  const c = legalContent.cookies[language] || legalContent.cookies.en;
  return (
    <StaticPageLayout title={c.title} subtitle={c.subtitle}>
      {renderSections(c.sections)}
    </StaticPageLayout>
  );
}

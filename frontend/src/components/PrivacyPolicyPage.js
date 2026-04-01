import React from 'react';
import { useLanguage } from '../contexts/AppContext';
import StaticPageLayout from './StaticPageLayout';
import { renderSections } from './SectionRenderer';
import legalContent from '../legalContent';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const c = legalContent.privacy[language] || legalContent.privacy.en;
  return (
    <StaticPageLayout title={c.title} subtitle={c.subtitle}>
      {renderSections(c.sections)}
    </StaticPageLayout>
  );
}

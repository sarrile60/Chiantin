import React from 'react';
import { useLanguage } from '../contexts/AppContext';
import StaticPageLayout from './StaticPageLayout';
import { renderSections } from './SectionRenderer';
import legalContent from '../legalContent';

export default function CompliancePage() {
  const { language } = useLanguage();
  const c = legalContent.compliance[language] || legalContent.compliance.en;
  return (
    <StaticPageLayout title={c.title} subtitle={c.subtitle}>
      {renderSections(c.sections)}
    </StaticPageLayout>
  );
}

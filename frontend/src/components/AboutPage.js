import React from 'react';
import { useLanguage } from '../contexts/AppContext';
import StaticPageLayout from './StaticPageLayout';
import { renderSections } from './SectionRenderer';
import staticContent from '../staticContent';

export default function AboutPage() {
  const { language } = useLanguage();
  const c = staticContent.about[language] || staticContent.about.en;
  return (
    <StaticPageLayout title={c.title} subtitle={c.subtitle}>
      {renderSections(c.sections)}
    </StaticPageLayout>
  );
}

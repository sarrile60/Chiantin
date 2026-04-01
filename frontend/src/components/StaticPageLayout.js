import React from 'react';
import { Link } from 'react-router-dom';

export default function StaticPageLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" data-testid="static-page-logo">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Chian<span className="text-red-500">tin</span></span>
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="static-page-title">{title}</h1>
          {subtitle && <p className="mt-3 text-base text-gray-500">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-800">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; 2026 Chiantin. All rights reserved.</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-gray-800 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-gray-800 transition-colors">Terms</Link>
              <Link to="/compliance" className="hover:text-gray-800 transition-colors">Compliance</Link>
              <a href="mailto:support@chiantin.eu" className="hover:text-gray-800 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

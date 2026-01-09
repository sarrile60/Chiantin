// Transfers Page - P2P, Beneficiaries, Scheduled Payments
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { P2PTransferForm } from './P2PTransfer';
import { BeneficiaryManager } from './Beneficiaries';
import { ScheduledPayments } from './ScheduledPayments';
import { NotificationBell } from './Notifications';
import { APP_NAME } from '../config';

export function TransfersPage({ user, logout }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="header-bar">
        <div className="container-main h-full flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
              ← Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{APP_NAME}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-main py-8">
        <h2 className="text-2xl font-semibold mb-6">Transfers & Payments</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* P2P Transfer */}
          <div>
            <div className="section-header">Send Money</div>
            <P2PTransferForm onSuccess={() => navigate('/dashboard')} />
          </div>

          {/* Beneficiaries */}
          <div>
            <div className="section-header">Saved Recipients</div>
            <BeneficiaryManager />
          </div>

          {/* Scheduled Payments - Full Width */}
          <div className="lg:col-span-2">
            <div className="section-header">Scheduled Payments</div>
            <ScheduledPayments />
          </div>
        </div>
      </div>
    </div>
  );
}

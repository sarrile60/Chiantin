// Cards Management Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './Notifications';
import { APP_NAME } from '../config';
import { MobileBottomTabs } from './MobileNav';
import { useToast } from './Toast';

export function CardsPage({ user, logout }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [cardStatus, setCardStatus] = useState('ACTIVE');
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [showPINModal, setShowPINModal] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  const [limits, setLimits] = useState({
    daily: 100000,  // €1000
    monthly: 500000  // €5000
  });
  const [newPIN, setNewPIN] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');

  const handleViewNumber = () => {
    if (window.confirm('Viewing full card number. Keep this information secure.')) {
      setShowFullNumber(true);
      setTimeout(() => setShowFullNumber(false), 10000); // Hide after 10 seconds
      toast.info('Card number visible for 10 seconds');
    }
  };

  const handleFreezeCard = () => {
    if (cardStatus === 'ACTIVE') {
      if (window.confirm('Freeze this card? You won\'t be able to make transactions until you unfreeze it.')) {
        setCardStatus('FROZEN');
        toast.success('Card frozen successfully');
      }
    } else {
      setCardStatus('ACTIVE');
      toast.success('Card activated successfully');
    }
  };

  const handleChangePIN = () => {
    if (newPIN.length !== 4 || confirmPIN.length !== 4) {
      toast.error('PIN must be 4 digits');
      return;
    }
    if (newPIN !== confirmPIN) {
      toast.error('PINs do not match');
      return;
    }
    toast.success('PIN changed successfully');
    setShowPINModal(false);
    setNewPIN('');
    setConfirmPIN('');
  };

  const handleSaveLimits = () => {
    toast.success('Card limits updated successfully');
    setShowLimitsModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
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
            <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </header>

      <div className="container-main py-8">
        <h2 className="text-2xl font-semibold mb-6">Your Cards</h2>

        <div className="max-w-md">
          <div className="card p-6 mb-6">
            {/* Card Preview */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white mb-6" style={{ aspectRatio: '1.586' }}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs font-medium opacity-80">Project Atlas</p>
                  <p className="text-xs opacity-60 mt-1">Virtual Debit Card</p>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-xs opacity-60 mb-2">Card Number</p>
                <p className="font-mono text-base tracking-wider">
                  {showFullNumber ? '4532 1234 5678 4321' : '•••• •••• •••• 4321'}
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-60 mb-1">Cardholder</p>
                  <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-60 mb-1">Expires</p>
                  <p className="text-sm font-mono">12/28</p>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className={`badge ${cardStatus === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                  {cardStatus === 'ACTIVE' ? 'Active' : 'Frozen'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Card Type</span>
                <span className="font-medium">Virtual Debit</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Daily Limit</span>
                <span className="font-medium">€{(limits.daily / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly Limit</span>
                <span className="font-medium">€{(limits.monthly / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Online Payments</span>
                <span className="font-medium">Enabled</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button 
                onClick={handleViewNumber}
                className="w-full btn-primary"
                data-testid="view-card-number-btn"
              >
                {showFullNumber ? 'Viewing Full Number...' : 'View Full Card Number'}
              </button>
              <button 
                onClick={handleFreezeCard}
                className={`w-full ${cardStatus === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}`}
                data-testid="freeze-card-btn"
              >
                {cardStatus === 'ACTIVE' ? 'Freeze Card' : 'Unfreeze Card'}
              </button>
              <button 
                onClick={() => setShowPINModal(true)}
                className="w-full btn-secondary"
                data-testid="change-pin-btn"
              >
                Change PIN
              </button>
              <button 
                onClick={() => setShowLimitsModal(true)}
                className="w-full btn-secondary"
                data-testid="manage-limits-btn"
              >
                Manage Limits
              </button>
            </div>
          </div>

          {/* Recent Card Transactions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Card Transactions</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="text-sm font-medium">Online Purchase</p>
                  <p className="text-xs text-gray-500">Amazon - 09 Jan 2026</p>
                </div>
                <p className="text-sm font-semibold amount-negative">-€45.99</p>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="text-sm font-medium">Restaurant</p>
                  <p className="text-xs text-gray-500">Local Bistro - 08 Jan 2026</p>
                </div>
                <p className="text-sm font-semibold amount-negative">-€32.50</p>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium">Grocery</p>
                  <p className="text-xs text-gray-500">Supermarket - 07 Jan 2026</p>
                </div>
                <p className="text-sm font-semibold amount-negative">-€78.20</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change PIN Modal */}
      {showPINModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Change Card PIN</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New PIN (4 digits)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPIN}
                  onChange={(e) => setNewPIN(e.target.value.replace(/\D/g, ''))}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="••••"
                  data-testid="new-pin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPIN}
                  onChange={(e) => setConfirmPIN(e.target.value.replace(/\D/g, ''))}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="••••"
                  data-testid="confirm-pin-input"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowPINModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button onClick={handleChangePIN} className="flex-1 btn-primary" data-testid="save-pin-btn">
                  Change PIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Limits Modal */}
      {showLimitsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Manage Card Limits</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Spending Limit</label>
                <input
                  type="number"
                  value={limits.daily}
                  onChange={(e) => setLimits({...limits, daily: parseInt(e.target.value)})}
                  className="input-field"
                  data-testid="daily-limit-input"
                />
                <p className="text-xs text-gray-500 mt-1">= €{(limits.daily / 100).toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Spending Limit</label>
                <input
                  type="number"
                  value={limits.monthly}
                  onChange={(e) => setLimits({...limits, monthly: parseInt(e.target.value)})}
                  className="input-field"
                  data-testid="monthly-limit-input"
                />
                <p className="text-xs text-gray-500 mt-1">= €{(limits.monthly / 100).toFixed(2)}</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowLimitsModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSaveLimits} className="flex-1 btn-primary" data-testid="save-limits-btn">
                  Save Limits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MobileBottomTabs />
    </div>
  );
}

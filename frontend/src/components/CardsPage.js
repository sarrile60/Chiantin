// Cards Page - Professional Table Layout (Matching Reference Image 1)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './Notifications';
import { MobileBottomTabs } from './MobileNav';
import { CardOrderingModal } from './CardOrderingModal';
import { APP_NAME } from '../config';
import { useToast } from './Toast';
import api from '../api';

export function CardsPage({ user, logout }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [cards, setCards] = useState([]);
  const [cardRequests, setCardRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cardsRes, requestsRes, kycRes] = await Promise.all([
        api.get('/cards').catch(() => ({data: {ok: true, data: []}})),
        api.get('/card-requests').catch(() => ({data: {ok: true, data: []}})),
        api.get('/kyc/application')
      ]);
      
      setCards(cardsRes.data.data || []);
      setCardRequests(requestsRes.data.data || []);
      setKycStatus(kycRes.data?.status);
    } catch (err) {
      console.error('Failed to load cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const canOrderCard = kycStatus === 'APPROVED';
  const allItems = [
    ...cards.map(c => ({type: 'card', data: c})),
    ...cardRequests.filter(r => r.status === 'PENDING').map(r => ({type: 'request', data: r}))
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="header-bar">
        <div className="container-main h-full flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">{APP_NAME}</h1>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </header>

      {/* Top Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="container-main flex space-x-8 py-3">
          <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1">Account</button>
          <button className="text-sm font-medium text-red-600 border-b-2 border-red-600 py-1">Cards</button>
          <button onClick={() => navigate('/transfers')} className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1">Payments</button>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Cards</h2>
          {canOrderCard ? (
            <button onClick={() => setShowOrderModal(true)} className="btn-primary" data-testid="order-card-btn">
              Order new card
            </button>
          ) : (
            <button onClick={() => navigate('/kyc')} className="btn-secondary">
              Complete Verification to Order
            </button>
          )}
        </div>

        {loading ? (
          <div className="skeleton-card h-64"></div>
        ) : allItems.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-gray-600 mb-4">You don't have any cards yet</p>
            {canOrderCard && (
              <button onClick={() => setShowOrderModal(true)} className="btn-primary">Order your card!</button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-main">
              <thead>
                <tr>
                  <th>Card</th>
                  <th>Account</th>
                  <th>Balance</th>
                  <th>Valid until</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allItems.map((item, idx) => {
                  if (item.type === 'card') {
                    const card = item.data;
                    return (
                      <tr key={card.id}>
                        <td>
                          <div className="font-medium">{card.card_type === 'VIRTUAL' ? 'Virtual card' : 'Physical card'}</div>
                          <div className="text-xs text-gray-500 font-mono">•••• {card.pan?.slice(-4) || '****'}</div>
                        </td>
                        <td>{user?.first_name} {user?.last_name} EUR account</td>
                        <td className="font-semibold">€0.00</td>
                        <td>{card.exp_month}/{card.exp_year}</td>
                        <td>
                          <span className={`badge ${card.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'}`}>
                            {card.status === 'ACTIVE' ? 'Active' : card.status}
                          </span>
                        </td>
                      </tr>
                    );
                  } else {
                    const request = item.data;
                    return (
                      <tr key={request.id}>
                        <td>
                          <div className="font-medium">{request.card_type === 'VIRTUAL' ? 'Virtual card' : 'Physical card'}</div>
                          <div className="text-xs text-gray-500">Order pending</div>
                        </td>
                        <td>{user?.first_name} {user?.last_name} EUR account</td>
                        <td>-</td>
                        <td>-</td>
                        <td><span className="badge badge-warning">Being prepared</span></td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MobileBottomTabs />
      {showOrderModal && <CardOrderingModal onClose={() => setShowOrderModal(false)} onSuccess={fetchData} />}
    </div>
  );
}

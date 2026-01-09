// Scheduled Payments Component
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from './Toast';

export function ScheduledPayments() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient_email: '',
    amount: '',
    reason: '',
    frequency: 'MONTHLY',
    start_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/scheduled-payments');
      setPayments(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/scheduled-payments', {
        ...formData,
        amount: parseInt(formData.amount)
      });
      toast.success('Scheduled payment created');
      setFormData({ recipient_email: '', amount: '', reason: '', frequency: 'MONTHLY', start_date: new Date().toISOString().split('T')[0] });
      setShowCreateForm(false);
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this scheduled payment?')) return;
    try {
      await api.delete(`/scheduled-payments/${id}`);
      toast.success('Scheduled payment cancelled');
      fetchPayments();
    } catch (err) {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Scheduled Payments</h3>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
          {showCreateForm ? 'Cancel' : '+ Schedule Payment'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="mb-6 card p-4 bg-gray-50 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
            <input type="email" value={formData.recipient_email} onChange={(e) => setFormData({...formData, recipient_email: e.target.value})} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (cents)</label>
            <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required className="input-field" placeholder="10000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <input type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} className="input-field">
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} required className="input-field" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Schedule Payment</button>
        </form>
      )}

      {loading ? (
        <div className="skeleton-card"></div>
      ) : payments.length === 0 ? (
        <p className="text-gray-600 text-sm">No scheduled payments</p>
      ) : (
        <div className="space-y-3">
          {payments.map(p => (
            <div key={p.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{p.reason}</p>
                  <p className="text-sm text-gray-600">To: {p.recipient_email}</p>
                  <p className="text-sm text-gray-600">€{(p.amount / 100).toFixed(2)} - {p.frequency.toLowerCase()}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${p.active ? 'badge-success' : 'badge-gray'}`}>
                    {p.active ? 'Active' : 'Cancelled'}
                  </span>
                  {p.active && (
                    <button onClick={() => handleCancel(p.id)} className="block mt-2 text-xs text-red-600">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

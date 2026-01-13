// Admin Accounts Control - Top-Up/Withdraw
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from './Toast';

export function AdminAccountsControl() {
  const toast = useToast();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState('topup');
  const [formData, setFormData] = useState({ amount: '', reason: '' });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/admin/users');
      const users = response.data;
      
      const allAccounts = [];
      for (const user of users) {
        const userDetails = await api.get(`/admin/users/${user.id}`);
        if (userDetails.data.accounts) {
          userDetails.data.accounts.forEach(acc => {
            allAccounts.push({
              ...acc,
              userName: `${userDetails.data.user.first_name} ${userDetails.data.user.last_name}`,
              userEmail: userDetails.data.user.email
            });
          });
        }
      }
      setAccounts(allAccounts);
    } catch (err) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.reason) {
      toast.error('Fill all fields');
      return;
    }

    try {
      const endpoint = operation === 'topup' ? 'topup' : 'withdraw';
      await api.post(`/admin/accounts/${selectedAccount.id}/${endpoint}?amount=${formData.amount}&reason=${encodeURIComponent(formData.reason)}`);
      toast.success(`${operation === 'topup' ? 'Top-up' : 'Withdrawal'} successful!`);
      setShowModal(false);
      setFormData({ amount: '', reason: '' });
      fetchAccounts();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Operation failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Account Control</h2>
      {loading ? (
        <div className="skeleton-card h-64"></div>
      ) : (
        <div className="table-wrapper">
          <table className="table-main">
            <thead>
              <tr>
                <th>User</th>
                <th>Account</th>
                <th>Balance</th>
                <th>IBAN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id}>
                  <td>
                    <div className="font-medium">{acc.userName}</div>
                    <div className="text-xs text-gray-600">{acc.userEmail}</div>
                  </td>
                  <td>{acc.account_number}</td>
                  <td className="font-semibold">€{(acc.balance / 100).toFixed(2)}</td>
                  <td className="font-mono text-xs">{acc.iban}</td>
                  <td>
                    <button onClick={() => { setSelectedAccount(acc); setOperation('topup'); setShowModal(true); }} className="btn-text text-xs mr-2">Top Up</button>
                    <button onClick={() => { setSelectedAccount(acc); setOperation('withdraw'); setShowModal(true); }} className="btn-text text-xs">Withdraw</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">{operation === 'topup' ? 'Top Up Account' : 'Withdraw from Account'}</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Account: {selectedAccount.account_number}</p>
              <p className="text-sm text-gray-600">Current: €{(selectedAccount.balance / 100).toFixed(2)}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (cents)</label>
                <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="input-field" placeholder="10000" />
                {formData.amount && <p className="text-xs text-gray-500 mt-1">€{(parseInt(formData.amount)/100).toFixed(2)}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <input type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="input-field" />
              </div>
              <div className="flex space-x-3">
                <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={handleSubmit} className="flex-1 btn-primary">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

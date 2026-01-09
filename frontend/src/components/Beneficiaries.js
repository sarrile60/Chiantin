// Beneficiary Management Component
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from './Toast';

export function BeneficiaryManager() {
  const toast = useToast();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient_email: '',
    recipient_name: '',
    nickname: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await api.get('/beneficiaries');
      setBeneficiaries(response.data);
    } catch (err) {
      console.error('Failed to fetch beneficiaries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/beneficiaries', formData);
      toast.success('Beneficiary added');
      setFormData({ recipient_email: '', recipient_name: '', nickname: '' });
      setShowAddForm(false);
      fetchBeneficiaries();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add beneficiary');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this beneficiary?')) return;
    try {
      await api.delete(`/beneficiaries/${id}`);
      toast.success('Beneficiary removed');
      fetchBeneficiaries();
    } catch (err) {
      toast.error('Failed to remove beneficiary');
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Saved Recipients</h3>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
          {showAddForm ? 'Cancel' : '+ Add Recipient'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-6 card p-4 bg-gray-50 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
            <input type="email" value={formData.recipient_email} onChange={(e) => setFormData({...formData, recipient_email: e.target.value})} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
            <input type="text" value={formData.recipient_name} onChange={(e) => setFormData({...formData, recipient_name: e.target.value})} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nickname (Optional)</label>
            <input type="text" value={formData.nickname} onChange={(e) => setFormData({...formData, nickname: e.target.value})} className="input-field" placeholder="e.g., Mom, John, etc." />
          </div>
          <button type="submit" className="btn-primary w-full">Save Recipient</button>
        </form>
      )}

      {loading ? (
        <div className="skeleton-card"></div>
      ) : beneficiaries.length === 0 ? (
        <p className="text-gray-600 text-sm">No saved recipients yet</p>
      ) : (
        <div className="space-y-2">
          {beneficiaries.map(b => (
            <div key={b.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
              <div>
                <p className="font-medium">{b.nickname || b.recipient_name}</p>
                <p className="text-sm text-gray-600">{b.recipient_email}</p>
              </div>
              <button onClick={() => handleDelete(b.id)} className="text-sm text-red-600 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

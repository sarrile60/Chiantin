// Admin Card Requests Queue
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from './Toast';

export function AdminCardRequestsQueue() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('PENDING');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fulfillData, setFulfillData] = useState({
    cardholder_name: '',
    pan: '',
    exp_month: '',
    exp_year: '',
    cvv: '',
    billing_address_line1: '',
    city: '',
    postal_code: '',
    country: 'Germany'
  });

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/card-requests');
      setRequests(response.data.data.filter(r => r.status === activeTab));
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async () => {
    try {
      await api.post(`/admin/card-requests/${selectedRequest.id}/fulfill`, fulfillData);
      toast.success('Card fulfilled!');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to fulfill');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Reject reason:');
    if (!reason) return;
    try {
      await api.post(`/admin/card-requests/${selectedRequest.id}/reject?reason=${encodeURIComponent(reason)}`);
      toast.success('Request rejected');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to reject');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Card Requests</h2>
      <div className="flex space-x-4 mb-6">
        {['PENDING', 'FULFILLED', 'REJECTED'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{tab}</button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton-card h-64"></div>
      ) : selectedRequest && activeTab === 'PENDING' ? (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Fulfill Card Request</h3>
          <div className="space-y-3">
            <input placeholder="Cardholder Name" value={fulfillData.cardholder_name} onChange={(e) => setFulfillData({...fulfillData, cardholder_name: e.target.value})} className="input-field" />
            <input placeholder="Card Number (PAN)" value={fulfillData.pan} onChange={(e) => setFulfillData({...fulfillData, pan: e.target.value})} className="input-field" />
            <div className="grid grid-cols-3 gap-2">
              <input placeholder="MM" type="number" value={fulfillData.exp_month} onChange={(e) => setFulfillData({...fulfillData, exp_month: e.target.value})} className="input-field" />
              <input placeholder="YYYY" type="number" value={fulfillData.exp_year} onChange={(e) => setFulfillData({...fulfillData, exp_year: e.target.value})} className="input-field" />
              <input placeholder="CVV" value={fulfillData.cvv} onChange={(e) => setFulfillData({...fulfillData, cvv: e.target.value})} className="input-field" />
            </div>
            <input placeholder="Address" value={fulfillData.billing_address_line1} onChange={(e) => setFulfillData({...fulfillData, billing_address_line1: e.target.value})} className="input-field" />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="City" value={fulfillData.city} onChange={(e) => setFulfillData({...fulfillData, city: e.target.value})} className="input-field" />
              <input placeholder="Postal Code" value={fulfillData.postal_code} onChange={(e) => setFulfillData({...fulfillData, postal_code: e.target.value})} className="input-field" />
            </div>
            <div className="flex space-x-3 pt-4">
              <button onClick={() => setSelectedRequest(null)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleReject} className="flex-1 bg-gray-600 text-white py-2 rounded">Reject</button>
              <button onClick={handleFulfill} className="flex-1 btn-primary">Fulfill</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table-main">
            <thead>
              <tr><th>Date</th><th>User</th><th>Type</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="cursor-pointer hover:bg-gray-50" onClick={() => activeTab === 'PENDING' && setSelectedRequest(r)}>
                  <td className="text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>{r.user_id}</td>
                  <td>{r.card_type}</td>
                  <td><span className="badge badge-warning">{r.status}</span></td>
                  <td>{activeTab === 'PENDING' && <button className="btn-text text-xs">Process</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

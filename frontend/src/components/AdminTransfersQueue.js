// Admin Transfers Queue
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from './Toast';

export function AdminTransfersQueue() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('SUBMITTED');
  const [transfers, setTransfers] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchTransfers();
  }, [activeTab]);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/transfers?status=${activeTab}`);
      setTransfers(response.data.data);
    } catch (err) {
      toast.error('Failed to load transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/transfers/${id}/approve`);
      toast.success('Transfer approved');
      setSelectedTransfer(null);
      fetchTransfers();
    } catch (err) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason) {
      toast.error('Reject reason required');
      return;
    }
    try {
      await api.post(`/admin/transfers/${id}/reject`, { reason: rejectReason });
      toast.success('Transfer rejected');
      setSelectedTransfer(null);
      setRejectReason('');
      fetchTransfers();
    } catch (err) {
      toast.error('Failed to reject');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Transfers Queue</h2>
      <div className="flex space-x-4 mb-6">
        {['SUBMITTED', 'COMPLETED', 'REJECTED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton-card h-64"></div>
      ) : selectedTransfer ? (
        <div className="card p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Transfer Details</h3>
            <button onClick={() => setSelectedTransfer(null)} className="text-gray-600">×</button>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-600">To:</dt><dd className="font-medium">{selectedTransfer.beneficiary_name}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600">IBAN:</dt><dd className="font-mono text-xs">{selectedTransfer.beneficiary_iban}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600">Amount:</dt><dd className="font-bold">€{(selectedTransfer.amount/100).toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600">Details:</dt><dd>{selectedTransfer.details}</dd></div>
            {selectedTransfer.reference_number && <div className="flex justify-between"><dt className="text-gray-600">Reference:</dt><dd>{selectedTransfer.reference_number}</dd></div>}
            <div className="flex justify-between"><dt className="text-gray-600">Status:</dt><dd><span className={`badge ${selectedTransfer.status === 'REJECTED' ? 'badge-error' : selectedTransfer.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>{selectedTransfer.status}</span></dd></div>
            {selectedTransfer.reject_reason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <dt className="text-red-700 font-medium text-sm mb-1">Rejection Reason:</dt>
                <dd className="text-red-600 text-sm">{selectedTransfer.reject_reason}</dd>
              </div>
            )}
            {selectedTransfer.admin_action_by && (
              <div className="flex justify-between mt-2"><dt className="text-gray-600">Processed by:</dt><dd className="text-xs text-gray-500">{selectedTransfer.admin_action_by}</dd></div>
            )}
            {selectedTransfer.admin_action_at && (
              <div className="flex justify-between"><dt className="text-gray-600">Processed at:</dt><dd className="text-xs text-gray-500">{new Date(selectedTransfer.admin_action_at).toLocaleString()}</dd></div>
            )}
          </dl>
          
          {selectedTransfer.status === 'SUBMITTED' && (
            <div className="mt-6 space-y-3">
              <button onClick={() => handleApprove(selectedTransfer.id)} className="w-full btn-primary">Approve Transfer</button>
              <div>
                <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reject reason..." className="input-field mb-2" />
                <button onClick={() => handleReject(selectedTransfer.id)} className="w-full btn-secondary">Reject Transfer</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table-main">
            <thead>
              <tr>
                <th>Date</th>
                <th>Beneficiary</th>
                <th>Amount</th>
                <th>Status</th>
                {activeTab === 'REJECTED' && <th>Reason</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(t => (
                <tr key={t.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedTransfer(t)}>
                  <td className="text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>{t.beneficiary_name}</td>
                  <td className="font-semibold">€{(t.amount/100).toFixed(2)}</td>
                  <td><span className={`badge ${t.status === 'REJECTED' ? 'badge-error' : t.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span></td>
                  {activeTab === 'REJECTED' && (
                    <td className="max-w-xs">
                      <span className="text-xs text-red-600 truncate block" title={t.reject_reason}>
                        {t.reject_reason ? (t.reject_reason.length > 50 ? t.reject_reason.substring(0, 50) + '...' : t.reject_reason) : 'N/A'}
                      </span>
                    </td>
                  )}
                  <td><button className="btn-text text-xs">Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

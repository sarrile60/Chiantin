// Enhanced Admin Ledger Tools
import React, { useState } from 'react';
import api from '../api';
import { useToast } from './Toast';

export function EnhancedLedgerTools({ account, onSuccess }) {
  const toast = useToast();
  const [activeOperation, setActiveOperation] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    toAccountId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTopUp = async () => {
    if (!formData.amount || !formData.reason) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/admin/ledger/top-up', {
        account_id: account.id,
        amount: parseInt(formData.amount),
        reason: formData.reason
      });
      toast.success(`€${(parseInt(formData.amount) / 100).toFixed(2)} added to account`);
      setFormData({ amount: '', reason: '', toAccountId: '' });
      setActiveOperation(null);
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Top-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!formData.amount || !formData.reason) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/admin/ledger/withdraw', {
        account_id: account.id,
        amount: parseInt(formData.amount),
        reason: formData.reason
      });
      toast.success(`€${(parseInt(formData.amount) / 100).toFixed(2)} withdrawn from account`);
      setFormData({ amount: '', reason: '', toAccountId: '' });
      setActiveOperation(null);
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChargeFee = async () => {
    if (!formData.amount || !formData.reason) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/admin/ledger/charge-fee', {
        account_id: account.id,
        amount: parseInt(formData.amount),
        reason: formData.reason
      });
      toast.success(`€${(parseInt(formData.amount) / 100).toFixed(2)} fee charged`);
      setFormData({ amount: '', reason: '', toAccountId: '' });
      setActiveOperation(null);
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Fee charge failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInternalTransfer = async () => {
    if (!formData.amount || !formData.reason || !formData.toAccountId) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/admin/ledger/internal-transfer', {
        from_account_id: account.id,
        to_account_id: formData.toAccountId,
        amount: parseInt(formData.amount),
        reason: formData.reason
      });
      toast.success('Transfer successful!');
      setFormData({ amount: '', reason: '', toAccountId: '' });
      setActiveOperation(null);
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (cents) => `€${(cents / 100).toFixed(2)}`;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Ledger Operations</h4>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {/* Operation Buttons */}
      {!activeOperation ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveOperation('topup')}
            className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            data-testid="topup-btn"
          >
            + Top Up
          </button>
          <button
            onClick={() => setActiveOperation('withdraw')}
            className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
            data-testid="withdraw-btn"
          >
            - Withdraw
          </button>
          <button
            onClick={() => setActiveOperation('fee')}
            className="px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium"
            data-testid="fee-btn"
          >
            Fee Charge
          </button>
          <button
            onClick={() => setActiveOperation('transfer')}
            className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            data-testid="transfer-btn"
          >
            Transfer
          </button>
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h5 className="font-medium capitalize">{activeOperation.replace('_', ' ')}</h5>
            <button
              onClick={() => {
                setActiveOperation(null);
                setFormData({ amount: '', reason: '', toAccountId: '' });
                setError('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (in cents) *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g., 10000 for €100.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              data-testid="amount-input"
            />
            {formData.amount && (
              <p className="text-xs text-gray-600 mt-1">
                = {formatAmount(parseInt(formData.amount) || 0)}
              </p>
            )}
          </div>

          {activeOperation === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Account ID *
              </label>
              <input
                type="text"
                value={formData.toAccountId}
                onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                placeholder="Target account ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                data-testid="to-account-input"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              placeholder="Enter reason for this operation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              data-testid="reason-input"
            />
          </div>

          <button
            onClick={() => {
              if (activeOperation === 'topup') handleTopUp();
              else if (activeOperation === 'withdraw') handleWithdraw();
              else if (activeOperation === 'fee') handleChargeFee();
              else if (activeOperation === 'transfer') handleInternalTransfer();
            }}
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            data-testid="submit-operation"
          >
            {loading ? 'Processing...' : `Submit ${activeOperation}`}
          </button>
        </div>
      )}
    </div>
  );
}

export function TransactionReversal({ transaction, onSuccess }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReverse = async () => {
    if (!reason) {
      setError('Please provide a reason for reversal');
      return;
    }

    if (!window.confirm('Are you sure you want to reverse this transaction? This action creates new ledger entries and cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/admin/ledger/reverse', {
        transaction_id: transaction.id,
        reason
      });
      toast.success('Transaction reversed successfully!');
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Reversal failed');
    } finally {
      setLoading(false);
    }
  };

  if (transaction.status === 'REVERSED') {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded p-4">
        <p className="text-sm text-purple-800">
          This transaction has already been reversed
        </p>
        {transaction.reversed_by_txn_id && (
          <p className="text-xs text-purple-600 mt-1 font-mono">
            Reversal ID: {transaction.reversed_by_txn_id}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="border-t pt-4 space-y-4">
      <h4 className="font-medium text-red-600">Reverse Transaction</h4>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Reversal *
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Enter detailed reason for reversing this transaction..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          data-testid="reversal-reason"
        />
      </div>

      <button
        onClick={handleReverse}
        disabled={loading || !reason}
        className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        data-testid="confirm-reversal"
      >
        {loading ? 'Processing...' : 'Confirm Reversal'}
      </button>

      <p className="text-xs text-gray-600">
        Note: Reversal creates new mirrored ledger entries. The original transaction will be marked as REVERSED.
      </p>
    </div>
  );
}

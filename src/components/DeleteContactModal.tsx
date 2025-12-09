"use client";

import { useState } from 'react';
import { FiX, FiTrash2, FiAlertTriangle, FiUser, FiMail, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAdmin } from '@/components/AdminContextSimple';

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  source: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DeleteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onDelete: () => void;
}

export default function DeleteContactModal({ isOpen, onClose, contact, onDelete }: DeleteContactModalProps) {
  const { getAuthHeaders } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen || !contact) return null;

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: contact._id
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Contact deleted successfully');
        onDelete();
        onClose();
      } else {
        toast.error(data.error || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiTrash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete Contact</h2>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="px-6 py-4 bg-red-50 border-b border-red-100">
          <div className="flex items-center space-x-3">
            <FiAlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Warning: Permanent Deletion</h3>
              <p className="text-sm text-red-700 mt-1">
                This contact and all associated data will be permanently removed from the system.
                This action cannot be reversed.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Contact to be deleted:</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {contact.fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('').substring(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h5 className="font-semibold text-gray-900">{contact.fullName}</h5>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(contact.priority)}`}>
                    {contact.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <FiMail className="w-3 h-3 mr-1" />
                  {contact.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FiClock className="w-3 h-3 mr-1" />
                  Created {new Date(contact.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  <strong>Subject:</strong> {contact.subject}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <strong>Service:</strong> {contact.service}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm:
              </label>
              <input
                id="confirmText"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Type DELETE here"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <FiAlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Before deleting, consider:</p>
                  <ul className="text-yellow-700 mt-1 space-y-1">
                    <li>• Updating the contact status to "Closed" instead</li>
                    <li>• Archiving for future reference</li>
                    <li>• Exporting contact data if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== 'DELETE'}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <FiTrash2 className="w-4 h-4" />
                <span>Delete Contact</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
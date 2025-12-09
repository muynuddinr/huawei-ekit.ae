"use client";

import { useState } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiMessageSquare, FiEdit3, FiCheck, FiClock, FiAlertCircle, FiStar } from 'react-icons/fi';
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

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onUpdate: () => void;
}

const statusOptions = [
  { value: 'new', label: 'New', icon: FiClock, color: 'text-blue-600' },
  { value: 'replied', label: 'Replied', icon: FiCheck, color: 'text-green-600' },
  { value: 'in_progress', label: 'In Progress', icon: FiClock, color: 'text-yellow-600' },
  { value: 'closed', label: 'Closed', icon: FiCheck, color: 'text-gray-600' }
];

const priorityOptions = [
  { value: 'low', label: 'Low Priority', color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'high', label: 'High Priority', color: 'text-red-600', bgColor: 'bg-red-100' }
];

export default function EditContactModal({ isOpen, onClose, contact, onUpdate }: EditContactModalProps) {
  const { getAuthHeaders } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: contact?.status || 'new',
    priority: contact?.priority || 'medium',
    isRead: contact?.isRead || false,
    notes: ''
  });

  if (!isOpen || !contact) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: contact._id,
          updates: {
            status: formData.status,
            priority: formData.priority,
            isRead: formData.isRead,
            ...(formData.notes && { notes: formData.notes })
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Contact updated successfully');
        onUpdate();
        onClose();
      } else {
        toast.error(data.error || 'Failed to update contact');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    const Icon = statusOption?.icon || FiClock;
    return Icon;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiEdit3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Contact</h2>
                <p className="text-sm text-gray-600">Update contact status and details</p>
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

        {/* Contact Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {contact.fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('').substring(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{contact.fullName}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 mr-1" />
                  {contact.email}
                </div>
                <div className="flex items-center">
                  <FiPhone className="w-4 h-4 mr-1" />
                  {contact.phone}
                </div>
                {contact.company && (
                  <div className="flex items-center">
                    <FiBriefcase className="w-4 h-4 mr-1" />
                    {contact.company}
                  </div>
                )}
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {contact.service}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-1">{contact.subject}</h4>
            <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">{contact.message}</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((status) => {
                  const StatusIcon = status.icon;
                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: status.value as any })}
                      className={`p-3 border rounded-lg flex items-center space-x-2 transition-all ${
                        formData.status === status.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <StatusIcon className={`w-4 h-4 ${formData.status === status.value ? 'text-blue-600' : status.color}`} />
                      <span className={`text-sm font-medium ${formData.status === status.value ? 'text-blue-900' : 'text-gray-700'}`}>
                        {status.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Priority</label>
              <div className="grid grid-cols-3 gap-3">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: priority.value as any })}
                    className={`p-3 border rounded-lg flex flex-col items-center space-y-1 transition-all ${
                      formData.priority === priority.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${priority.bgColor} flex items-center justify-center`}>
                      <FiStar className={`w-3 h-3 ${priority.color}`} />
                    </div>
                    <span className={`text-xs font-medium ${formData.priority === priority.value ? 'text-blue-900' : 'text-gray-700'}`}>
                      {priority.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Read Status */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRead}
                  onChange={(e) => setFormData({ ...formData, isRead: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Read</span>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add internal notes about this contact..."
              />
            </div>

            {/* Contact Metadata */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>
                  <br />
                  {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <br />
                  {new Date(contact.updatedAt).toLocaleDateString()} at {new Date(contact.updatedAt).toLocaleTimeString()}
                </div>
                <div>
                  <span className="font-medium">Source:</span>
                  <br />
                  {contact.source}
                </div>
                <div>
                  <span className="font-medium">Contact ID:</span>
                  <br />
                  #{contact._id.slice(-6).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Update Contact</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
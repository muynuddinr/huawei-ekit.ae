"use client";

import { useState, useEffect } from 'react';
import { FiMessageSquare, FiMail, FiPhone, FiUser, FiCalendar, FiEye, FiSearch, FiFilter, FiDownload, FiStar, FiClock, FiCheck, FiX, FiArchive, FiCornerUpLeft, FiMoreVertical, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import EditContactModal from '@/components/EditContactModal';
import DeleteContactModal from '@/components/DeleteContactModal';
import { exportContacts } from '@/lib/exportUtils';
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

const statusConfig = {
  new: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: FiClock },
  replied: { color: 'bg-green-100 text-green-800 border-green-200', icon: FiCornerUpLeft },
  in_progress: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FiClock },
  closed: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FiCheck }
};

const priorityConfig = {
  high: { color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  medium: { color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  low: { color: 'bg-green-100 text-green-800', dot: 'bg-green-500' }
};

const serviceColors: { [key: string]: string } = {
  'Network Infrastructure': 'bg-blue-100 text-blue-700',
  'Wireless Solutions': 'bg-purple-100 text-purple-700',
  'Security Systems': 'bg-red-100 text-red-700',
  'Cloud Services': 'bg-green-100 text-green-700',
  'Technical Support': 'bg-orange-100 text-orange-700',
  'Partnership': 'bg-yellow-100 text-yellow-700',
  'Other': 'bg-gray-100 text-gray-700',
};

export default function ContactsPage() {
  const { getAuthHeaders } = useAdmin();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Bulk loading state
  const [bulkLoading, setBulkLoading] = useState(false);

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts', {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data);
        console.log(`Loaded ${data.data.length} contacts`);
      } else {
        console.error('Failed to fetch contacts:', data.error);
        toast.error('Failed to load contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (contact.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || contact.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'all' || contact.service === selectedCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const uniqueCategories = [...new Set(contacts.map(contact => contact.service))];
  const newContactsCount = contacts.filter(c => c.status === 'new').length;
  const avgResponseTime = '3.2h';

  // Helper function to generate avatar initials
  const getAvatar = (fullName: string) => {
    return fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('').substring(0, 2);
  };

  // Modal handlers
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setEditModalOpen(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  const handleContactUpdated = () => {
    fetchContacts();
  };

  const handleContactDeleted = () => {
    fetchContacts();
  };

  // Bulk operations
  const handleMarkAllRead = async () => {
    setBulkLoading(true);
    try {
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          operation: 'markAllRead',
          filters: {
            status: selectedStatus,
            priority: selectedPriority,
            service: selectedCategory
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Marked ${data.data.modifiedCount} contacts as read`);
        fetchContacts();
      } else {
        toast.error(data.error || 'Failed to mark contacts as read');
      }
    } catch (error) {
      console.error('Error marking contacts as read:', error);
      toast.error('Failed to mark contacts as read');
    } finally {
      setBulkLoading(false);
    }
  };

  // Export functions
  const handleExport = () => {
    try {
      const result = exportContacts(filteredContacts, 'csv', 'huawei-contacts');
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export contacts');
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FiMessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Customer Contacts
              </h1>
              <p className="text-gray-600 mt-1">Manage customer inquiries and communications</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Export CSV Button */}
            <button 
              onClick={handleExport}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export CSV ({filteredContacts.length})</span>
            </button>

            {/* Mark All Read Button */}
            <button 
              onClick={handleMarkAllRead}
              disabled={bulkLoading || filteredContacts.filter(c => !c.isRead).length === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {bulkLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Mark All Read ({filteredContacts.filter(c => !c.isRead).length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{newContactsCount}</div>
            <div className="text-sm text-gray-600">New Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{contacts.filter(c => c.status === 'replied').length}</div>
            <div className="text-sm text-gray-600">Replied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{avgResponseTime}</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="replied">Replied</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => {
          const StatusIcon = statusConfig[contact.status as keyof typeof statusConfig]?.icon || FiClock;
          const avatar = getAvatar(contact.fullName);
          
          return (
            <div key={contact._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Contact Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${priorityConfig[contact.priority as keyof typeof priorityConfig]?.dot} border-2 border-white`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{contact.fullName}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${serviceColors[contact.service] || 'bg-gray-100 text-gray-700'}`}>
                          {contact.service}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig[contact.priority as keyof typeof priorityConfig]?.color}`}>
                          {contact.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{contact.company || 'No company specified'}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <FiMail className="w-3 h-3 mr-1" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                        <div className="flex items-center">
                          <FiPhone className="w-3 h-3 mr-1" />
                          {contact.phone}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="w-3 h-3 mr-1" />
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-blue-600 font-medium">
                          via {contact.source}
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-1">{contact.subject}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-start lg:items-end space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig[contact.status as keyof typeof statusConfig]?.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1).replace('_', ' ')}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {contact.isRead ? 'Read' : 'Unread'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditContact(contact)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="Edit Contact"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200">
                        <FiCornerUpLeft className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                        <FiStar className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteContact(contact)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Delete Contact"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 mt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Last activity: {new Date(contact.updatedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>ID: #{contact._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditContact(contact)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <FiEdit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteContact(contact)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Quick Stats Floating Panel */}
      <div className="fixed bottom-6 right-6 z-50 lg:block hidden">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-3 min-w-[200px]">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 mb-2">Quick Stats</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">High Priority:</span>
                <span className="font-semibold text-red-600">{contacts.filter(c => c.priority === 'high').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pending:</span>
                <span className="font-semibold text-yellow-600">{contacts.filter(c => c.status === 'new' || c.status === 'in_progress').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Today:</span>
                <span className="font-semibold text-blue-600">{contacts.filter(c => {
                  const today = new Date();
                  const contactDate = new Date(c.createdAt);
                  return contactDate.toDateString() === today.toDateString();
                }).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Contact Modal */}
      <EditContactModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        contact={selectedContact}
        onUpdate={handleContactUpdated}
      />

      {/* Delete Contact Modal */}
      <DeleteContactModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        contact={selectedContact}
        onDelete={handleContactDeleted}
      />
    </div>
  );
}
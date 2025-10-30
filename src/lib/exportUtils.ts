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

export const exportToCSV = (contacts: Contact[], filename: string = 'contacts') => {
  try {
    // Define CSV headers
    const headers = [
      'Full Name',
      'Email',
      'Phone',
      'Company',
      'Service',
      'Subject',
      'Message',
      'Status',
      'Priority',
      'Source',
      'Read Status',
      'Created Date',
      'Last Updated'
    ];

    // Convert contacts to CSV format
    const csvData = contacts.map(contact => [
      contact.fullName,
      contact.email,
      contact.phone,
      contact.company || '',
      contact.service,
      contact.subject,
      `"${contact.message.replace(/"/g, '""')}"`, // Escape quotes in message
      contact.status,
      contact.priority,
      contact.source,
      contact.isRead ? 'Read' : 'Unread',
      new Date(contact.createdAt).toLocaleDateString(),
      new Date(contact.updatedAt).toLocaleDateString()
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, message: 'CSV export completed successfully' };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { success: false, message: 'Failed to export CSV file' };
  }
};

export const exportContacts = (contacts: Contact[], format: 'csv', filename?: string) => {
  return exportToCSV(contacts, filename);
};

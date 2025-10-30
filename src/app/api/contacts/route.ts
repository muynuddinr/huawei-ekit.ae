import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contact } from '@/app/models';
import { rateLimit } from '@/lib/rateLimit';
import { validateInput } from '@/lib/validation';
import { checkAdminAuth } from '@/lib/auth';

// Validation schema for contact form
const contactSchema = {
  fullName: { required: true, type: 'string', minLength: 2, maxLength: 100, sanitize: true },
  email: { required: true, type: 'email', sanitize: true },
  phone: { type: 'string', minLength: 10, maxLength: 20, sanitize: true },
  company: { type: 'string', maxLength: 200, sanitize: true },
  service: { 
    required: true, 
    type: 'string', 
    sanitize: true,
    pattern: /^(Network Infrastructure|Wireless Solutions|Security Systems|Cloud Services|Technical Support|Partnership|Other)$/
  },
  subject: { required: true, type: 'string', minLength: 5, maxLength: 200, sanitize: true },
  message: { required: true, type: 'string', minLength: 10, maxLength: 2000, sanitize: true }
} as const;

// POST - Submit new contact form
export async function POST(request: NextRequest) {
  try {
    console.log('Contact form submission received');
    
    // Apply rate limiting (3 submissions per 10 minutes per IP)
    const rateLimitResult = rateLimit(request, 3, 10 * 60 * 1000);
    if (!rateLimitResult.allowed) {
      const retryAfterMinutes = Math.ceil(rateLimitResult.retryAfter! / 60);
      return NextResponse.json({ error: `Too many contact submissions. Try again in ${retryAfterMinutes} minutes.` }, { status: 429 });
    }

    await connectDB();
    
    const body = await request.json();
    console.log('Request body received:', body);
    
    // Validate and sanitize input
    const validation = validateInput(body, contactSchema);
    console.log('Validation result:', validation);
    if (!validation.isValid) {
      return NextResponse.json({ error: `Validation failed: ${validation.errors.join(', ')}` }, { status: 400 });
    }

    const { fullName, email, phone, company, service, subject, message } = validation.sanitizedData;

    // Determine priority based on service type
    let priority = 'medium';
    if (service === 'Technical Support' || service === 'Security Systems') {
      priority = 'high';
    } else if (service === 'Partnership' || service === 'Cloud Services') {
      priority = 'high';
    }

    console.log('Creating new contact...');
    
    // Create new contact
    const newContact = new Contact({
      fullName,
      email: email.toLowerCase(),
      phone,
      company: company || '',
      service,
      subject,
      message,
      priority,
      status: 'new',
      source: 'Website Form',
      isRead: false
    });

    console.log('About to save contact:', {
      fullName: newContact.fullName,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      service: newContact.service,
      subject: newContact.subject,
      priority: newContact.priority
    });

    await newContact.save();
    
    console.log('Contact saved successfully:', {
      id: newContact._id,
      fullName: newContact.fullName,
      email: newContact.email,
      service: newContact.service
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for contacting us! We will get back to you within 24 hours.',
      data: {
        id: newContact._id,
        fullName: newContact.fullName,
        email: newContact.email
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating contact:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({ error: 'Failed to submit contact form. Please try again.' }, { status: 500 });
  }
}

// GET - Fetch contacts (admin only)
export async function GET(request: NextRequest) {
  try {
    console.log('GET request received for contacts');
    
    // Check admin authentication with JWT
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Build query
    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    console.log('Query:', query);
    
    // Fetch contacts
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('fullName email phone company service subject message status priority source isRead createdAt updatedAt');

    // Get total count for pagination
    const totalCount = await Contact.countDocuments(query);

    console.log(`Returning ${contacts.length} contacts out of ${totalCount} total`);

    return NextResponse.json({ 
      success: true, 
      data: contacts,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: skip + contacts.length < totalCount
      }
    });
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// PATCH - Update contact (admin only)
export async function PATCH(request: NextRequest) {
  try {
    console.log('PATCH request received for contact update');
    
    // Check admin authentication with JWT
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { id, updates } = body;
    
    console.log('Update request:', { id, updates });

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    // Validate allowed update fields
    const allowedFields = ['status', 'priority', 'isRead', 'notes'];
    const updateData: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    // Validate status values
    if (updateData.status && !['new', 'replied', 'in_progress', 'closed'].includes(updateData.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Validate priority values
    if (updateData.priority && !['low', 'medium', 'high'].includes(updateData.priority)) {
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 });
    }

    // Update the contact
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    console.log('Contact updated successfully:', {
      id: updatedContact._id,
      fullName: updatedContact.fullName,
      status: updatedContact.status,
      priority: updatedContact.priority
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contact updated successfully',
      data: updatedContact
    });
    
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// DELETE - Delete contact (admin only)
export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE request received for contact');
    
    // Check admin authentication with JWT
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { id } = body;
    
    console.log('Delete request for contact ID:', id);

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    // Find and delete the contact
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    console.log('Contact deleted successfully:', {
      id: deletedContact._id,
      fullName: deletedContact.fullName,
      email: deletedContact.email
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contact deleted successfully',
      data: {
        id: deletedContact._id,
        fullName: deletedContact.fullName
      }
    });
    
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}

// PUT - Bulk operations (admin only)
export async function PUT(request: NextRequest) {
  try {
    console.log('PUT request received for bulk operations');
    
    // Check admin authentication with JWT
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { operation, filters } = body;
    
    console.log('Bulk operation request:', { operation, filters });

    if (!operation) {
      return NextResponse.json(
        { success: false, error: 'Operation type is required' },
        { status: 400 }
      );
    }

    let result;
    let query: any = {};

    // Apply filters if provided
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
      }
      if (filters.priority && filters.priority !== 'all') {
        query.priority = filters.priority;
      }
      if (filters.service && filters.service !== 'all') {
        query.service = filters.service;
      }
    }

    switch (operation) {
      case 'markAllRead':
        result = await Contact.updateMany(query, { 
          isRead: true,
          updatedAt: new Date()
        });
        console.log(`Marked ${result.modifiedCount} contacts as read`);
        break;
        
      case 'markAllUnread':
        result = await Contact.updateMany(query, { 
          isRead: false,
          updatedAt: new Date()
        });
        console.log(`Marked ${result.modifiedCount} contacts as unread`);
        break;

      case 'updateStatus':
        if (!body.newStatus) {
          return NextResponse.json(
            { success: false, error: 'New status is required for status update' },
            { status: 400 }
          );
        }
        result = await Contact.updateMany(query, { 
          status: body.newStatus,
          updatedAt: new Date()
        });
        console.log(`Updated status for ${result.modifiedCount} contacts`);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid operation type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Bulk operation completed successfully`,
      data: {
        operation,
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });
    
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}

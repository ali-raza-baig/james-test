import { Request, Response } from 'express';
import Email, { IEmail } from '../models/Email.js';
import { createNotification } from './notificationController.js';

interface EmailRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyPrice?: string;
  propertyType?: string;
  propertyLocation?: string;
}

export const createEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      message,
      propertyId,
      propertyPrice,
      propertyType,
      propertyLocation
    }: EmailRequest = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      res.status(400).json({ 
        message: 'All fields are required: name, email, phone, message' 
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
      return;
    }

    // Create new email
    const emailRecord = new Email({
      name,
      email,
      phone,
      message,
      propertyId,
      propertyPrice,
      propertyType,
      propertyLocation,
      status: 'pending'
    });

    await emailRecord.save();

    // Create notification
    try {
      await createNotification(
        'contact',
        `New email inquiry from ${name}${propertyType ? ` for ${propertyType}` : ''}`,
        String(emailRecord._id)
      );
    } catch (notifError) {
      console.error('Failed to create notification (non-critical):', notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      message: 'Email inquiry submitted successfully',
      email: {
        id: emailRecord._id,
        name: emailRecord.name,
        email: emailRecord.email,
        status: emailRecord.status
      }
    });
  } catch (error) {
    console.error('Error creating email:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

export const getEmails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) {
      filter = { status };
    }

    const emails = await Email.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Email.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: emails,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      message: "Emails retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

export const getEmailById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = await Email.findById(id).lean();

    if (!email) {
      res.status(404).json({ 
        success: false,
        message: 'Email not found' 
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: email,
      message: "Email retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

export const updateEmailStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'responded', 'closed'].includes(status)) {
      res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be: pending, responded, or closed' 
      });
      return;
    }

    const email = await Email.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!email) {
      res.status(404).json({ 
        success: false,
        message: 'Email not found' 
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Email status updated successfully',
      data: email
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

export const deleteEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = await Email.findByIdAndDelete(id);

    if (!email) {
      res.status(404).json({ 
        success: false,
        message: 'Email not found' 
      });
      return;
    }

    res.status(200).json({ 
      success: true,
      message: 'Email deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};
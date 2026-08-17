import { Request, Response } from 'express';
import Contact from '../models/Contact.js';
import { createNotification } from './notificationController.js';

// Extended countries list
export const countries = [
  { name: "USA", code: "+1" },
  { name: "UAE", code: "+971" },
  { name: "KSA", code: "+966" },
  { name: "UK", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "India", code: "+91" },
  { name: "Pakistan", code: "+92" },
  { name: "Bangladesh", code: "+880" },
  { name: "China", code: "+86" },
  { name: "Japan", code: "+81" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Italy", code: "+39" },
  { name: "Spain", code: "+34" },
  { name: "Brazil", code: "+55" },
  { name: "Egypt", code: "+20" },
  { name: "South Africa", code: "+27" },
  { name: "Turkey", code: "+90" },
  { name: "Russia", code: "+7" }
];

// Get all countries
export const getCountries = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: countries,
      message: "Countries retrieved successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Create new contact
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      countryCode,
      countryName,
      phone,
      subject,
      message
    } = req.body;

    // Validate required fields
    if (!firstName || !email) {
      res.status(400).json({
        success: false,
        message: "name, email are required fields"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
      return;
    }

    if (countryCode) {
      const validCountry = countries.find(country => country.code === countryCode && country.name === countryName);
      if (!validCountry) {
        res.status(400).json({
          success: false,
          message: "Invalid country selection"
        });
        return;
      }

    }
    // Validate country code

    const fullPhone = countryCode ? `${countryCode} ${phone}` : phone;

    // Create new contact
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      countryCode,
      countryName,
      phone,
      fullPhone,
      subject: subject || "",
      message,
      status: 'new'
    });

    await newContact.save();

    // Create notification
    await createNotification(
      'contact',
      `New contact message from ${firstName} ${lastName ?? ''}: ${subject || 'No subject'}`,
      String(newContact._id)
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      data: {
        id: String(newContact._id),
        firstName: newContact.firstName,
        lastName: newContact.lastName,
        email: newContact.email,
        phone: newContact.fullPhone,
        subject: newContact.subject,
        message: newContact.message,
        createdAt: newContact.createdAt
      }
    });

  } catch (error: any) {
    console.error("Error creating contact:", error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all contacts (admin only)
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10, sort = '-createdAt' }: any = req.query;

    let filter: any = {};
    if (status) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort(sort)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .select('-__v');

    const total = await Contact.countDocuments(filter);

    const pagination = {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalContacts: total,
      hasNext: Number(page) < Math.ceil(total / Number(limit)),
      hasPrev: Number(page) > 1
    };

    res.status(200).json({
      success: true,
      data: contacts,
      pagination,
      message: "Contacts retrieved successfully"
    });
  } catch (error: any) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get single contact by ID
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id).select('-__v');

    if (!contact) {
      res.status(404).json({
        success: false,
        message: "Contact not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: contact,
      message: "Contact retrieved successfully"
    });
  } catch (error: any) {
    console.error("Error fetching contact:", error);

    if (error.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update contact status (admin only)
export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'new', 'read', 'replied', or 'archived'"
      });
      return;
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!contact) {
      res.status(404).json({
        success: false,
        message: "Contact not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: contact,
      message: `Contact status updated to ${status}`
    });
  } catch (error: any) {
    console.error("Error updating contact status:", error);

    if (error.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete contact (admin only)
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: "Contact not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting contact:", error);

    if (error.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
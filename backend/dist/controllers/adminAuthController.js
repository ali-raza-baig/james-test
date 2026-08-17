import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import mongoose from 'mongoose';
// Generate JWT Token
const generateToken = (adminId) => {
    return jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
// Register admin (use this to create first admin)
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validation
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
            return;
        }
        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({
                success: false,
                message: 'Admin already exists with this email'
            });
            return;
        }
        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password,
            role: 'admin'
        });
        // Generate token
        const token = generateToken(admin._id.toString());
        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    }
    catch (error) {
        console.error('Admin register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin registration'
        });
    }
};
// Login admin
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
            return;
        }
        // Find admin and include password for comparison
        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
            return;
        }
        // Check password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
            return;
        }
        // Generate token
        const token = generateToken(admin._id.toString());
        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin login'
        });
    }
};
// Get current admin
export const getAdminMe = async (req, res) => {
    try {
        const adminId = req.user;
        const admin = await Admin.findById(adminId).select('-password').lean();
        if (!admin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
            return;
        }
        res.json({
            success: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                phone: admin.phone || '',
                location: admin.location || '',
                bio: admin.bio || '',
                profileImage: admin.profileImage || '',
                yearsOfExperinces: admin.yearsOfExperinces || 0,
                totalSoldProperties: admin.totalSoldProperties || 0,
                locations: admin.locations || 0
            },
        });
    }
    catch (error) {
        console.error('Get admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
export const aboutInfo = async (req, res) => {
    try {
        const { adminId } = req.params;
        const adminObjectId = new mongoose.Types.ObjectId(adminId);
        const admin = await Admin.findById(adminObjectId).select('-password').lean();
        if (!admin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
            return;
        }
        res.json({
            success: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                phone: admin.phone || '',
                location: admin.location || '',
                bio: admin.bio || '',
                profileImage: admin.profileImage || '',
                yearsOfExperinces: admin.yearsOfExperinces || 0,
                totalSoldProperties: admin.totalSoldProperties || 0,
                locations: admin.locations || 0
            },
        });
    }
    catch (error) {
        console.error('Get admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
// Update admin profile
export const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user;
        const { name, email, phone, location, bio, yearsOfExperinces, totalSoldProperties, locations } = req.body;
        // Validation - name and email are required
        if (!name || !email) {
            res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
            return;
        }
        // Check if email is being changed and if it's already taken
        const existingAdmin = await Admin.findById(adminId);
        if (!existingAdmin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
            return;
        }
        if (email !== existingAdmin.email) {
            const emailExists = await Admin.findOne({ email, _id: { $ne: adminId } });
            if (emailExists) {
                res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
                return;
            }
        }
        // Handle profile image upload if file is provided
        let profileImageUrl = existingAdmin.profileImage;
        if (req.file) {
            const { uploadToCloudinary } = await import('../config/cloudinary.js');
            profileImageUrl = await uploadToCloudinary({ buffer: req.file.buffer, mimetype: req.file.mimetype }, 'mary-homes/admin-profiles');
        }
        // Update admin
        const updateData = {
            name,
            email,
            yearsOfExperinces,
            totalSoldProperties,
            locations,
            phone: phone || undefined,
            location: location || undefined,
            bio: bio || undefined,
            profileImage: profileImageUrl || undefined,
        };
        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        const admin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true, runValidators: true }).select('-password').lean();
        if (!admin) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                phone: admin.phone || '',
                location: admin.location || '',
                bio: admin.bio || '',
                profileImage: admin.profileImage || '',
            },
        });
    }
    catch (error) {
        console.error('Update admin profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

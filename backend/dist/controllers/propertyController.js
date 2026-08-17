import mongoose from 'mongoose';
import Property from '../models/Property.js';
import { createNotification } from './notificationController.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { generateUniqueSlug } from '../utils/slugGenerator.js';
export const getProperties = async (req, res) => {
    try {
        const { type, category, location, bedrooms, subtype, price: priceParamRaw, page = 1, limit = 12 } = req.query;
        // Normalize price param (can be string or array from query)
        const price = Array.isArray(priceParamRaw) ? priceParamRaw[0] : priceParamRaw;
        let filter = {};
        // Category filter
        if (category) {
            filter.category = category;
        }
        // Type filter
        if (subtype) {
            filter.type = subtype;
        }
        else if (type) {
            if (category === 'residential') {
                filter.type = { $in: ['apartment', 'villa', 'townhouse'] };
            }
            else if (category === 'commercial') {
                filter.type = { $in: ['retail', 'office'] };
            }
        }
        // Location filter
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        // Bedrooms filter
        if (bedrooms) {
            const bedNum = parseInt(bedrooms);
            if (bedrooms === '4+') {
                filter.bedrooms = { $gte: 4 };
            }
            else {
                filter.bedrooms = bedNum;
            }
        }
        // Price filter - use direct range (price is stored as number in schema)
        // 450000 must NOT appear when filtering 500k-1M
        if (price) {
            const priceParam = String(price).trim();
            if (priceParam === 'below-50000')
                filter.price = { $lt: 50000 };
            else if (priceParam === '50000-100000')
                filter.price = { $gte: 50000, $lte: 100000 };
            else if (priceParam === 'above-100000')
                filter.price = { $gt: 100000 };
            else if (priceParam === 'below-500000')
                filter.price = { $lt: 500000 };
            else if (priceParam === '500000-1000000')
                filter.price = { $gte: 500000, $lte: 1000000 };
            else if (priceParam === '1000000-2000000')
                filter.price = { $gte: 1000000, $lte: 2000000 };
            else if (priceParam === '2000000-5000000')
                filter.price = { $gte: 2000000, $lte: 5000000 };
            else if (priceParam === 'above-5000000')
                filter.price = { $gt: 5000000 };
        }
        // Use aggregation to ensure price filter is applied (find() can have issues with mixed filters)
        const pipeline = [
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) * 1 }
        ];
        const [countResult, propertiesResult] = await Promise.all([
            Property.countDocuments(filter),
            Property.aggregate(pipeline)
        ]);
        const total = countResult;
        const properties = propertiesResult;
        res.status(200).json({
            success: true,
            data: properties,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalProperties: total,
            },
            message: "Properties retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
export const getPropertyById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('getPropertyById called with id:', id);
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'Property identifier is required'
            });
            return;
        }
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            const readyStateMessages = {
                0: 'disconnected',
                1: 'connected',
                2: 'connecting',
                3: 'disconnecting'
            };
            const stateMessage = readyStateMessages[mongoose.connection.readyState] || 'unknown';
            console.error('❌ Database not connected. ReadyState:', mongoose.connection.readyState, `(${stateMessage})`);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Database connection error',
                    error: `Database is not connected. Status: ${stateMessage}`,
                    readyState: mongoose.connection.readyState
                });
            }
            return;
        }
        let property = null;
        try {
            // Try to find by slug first (convert to lowercase to match schema)
            const slugToSearch = id?.toLowerCase().trim();
            console.log('Searching for property with slug:', slugToSearch);
            property = await Property.findOne({ slug: slugToSearch }).lean();
            // If not found by slug and id looks like a MongoDB ObjectId, try findById
            if (!property && mongoose.Types.ObjectId.isValid(id)) {
                console.log('Slug not found, trying ObjectId:', id);
                try {
                    property = await Property.findById(id).lean();
                }
                catch (findByIdError) {
                    // If findById fails (invalid ObjectId format), ignore and continue
                    console.log('findById failed:', findByIdError?.message);
                }
            }
        }
        catch (queryError) {
            console.error('Database query error:', queryError);
            throw queryError;
        }
        if (!property) {
            console.log('Property not found for id:', id);
            res.status(404).json({
                success: false,
                message: 'Property not found'
            });
            return;
        }
        console.log('Property found:', property._id || property.id);
        // Property is already a plain object due to .lean(), but ensure it's serializable
        res.status(200).json({
            success: true,
            data: property,
            message: "Property retrieved successfully"
        });
    }
    catch (error) {
        console.error('❌ Error fetching property:', error);
        console.error('Error type:', error?.constructor?.name);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        console.error('Request params:', req.params);
        console.error('Database readyState:', mongoose.connection.readyState);
        // Ensure we always send a valid JSON response
        let errorMessage = 'Unknown server error';
        if (error?.message) {
            errorMessage = String(error.message);
        }
        else if (typeof error === 'string') {
            errorMessage = error;
        }
        else if (error?.toString) {
            errorMessage = error.toString();
        }
        // Check if database is the issue
        if (mongoose.connection.readyState !== 1) {
            errorMessage = 'Database is not connected. Please check your MongoDB connection.';
        }
        const errorResponse = {
            success: false,
            message: 'Server error',
            error: errorMessage,
            ...(process.env.NODE_ENV === 'development' && {
                details: {
                    type: error?.constructor?.name,
                    code: error?.code,
                    stack: error?.stack
                }
            })
        };
        // Make sure response hasn't been sent already
        if (!res.headersSent) {
            try {
                res.status(500).json(errorResponse);
            }
            catch (sendError) {
                console.error('Failed to send error response:', sendError);
            }
        }
        else {
            console.error('⚠️ Response already sent, cannot send error response');
        }
    }
};
// Get property by slug only
export const getPropertyBySlug = async (req, res) => {
    try {
        let { slug } = req.params;
        // Decode URL-encoded slug
        if (slug) {
            slug = decodeURIComponent(slug);
        }
        console.log('getPropertyBySlug called with slug:', slug);
        if (!slug) {
            res.status(400).json({
                success: false,
                message: 'Property slug is required'
            });
            return;
        }
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            const readyStateMessages = {
                0: 'disconnected',
                1: 'connected',
                2: 'connecting',
                3: 'disconnecting'
            };
            const stateMessage = readyStateMessages[mongoose.connection.readyState] || 'unknown';
            console.error('❌ Database not connected. ReadyState:', mongoose.connection.readyState, `(${stateMessage})`);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Database connection error',
                    error: `Database is not connected. Status: ${stateMessage}`,
                    readyState: mongoose.connection.readyState
                });
            }
            return;
        }
        // Normalize slug: lowercase and trim
        const slugToSearch = slug.toLowerCase().trim();
        console.log('Searching for property with normalized slug:', slugToSearch);
        const property = await Property.findOne({ slug: slugToSearch }).lean();
        if (!property) {
            console.log('Property not found for slug:', slugToSearch);
            res.status(404).json({
                success: false,
                message: 'Property not found',
                slug: slugToSearch
            });
            return;
        }
        console.log('✅ Property found by slug:', property._id || property.id, 'Title:', property.title);
        console.log('📸 Property images count:', property.images?.length || 0);
        if (property.images && property.images.length > 0) {
            console.log('📸 Images:', property.images);
        }
        res.status(200).json({
            success: true,
            data: property,
            message: "Property retrieved successfully"
        });
    }
    catch (error) {
        console.error('❌ Error fetching property by slug:', error);
        console.error('Error type:', error?.constructor?.name);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        console.error('Request params:', req.params);
        console.error('Database readyState:', mongoose.connection.readyState);
        let errorMessage = 'Unknown server error';
        if (error?.message) {
            errorMessage = String(error.message);
        }
        else if (typeof error === 'string') {
            errorMessage = error;
        }
        // Check if database is the issue
        if (mongoose.connection.readyState !== 1) {
            errorMessage = 'Database is not connected. Please check your MongoDB connection.';
        }
        const errorResponse = {
            success: false,
            message: 'Server error',
            error: errorMessage,
            ...(process.env.NODE_ENV === 'development' && {
                details: {
                    type: error?.constructor?.name,
                    code: error?.code,
                    stack: error?.stack,
                    slug: req.params.slug
                }
            })
        };
        if (!res.headersSent) {
            try {
                res.status(500).json(errorResponse);
            }
            catch (sendError) {
                console.error('Failed to send error response:', sendError);
            }
        }
        else {
            console.error('⚠️ Response already sent, cannot send error response');
        }
    }
};
export const getSimilarProperties = async (req, res) => {
    try {
        const { id, type } = req.params;
        if (!id || !type) {
            res.status(400).json({
                success: false,
                message: 'Property identifier and type are required'
            });
            return;
        }
        let currentProperty = null;
        // Find the current property by slug first (convert to lowercase)
        const slugToSearch = id.toLowerCase().trim();
        currentProperty = await Property.findOne({ slug: slugToSearch });
        // If not found by slug and id looks like a MongoDB ObjectId, try findById
        if (!currentProperty && mongoose.Types.ObjectId.isValid(id)) {
            try {
                currentProperty = await Property.findById(id);
            }
            catch (findByIdError) {
                console.log('findById failed in getSimilarProperties, continuing with slug search only');
            }
        }
        if (!currentProperty) {
            res.status(404).json({
                success: false,
                message: 'Property not found'
            });
            return;
        }
        const properties = await Property.find({
            type,
            _id: { $ne: currentProperty._id }
        }).limit(6).lean(); // Increased limit to 6 for better UX, .lean() for proper serialization
        res.status(200).json({
            success: true,
            data: properties,
            message: "Similar properties retrieved successfully"
        });
    }
    catch (error) {
        console.error('Error fetching similar properties:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            params: req.params
        });
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
// Get similar properties by slug
export const getSimilarPropertiesBySlug = async (req, res) => {
    try {
        let { slug, type } = req.params;
        // Decode URL-encoded slug
        if (slug) {
            slug = decodeURIComponent(slug);
        }
        if (!slug || !type) {
            res.status(400).json({
                success: false,
                message: 'Property slug and type are required'
            });
            return;
        }
        // Find the current property by slug (normalize to lowercase)
        const slugToSearch = slug.toLowerCase().trim();
        const currentProperty = await Property.findOne({ slug: slugToSearch }).lean();
        if (!currentProperty) {
            res.status(404).json({
                success: false,
                message: 'Property not found'
            });
            return;
        }
        // Find similar properties based on multiple criteria
        const properties = await Property.find({
            _id: { $ne: currentProperty._id },
            type: type,
            $or: [
                { location: currentProperty.location },
                { category: currentProperty.category },
                { propertyType: currentProperty.propertyType }
            ]
        }).limit(6).lean();
        res.status(200).json({
            success: true,
            data: properties,
            message: "Similar properties retrieved successfully"
        });
    }
    catch (error) {
        console.error('Error fetching similar properties by slug:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
export const createProperty = async (req, res) => {
    try {
        const adminId = req.user;
        // Parse amenities from JSON string if needed
        let amenities = [];
        if (req.body.amenities) {
            if (typeof req.body.amenities === 'string') {
                amenities = JSON.parse(req.body.amenities);
            }
            else {
                amenities = req.body.amenities;
            }
        }
        let amenityIconIndexes = [];
        if (req.body.amenityIconIndexes) {
            if (typeof req.body.amenityIconIndexes === 'string') {
                amenityIconIndexes = JSON.parse(req.body.amenityIconIndexes);
            }
            else if (Array.isArray(req.body.amenityIconIndexes)) {
                amenityIconIndexes = req.body.amenityIconIndexes;
            }
        }
        // Process amenity icons if files are uploaded
        if (req.files && typeof req.files === 'object' && 'amenityIcons' in req.files) {
            const amenityIconFiles = req.files.amenityIcons;
            for (let fileIndex = 0; fileIndex < amenityIconFiles.length; fileIndex++) {
                const iconFile = amenityIconFiles[fileIndex];
                const amenityIndex = amenityIconIndexes[fileIndex];
                if (iconFile &&
                    typeof amenityIndex === 'number' &&
                    amenities[amenityIndex]) {
                    try {
                        const iconUrl = await uploadToCloudinary({
                            buffer: iconFile.buffer,
                            mimetype: iconFile.mimetype,
                            originalname: iconFile.originalname
                        }, 'mary-homes/amenities');
                        amenities[amenityIndex].icon = iconUrl;
                    }
                    catch (uploadError) {
                        console.error(`Error uploading icon for amenity ${amenityIndex}:`, uploadError);
                        amenities[amenityIndex].icon = amenities[amenityIndex].icon || '';
                    }
                }
            }
        }
        // Ensure all amenities have icon field (even if empty string) - icon is now optional
        amenities.forEach((amenity) => {
            if (!amenity.hasOwnProperty('icon') || amenity.icon === null || amenity.icon === undefined) {
                amenity.icon = '';
            }
        });
        // Process property images/videos/files if uploaded
        // IMPORTANT: Cover image and additional images are kept separate
        let coverImageUrl = undefined;
        let additionalImageUrls = [];
        if (req.files && typeof req.files === 'object') {
            // Handle single cover image/video/file (from "Upload Cover Image/Video" field)
            if ('image' in req.files && req.files.image) {
                const coverFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
                coverImageUrl = await uploadToCloudinary({
                    buffer: coverFile.buffer,
                    mimetype: coverFile.mimetype,
                    originalname: coverFile.originalname
                }, 'mary-homes/properties');
            }
            // Handle multiple additional images/videos/files (from "Additional Images/Videos" field)
            // These should NEVER become the cover image
            if ('images' in req.files && req.files.images) {
                const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
                // Limit to 10 files
                const limitedFiles = files.slice(0, 10);
                const fileUrls = await Promise.all(limitedFiles.map(file => uploadToCloudinary({
                    buffer: file.buffer,
                    mimetype: file.mimetype,
                    originalname: file.originalname
                }, 'mary-homes/properties')));
                additionalImageUrls = fileUrls; // Store separately, don't mix with cover
            }
            // Handle SEO image
            if ('seoImage' in req.files && req.files.seoImage) {
                const seoFile = Array.isArray(req.files.seoImage) ? req.files.seoImage[0] : req.files.seoImage;
                req.body.seoImage = await uploadToCloudinary({
                    buffer: seoFile.buffer,
                    mimetype: seoFile.mimetype,
                    originalname: seoFile.originalname
                }, 'mary-homes/properties');
            }
        }
        // Build final images array: cover image first, then additional images
        let images = [];
        if (coverImageUrl) {
            images.push(coverImageUrl); // Cover image is always first
        }
        images.push(...additionalImageUrls); // Additional images come after
        // Generate unique slug from title
        const slug = await generateUniqueSlug(req.body.title || 'property', async (slugToCheck) => {
            const existing = await Property.findOne({ slug: slugToCheck });
            return !!existing;
        });
        // Parse price as number
        const priceNumber = typeof req.body.price === 'string'
            ? parseFloat(req.body.price.replace(/[^0-9.]/g, '')) || 0
            : Number(req.body.price) || 0;
        // Ensure at least one image is provided
        if (images.length === 0) {
            res.status(400).json({
                success: false,
                message: 'At least one image is required for the property',
                error: 'Please upload at least one image (cover image or additional images)'
            });
            return;
        }
        // Set coverImage - only from the cover image field, not from additional images
        // If no cover image was uploaded, coverImage remains undefined
        const coverImage = coverImageUrl || undefined;
        // Ensure amenities have valid structure (name is required, icon is optional)
        const validatedAmenities = amenities
            .map((amenity) => ({
            name: String(amenity.name || '').trim(),
            icon: amenity.icon ? String(amenity.icon).trim() : '' // Icon is optional, default to empty string
        }))
            .filter((amenity) => amenity.name.length > 0); // Remove amenities with empty names
        // Convert bedrooms and bathrooms to numbers
        const bedrooms = typeof req.body.bedrooms === 'string'
            ? parseInt(req.body.bedrooms) || 0
            : Number(req.body.bedrooms) || 0;
        const bathrooms = typeof req.body.bathrooms === 'string'
            ? parseInt(req.body.bathrooms) || 0
            : Number(req.body.bathrooms) || 0;
        const paymentPlans = JSON.parse(req.body?.paymentplans);
        const propertGroups = JSON.parse(req.body.propertygroups);
        const propertyData = {
            paymentPlans: paymentPlans,
            propertGroups: propertGroups,
            dld: req.body.dld,
            handOver: req.body.handOver,
            paymentInstalment: req.body.paymentInstalment,
            title: req.body.title,
            category: req.body.category,
            type: req.body.type,
            propertyType: req.body.propertyType,
            description: req.body.description,
            location: req.body.location,
            area: req.body.area,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            slug: slug,
            price: priceNumber,
            forSaleLabel: req.body.forSaleLabel || 'For Sale',
            mapUrl: req.body.mapUrl || '',
            timeAgo: req.body.timeAgo || 'Recently added',
            seoTitle: req.body.seoTitle || '',
            seoDescription: req.body.seoDescription || '',
            canonicalUrl: req.body.canonicalUrl || undefined,
            schemaMarkup: req.body.schemaMarkup || undefined,
            seoImage: req.body.seoImage || undefined,
            amenities: validatedAmenities,
            coverImage: coverImage, // Set cover image for preview on cards
            images: images,
            createdBy: adminId
        };
        const property = new Property(propertyData);
        await property.save();
        // Create notification - FIX: Type assertion for _id
        await createNotification('property', `New property added: ${propertyData.title} (${propertyData.category} - ${propertyData.type})`, property._id.toString());
        res.status(201).json({
            success: true,
            data: property,
            message: "Property created successfully"
        });
    }
    catch (error) {
        console.error('Error creating property:', error);
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.keys(error.errors || {}).forEach((key) => {
                validationErrors[key] = error.errors[key].message;
            });
            res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message,
                validationErrors: validationErrors
            });
            return;
        }
        // Handle other errors
        res.status(400).json({
            success: false,
            message: 'Error creating property',
            error: error.message || 'Unknown error occurred',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        // Parse amenities from JSON string if needed
        let amenities = [];
        if (req.body.amenities) {
            if (typeof req.body.amenities === 'string') {
                amenities = JSON.parse(req.body.amenities);
            }
            else {
                amenities = req.body.amenities;
            }
        }
        // Parse amenity icon index map
        let amenityIconIndexes = [];
        if (req.body.amenityIconIndexes) {
            if (typeof req.body.amenityIconIndexes === 'string') {
                amenityIconIndexes = JSON.parse(req.body.amenityIconIndexes);
            }
            else if (Array.isArray(req.body.amenityIconIndexes)) {
                amenityIconIndexes = req.body.amenityIconIndexes;
            }
        }
        // Process amenity icons if files are uploaded
        if (req.files && typeof req.files === 'object' && 'amenityIcons' in req.files) {
            const amenityIconFiles = req.files.amenityIcons;
            for (let fileIndex = 0; fileIndex < amenityIconFiles.length; fileIndex++) {
                const iconFile = amenityIconFiles[fileIndex];
                const amenityIndex = amenityIconIndexes[fileIndex];
                if (iconFile &&
                    typeof amenityIndex === 'number' &&
                    amenities[amenityIndex]) {
                    try {
                        const iconUrl = await uploadToCloudinary({
                            buffer: iconFile.buffer,
                            mimetype: iconFile.mimetype,
                            originalname: iconFile.originalname
                        }, 'mary-homes/amenities');
                        amenities[amenityIndex].icon = iconUrl;
                    }
                    catch (uploadError) {
                        console.error(`Error uploading icon for amenity ${amenityIndex}:`, uploadError);
                        amenities[amenityIndex].icon = amenities[amenityIndex].icon || '';
                    }
                }
            }
        }
        // Ensure all amenities have icon field (even if empty string) - icon is now optional
        amenities.forEach((amenity) => {
            if (!amenity.hasOwnProperty('icon') || amenity.icon === null || amenity.icon === undefined) {
                amenity.icon = '';
            }
        });
        // Process property images/videos/files if uploaded
        // IMPORTANT: Cover image and additional images are kept separate
        let newCoverImageUrl = undefined;
        let newAdditionalImageUrls = [];
        if (req.files && typeof req.files === 'object') {
            // Handle single cover image/video/file (from "Upload Cover Image/Video" field)
            if ('image' in req.files && req.files.image) {
                const coverFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
                newCoverImageUrl = await uploadToCloudinary({
                    buffer: coverFile.buffer,
                    mimetype: coverFile.mimetype,
                    originalname: coverFile.originalname
                }, 'mary-homes/properties');
            }
            // Handle multiple additional images/videos/files (from "Additional Images/Videos" field)
            // These should NEVER become the cover image
            if ('images' in req.files && req.files.images) {
                const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
                // Limit to 10 files
                const limitedFiles = files.slice(0, 10);
                const fileUrls = await Promise.all(limitedFiles.map(file => uploadToCloudinary({
                    buffer: file.buffer,
                    mimetype: file.mimetype,
                    originalname: file.originalname
                }, 'mary-homes/properties')));
                newAdditionalImageUrls = fileUrls; // Store separately, don't mix with cover
            }
            // Handle SEO image
            if ('seoImage' in req.files && req.files.seoImage) {
                const seoFile = Array.isArray(req.files.seoImage) ? req.files.seoImage[0] : req.files.seoImage;
                req.body.seoImage = await uploadToCloudinary({
                    buffer: seoFile.buffer,
                    mimetype: seoFile.mimetype,
                    originalname: seoFile.originalname
                }, 'mary-homes/properties');
            }
        }
        // Get existing property first (needed for image preservation and slug generation)
        const existingProperty = await Property.findById(id);
        // Build final images array: cover image first, then additional images
        let finalImages = [];
        let finalCoverImage = undefined;
        // Determine cover image: new cover if uploaded, otherwise existing cover
        if (newCoverImageUrl) {
            finalCoverImage = newCoverImageUrl;
            finalImages.push(newCoverImageUrl);
        }
        else if (req.body.existingCoverImage) {
            finalCoverImage = req.body.existingCoverImage;
            finalImages.push(req.body.existingCoverImage);
        }
        else if (existingProperty && existingProperty.images && existingProperty.images.length > 0) {
            // Fallback to existing cover image
            finalCoverImage = existingProperty.coverImage || existingProperty.images[0];
            finalImages.push(existingProperty.images[0]);
        }
        // Add existing additional images (if provided and not removed)
        if (req.body.existingImages) {
            let existingImages = [];
            if (typeof req.body.existingImages === 'string') {
                existingImages = JSON.parse(req.body.existingImages);
            }
            else if (Array.isArray(req.body.existingImages)) {
                existingImages = req.body.existingImages;
            }
            finalImages.push(...existingImages);
        }
        else if (existingProperty && existingProperty.images && existingProperty.images.length > 1 && !newCoverImageUrl && !req.body.existingCoverImage) {
            // If no new cover and no explicit existing cover, keep existing additional images
            finalImages.push(...existingProperty.images.slice(1));
        }
        // Add new additional images (these should NEVER become the cover)
        finalImages.push(...newAdditionalImageUrls);
        const images = finalImages;
        // Generate new slug if title changed
        let slug = undefined;
        if (existingProperty && req.body.title && req.body.title !== existingProperty.title) {
            slug = await generateUniqueSlug(req.body.title, async (slugToCheck) => {
                const existing = await Property.findOne({ slug: slugToCheck, _id: { $ne: id } });
                return !!existing;
            });
        }
        // Prepare update data - exclude amenities and images from req.body to avoid string/type issues
        const { amenities: _, images: __, ...restBody } = req.body;
        const updateData = { ...restBody };
        // Convert bedrooms and bathrooms to numbers if they're strings (from FormData)
        if (updateData.bedrooms !== undefined) {
            updateData.bedrooms = typeof updateData.bedrooms === 'string'
                ? parseInt(updateData.bedrooms) || 0
                : updateData.bedrooms;
        }
        if (updateData.bathrooms !== undefined) {
            updateData.bathrooms = typeof updateData.bathrooms === 'string'
                ? parseInt(updateData.bathrooms) || 0
                : updateData.bathrooms;
        }
        // Convert price to number if it's a string (from FormData)
        if (updateData.price !== undefined) {
            updateData.price = typeof updateData.price === 'string'
                ? parseFloat(updateData.price.replace(/[^0-9.]/g, '')) || 0
                : Number(updateData.price) || 0;
        }
        // Always set amenities (even if empty array) to override any string version from req.body
        updateData.amenities = amenities;
        // Set images if we have any, otherwise keep existing
        if (images.length > 0) {
            updateData.images = images;
            // Set coverImage - only from the cover image field, not from additional images
            updateData.coverImage = finalCoverImage || (images.length > 0 ? images[0] : undefined);
        }
        else if (existingProperty && existingProperty.images && existingProperty.images.length > 0) {
            // Keep existing cover image if no new images
            updateData.coverImage = existingProperty.coverImage || existingProperty.images[0];
        }
        if (slug) {
            updateData.slug = slug;
        }
        const property = await Property.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!property) {
            res.status(404).json({
                success: false,
                message: 'Property not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: property,
            message: "Property updated successfully"
        });
    }
    catch (error) {
        console.error('Error updating property:', error);
        res.status(400).json({
            success: false,
            message: 'Error updating property',
            error: error.message
        });
    }
};
export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findByIdAndDelete(id);
        if (!property) {
            res.status(404).json({
                success: false,
                message: 'Property not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
// Get SEO metadata for property by slug
export const getPropertySEO = async (req, res) => {
    try {
        let { slug } = req.params;
        // Decode URL-encoded slug
        if (slug) {
            slug = decodeURIComponent(slug);
        }
        // Normalize slug: lowercase and trim
        const slugToSearch = slug.toLowerCase().trim();
        const property = await Property.findOne({ slug: slugToSearch })
            .select('images seoTitle seoDescription title description')
            .lean();
        if (!property) {
            res.status(404).json({
                success: false,
                message: 'Property not found'
            });
            return;
        }
        // Get the first image as the main/featured image
        const mainImage = property.images && property.images.length > 0 ? property.images[0] : '';
        res.status(200).json({
            success: true,
            data: {
                image: mainImage, // Main/featured image (first image from images array)
                title: property.seoTitle || property.title, // SEO title or fallback to regular title
                description: property.seoDescription || property.description || '' // SEO description or fallback
            },
            message: "Property SEO metadata retrieved successfully"
        });
    }
    catch (error) {
        console.error("Error fetching property SEO:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

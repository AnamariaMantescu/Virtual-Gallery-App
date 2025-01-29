const { db } = require('../config/firebase');

/* get all artworks */
const getAllArtworks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startAt = (page - 1) * limit;

    // Get user role from the authenticated request
    const userRole = req.user?.role || 'visitor';
    
    // Create base query
    let artworksQuery = db.collection('artworks')
      .orderBy('metadata.createdAt', 'desc');

    // Apply role-based filtering
    if (userRole !== 'admin') {
      artworksQuery = artworksQuery.where('isApproved', '==', true);
    }

    // Get total count based on role
    let totalQuery = db.collection('artworks');
    if (userRole !== 'admin') {
      totalQuery = totalQuery.where('isApproved', '==', true);
    }
    const totalSnapshot = await totalQuery.get();
    const totalArtworks = totalSnapshot.size;

    // Apply pagination to main query
    artworksQuery = artworksQuery.offset(startAt).limit(limit);
    const artworksSnapshot = await artworksQuery.get();

    // Transform data
    const artworks = [];
    artworksSnapshot.forEach((doc) => {
      artworks.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      data: artworks,
      currentPage: page,
      totalPages: Math.ceil(totalArtworks / limit),
      totalItems: totalArtworks,
    });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    next({ statusCode: 500, message: 'Error fetching artworks' });
  }
};

/* get artwork by ID */
const getArtworkById = async (req, res, next) => {
  try {
    const artworkDoc = await db.collection('artworks').doc(req.params.id).get();
    
    if (!artworkDoc.exists) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    const artwork = { id: artworkDoc.id, ...artworkDoc.data() };
    const userRole = req.user?.role || 'visitor';

    // Check if user has access to this artwork
    if (!artwork.isApproved && userRole !== 'admin') {
      return next({ statusCode: 403, message: 'Access denied' });
    }

    res.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    next({ statusCode: 500, message: 'Error fetching artwork' });
  }
};

/* create artwork */
const createArtwork = async (req, res, next) => {
  try {
    const {
      title,
      artist,
      description,
      imageUrl,
      year,
      category,
      stock,
      medium,
      dimensions,
      status
    } = req.body;

    const newArtwork = {
      title,
      artist,
      description,
      imageUrl,
      year,
      category,
      stock,
      medium,
      dimensions,
      status,
      isApproved: req.user.role === 'admin', // Auto-approve if admin creates
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid,
        updatedAt: null,
      },
    };

    const docRef = await db.collection('artworks').add(newArtwork);
    res.status(201).json({ id: docRef.id, ...newArtwork });
  } catch (error) {
    console.error('Error creating artwork:', error);
    next({ statusCode: 500, message: 'Error creating artwork' });
  }
};

/* update artwork */
const updateArtwork = async (req, res, next) => {
  try {
    const artworkRef = db.collection('artworks').doc(req.params.id);
    const artworkDoc = await artworkRef.get();

    if (!artworkDoc.exists) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    const {
      title,
      artist,
      description,
      imageUrl,
      year,
      category,
      stock,
      medium,
      dimensions,
      status
    } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(artist && { artist }),
      ...(description && { description }),
      ...(imageUrl && { imageUrl }),
      ...(year !== undefined && { year }),
      ...(category && { category }),
      ...(stock !== undefined && { stock }),
      ...(medium && { medium }),
      ...(dimensions && { dimensions }),
      ...(status && { status }),
      'metadata.updatedAt': new Date().toISOString()
    };

    await artworkRef.update(updateData);
    
    const updatedDoc = await artworkRef.get();
    res.json({ id: req.params.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating artwork:', error);
    next({ statusCode: 500, message: 'Error updating artwork' });
  }
};

/* delete artwork */
const deleteArtwork = async (req, res, next) => {
  try {
    const artworkRef = db.collection('artworks').doc(req.params.id);
    const artworkDoc = await artworkRef.get();

    if (!artworkDoc.exists) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    await artworkRef.delete();
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    next({ statusCode: 500, message: 'Error deleting artwork' });
  }
};

module.exports = {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
};
const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const getAllArtworks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    let artworksQuery = db
      .collection('artworks')
      .orderBy('metadata.createdAt', 'desc');

    if (!req.user || req.user.role !== 'admin') {
      artworksQuery = artworksQuery.where('isApproved', '==', true);
    }

    let totalQuery = db.collection('artworks');
    if (!req.user || req.user.role !== 'admin') {
      totalQuery = totalQuery.where('isApproved', '==', true);
    }
    const totalSnap = await totalQuery.get();
    const totalArtworks = totalSnap.size;

    artworksQuery = artworksQuery.offset(offset).limit(limit);
    const snapshot = await artworksQuery.get();

    const artworks = [];
    snapshot.forEach((doc) => {
      artworks.push({ id: doc.id, ...doc.data() });
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

const getArtworkById = async (req, res, next) => {
  try {
    const docRef = db.collection('artworks').doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    const artworkData = { id: docSnap.id, ...docSnap.data() };

    if ((!req.user || req.user.role !== 'admin') && !artworkData.isApproved) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    res.json(artworkData);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    next({ statusCode: 500, message: 'Error fetching artwork' });
  }
};

const createArtwork = async (req, res, next) => {
  try {
    const {
      title,
      artist,
      description,
      imageUrl,
      year,
      style,
      medium,
      dimensions,
      status,
      collectionId
    } = req.body;

    const isAdmin = req.user && req.user.role === 'admin';

    const newArtwork = {
      title,
      artist,
      description,
      imageUrl,
      year,
      style,
      medium: medium || '',
      dimensions: dimensions || {},
      status: status || 'available',
      isApproved: isAdmin,
      collectionId: collectionId || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid,
        updatedAt: null
      }
    };

    const docRef = await db.collection('artworks').add(newArtwork);

    if (collectionId) {
      const collectionRef = db.collection('collections').doc(collectionId);
      await collectionRef.update({
        artworks: admin.firestore.FieldValue.arrayUnion(docRef.id)
      });
    }

    res.status(201).json({ id: docRef.id, ...newArtwork });
  } catch (error) {
    console.error('Error creating artwork:', error);
    next({ statusCode: 500, message: 'Error creating artwork' });
  }
};

const updateArtwork = async (req, res, next) => {
  try {
    const {
      title,
      artist,
      description,
      imageUrl,
      year,
      category,
      medium,
      dimensions,
      status,
      isApproved,
      collectionId // <- new
    } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(artist && { artist }),
      ...(description && { description }),
      ...(imageUrl && { imageUrl }),
      ...(year !== undefined && { year }),
      ...(category && { category }),
      ...(medium && { medium }),
      ...(dimensions && { dimensions }),
      ...(status && { status }),
      // Admin can set isApproved
      ...(isApproved !== undefined && { isApproved }),
      // Admin can also change collection
      ...(collectionId !== undefined && { collectionId }),
      'metadata.updatedAt': new Date().toISOString()
    };

    const docRef = db.collection('artworks').doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    await docRef.update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    console.error('Error updating artwork:', error);
    next({ statusCode: 500, message: 'Error updating artwork' });
  }
};

const approveArtwork = async (req, res, next) => {
  try {
    const artworkRef = db.collection('artworks').doc(req.params.id);
    const artworkSnap = await artworkRef.get();

    if (!artworkSnap.exists) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    const artworkData = artworkSnap.data();
    if (artworkData.isApproved) {
      return res.json({ message: 'Artwork already approved.' });
    }
    await artworkRef.update({
      isApproved: true,
      'metadata.updatedAt': new Date().toISOString()
    });

    if (artworkData.collectionId) {
      const collectionRef = db.collection('collections').doc(artworkData.collectionId);
      await collectionRef.update({
        artworks: admin.firestore.FieldValue.arrayUnion(req.params.id)
      });
    }

    res.json({ message: 'Artwork approved successfully' });
  } catch (error) {
    console.error('Error approving artwork:', error);
    next({ statusCode: 500, message: 'Error approving artwork' });
  }
};

const deleteArtwork = async (req, res, next) => {
  try {
    const docRef = db.collection('artworks').doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    await docRef.delete();
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
  approveArtwork
};

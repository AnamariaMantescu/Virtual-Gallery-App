const { db } = require('../config/firebase');

/* get all artworks */
const getAllArtworks = async (req, res, next) => {
  try {
    const artworksSnapshot = await db.collection('artworks').get();
    const artworks = [];
    artworksSnapshot.forEach((doc) => {
      artworks.push({ id: doc.id, ...doc.data() });
    });
    res.json(artworks);
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
    res.json({ id: artworkDoc.id, ...artworkDoc.data() });
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
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid,
        updatedAt: null
      }
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

    const artworkRef = db.collection('artworks').doc(req.params.id);
    const artworkDoc = await artworkRef.get();
    if (!artworkDoc.exists) {
      return next({ statusCode: 404, message: 'Artwork not found' });
    }

    await artworkRef.update(updateData);
    res.json({ id: req.params.id, ...updateData });
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
  deleteArtwork
};

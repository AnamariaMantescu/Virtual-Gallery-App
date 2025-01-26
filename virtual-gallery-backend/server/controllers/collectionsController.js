const { db } = require('../config/firebase');

/* get all collections */
const getAllCollections = async (req, res, next) => {
  try {
    const collectionsSnapshot = await db.collection('collections').get();
    const collections = [];
    collectionsSnapshot.forEach(doc => {
      collections.push({ id: doc.id, ...doc.data() });
    });
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    next({ statusCode: 500, message: 'Error fetching collections' });
  }
};

/* get collection by ID */
const getCollectionById = async (req, res, next) => {
  try {
    const collectionDoc = await db.collection('collections').doc(req.params.id).get();
    if (!collectionDoc.exists) {
      return next({ statusCode: 404, message: 'Collection not found' });
    }
    res.json({ id: collectionDoc.id, ...collectionDoc.data() });
  } catch (error) {
    console.error('Error fetching collection:', error);
    next({ statusCode: 500, message: 'Error fetching collection' });
  }
};

/* create collection */
const createCollection = async (req, res, next) => {
  try {
    const { title, description, artworks, curator, theme, isPublic } = req.body;

    const newCollection = {
      ...(title && { title }),
      ...(description && { description }),
      ...(artworks && { artworks }),
      ...(curator && { curator }),
      ...(theme && { theme }),
      ...(isPublic !== undefined && { isPublic }),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid,
        updatedAt: null
      }
    };

    const docRef = await db.collection('collections').add(newCollection);
    res.status(201).json({ id: docRef.id, ...newCollection });
  } catch (error) {
    console.error('Error creating collection:', error);
    next({ statusCode: 500, message: 'Error creating collection' });
  }
};

/* update collection */
const updateCollection = async (req, res, next) => {
  try {
    const { title, description, artworks, curator, theme, isPublic } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(artworks && { artworks }),
      ...(curator && { curator }),
      ...(theme && { theme }),
      ...(isPublic !== undefined && { isPublic }),
      'metadata.updatedAt': new Date().toISOString()
    };

    const collectionRef = db.collection('collections').doc(req.params.id);
    const collectionDoc = await collectionRef.get();
    if (!collectionDoc.exists) {
      return next({ statusCode: 404, message: 'Collection not found' });
    }

    await collectionRef.update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    console.error('Error updating collection:', error);
    next({ statusCode: 500, message: 'Error updating collection' });
  }
};

/* delete collection */
const deleteCollection = async (req, res, next) => {
  try {
    const collectionRef = db.collection('collections').doc(req.params.id);
    const collectionDoc = await collectionRef.get();
    if (!collectionDoc.exists) {
      return next({ statusCode: 404, message: 'Collection not found' });
    }

    await collectionRef.delete();
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    next({ statusCode: 500, message: 'Error deleting collection' });
  }
};

module.exports = {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};

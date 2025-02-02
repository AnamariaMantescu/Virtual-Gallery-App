const { db } = require('../config/firebase');

const getAllCollections = async (req, res, next) => {
  try {
    const collectionsSnapshot = await db.collection('collections').get();
    const collections = await Promise.all(
      collectionsSnapshot.docs.map(async (doc) => {
        const collectionData = { id: doc.id, ...doc.data() };

        if (collectionData.artworks && collectionData.artworks.length) {
          const artworkRefs = collectionData.artworks.map(artworkId =>
            db.collection('artworks').doc(artworkId)
          );
          const artworkDocs = await Promise.all(artworkRefs.map(ref => ref.get()));
          let artworks = artworkDocs
            .filter(artDoc => artDoc.exists)
            .map(artDoc => ({ id: artDoc.id, ...artDoc.data() }));

          if (!req.user || req.user.role !== 'admin') {
            artworks = artworks.filter(art => art.isApproved === true);
          }
          collectionData.artworks = artworks;
        } else {
          collectionData.artworks = [];
        }
        return collectionData;
      })
    );
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    next({ statusCode: 500, message: 'Error fetching collections' });
  }
};

const getCollectionById = async (req, res, next) => {
  try {
    const collectionDoc = await db.collection('collections').doc(req.params.id).get();
    if (!collectionDoc.exists) {
      return next({ statusCode: 404, message: 'Collection not found' });
    }

    let collection = { id: collectionDoc.id, ...collectionDoc.data() };

    if (collection.artworks && collection.artworks.length > 0) {
      const artworkRefs = collection.artworks.map((artworkId) =>
        db.collection('artworks').doc(artworkId)
      );
      const artworkDocs = await Promise.all(artworkRefs.map((ref) => ref.get()));

      let allArtworks = artworkDocs
        .filter((doc) => doc.exists)
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      if (!req.user || req.user.role !== 'admin') {
        allArtworks = allArtworks.filter((art) => art.isApproved === true);
      }

      collection.artworks = allArtworks;
    } else {
      collection.artworks = [];
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    next({ statusCode: 500, message: 'Error fetching collection' });
  }
};

const createCollection = async (req, res, next) => {
  try {
    const { title, description, artworks, curator, theme, isPublic } = req.body;

    const newCollection = {
      ...(title && { title }),
      ...(description && { description }),
      ...(artworks && { artworks }),
      ...(theme && { theme }),
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

const updateCollection = async (req, res, next) => {
  try {
    const { title, description, artworks, curator, theme, isPublic } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(artworks && { artworks }),
      ...(theme && { theme }),
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

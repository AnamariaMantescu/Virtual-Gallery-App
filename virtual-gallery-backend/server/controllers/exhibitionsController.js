const { db } = require('../config/firebase');

/* get all exhibitions */
const getAllExhibitions = async (req, res, next) => {
  try {
    const exhibitionsSnapshot = await db.collection('exhibitions').get();
    const exhibitions = [];
    exhibitionsSnapshot.forEach(doc => {
      exhibitions.push({ id: doc.id, ...doc.data() });
    });
    res.json(exhibitions);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    next({ statusCode: 500, message: 'Error fetching exhibitions' });
  }
};

/* get exhibition by ID */
const getExhibitionById = async (req, res, next) => {
  try {
    const exhibitionDoc = await db.collection('exhibitions').doc(req.params.id).get();
    if (!exhibitionDoc.exists) {
      return next({ statusCode: 404, message: 'Exhibition not found' });
    }
    res.json({ id: exhibitionDoc.id, ...exhibitionDoc.data() });
  } catch (error) {
    console.error('Error fetching exhibition:', error);
    next({ statusCode: 500, message: 'Error fetching exhibition' });
  }
};

/* create exhibition */
const createExhibition = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, artworks, coverImage } = req.body;

    const newExhibition = {
      ...(title && { title }),
      ...(description && { description }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(artworks && { artworks }),
      ...(coverImage && { coverImage }),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid,
        updatedAt: null
      }
    };

    const docRef = await db.collection('exhibitions').add(newExhibition);
    res.status(201).json({ id: docRef.id, ...newExhibition });
  } catch (error) {
    console.error('Error creating exhibition:', error);
    next({ statusCode: 500, message: 'Error creating exhibition' });
  }
};

/* update exhibition */
const updateExhibition = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, artworks, coverImage } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(artworks && { artworks }),
      ...(coverImage && { coverImage }),
      'metadata.updatedAt': new Date().toISOString()
    };

    const exhibitionRef = db.collection('exhibitions').doc(req.params.id);
    const exhibitionDoc = await exhibitionRef.get();
    if (!exhibitionDoc.exists) {
      return next({ statusCode: 404, message: 'Exhibition not found' });
    }

    await exhibitionRef.update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    console.error('Error updating exhibition:', error);
    next({ statusCode: 500, message: 'Error updating exhibition' });
  }
};

/* delete exhibition */
const deleteExhibition = async (req, res, next) => {
  try {
    const exhibitionRef = db.collection('exhibitions').doc(req.params.id);
    const exhibitionDoc = await exhibitionRef.get();
    if (!exhibitionDoc.exists) {
      return next({ statusCode: 404, message: 'Exhibition not found' });
    }

    await exhibitionRef.delete();
    res.json({ message: 'Exhibition deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    next({ statusCode: 500, message: 'Error deleting exhibition' });
  }
};

module.exports = {
  getAllExhibitions,
  getExhibitionById,
  createExhibition,
  updateExhibition,
  deleteExhibition
};

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const collectionsSnapshot = await db.collection('collections').get();
    const collections = [];
    collectionsSnapshot.forEach(doc => {
      collections.push({ id: doc.id, ...doc.data() });
    });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching collections' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const collectionDoc = await db.collection('collections').doc(req.params.id).get();
    if (!collectionDoc.exists) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json({ id: collectionDoc.id, ...collectionDoc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching collection' });
  }
});

router.post('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { title, description, artworks } = req.body;
    const newCollection = {
      title,
      description,
      artworks,
      createdAt: new Date(),
      createdBy: req.user.uid
    };
    const docRef = await db.collection('collections').add(newCollection);
    res.status(201).json({ id: docRef.id, ...newCollection });
  } catch (error) {
    res.status(500).json({ error: 'Error creating collection' });
  }
});

router.put('/:id', authMiddleware,requireAdmin, async (req, res) => {
  try {
    const { title, description, artworks } = req.body;
    const updateData = {
      title,
      description,
      artworks,
      updatedAt: new Date()
    };
    await db.collection('collections').doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    res.status(500).json({ error: 'Error updating collection' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.collection('collections').doc(req.params.id).delete();
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting collection' });
  }
});

module.exports = router;

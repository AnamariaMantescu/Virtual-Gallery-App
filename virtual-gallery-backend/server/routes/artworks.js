const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const artworksSnapshot = await db.collection('artworks').get();
    const artworks = [];
    artworksSnapshot.forEach(doc => {
      artworks.push({ id: doc.id, ...doc.data() });
    });
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching artworks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const artworkDoc = await db.collection('artworks').doc(req.params.id).get();
    if (!artworkDoc.exists) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    res.json({ id: artworkDoc.id, ...artworkDoc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching artwork' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, artist, description, imageUrl, year } = req.body;
    const newArtwork = {
      title,
      artist,
      description,
      imageUrl,
      year,
      createdAt: new Date(),
      createdBy: req.user.uid
    };
    const docRef = await db.collection('artworks').add(newArtwork);
    res.status(201).json({ id: docRef.id, ...newArtwork });
  } catch (error) {
    res.status(500).json({ error: 'Error creating artwork' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, artist, description, imageUrl, year } = req.body;
    const updateData = {
      title,
      artist,
      description,
      imageUrl,
      year,
      updatedAt: new Date()
    };
    await db.collection('artworks').doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    res.status(500).json({ error: 'Error updating artwork' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.collection('artworks').doc(req.params.id).delete();
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting artwork' });
  }
});

module.exports = router;
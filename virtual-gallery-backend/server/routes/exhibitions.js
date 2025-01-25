const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
 try {
   const exhibitionsSnapshot = await db.collection('exhibitions').get();
   const exhibitions = [];
   exhibitionsSnapshot.forEach(doc => {
     exhibitions.push({ id: doc.id, ...doc.data() });
   });
   res.json(exhibitions);
 } catch (error) {
   res.status(500).json({ error: 'Error fetching exhibitions' });
 }
});

router.get('/:id', async (req, res) => {
 try {
   const exhibitionDoc = await db.collection('exhibitions').doc(req.params.id).get();
   if (!exhibitionDoc.exists) {
     return res.status(404).json({ error: 'Exhibition not found' });
   }
   res.json({ id: exhibitionDoc.id, ...exhibitionDoc.data() });
 } catch (error) {
   res.status(500).json({ error: 'Error fetching exhibition' });
 }
});

router.post('/', authMiddleware, requireAdmin, async (req, res) => {
 try {
   const { title, description, startDate, endDate, artworks, coverImage } = req.body;
   const newExhibition = {
     title,
     description, 
     startDate,
     endDate,
     artworks,
     coverImage,
     createdAt: new Date(),
     createdBy: req.user.uid
   };
   const docRef = await db.collection('exhibitions').add(newExhibition);
   res.status(201).json({ id: docRef.id, ...newExhibition });
 } catch (error) {
   res.status(500).json({ error: 'Error creating exhibition' });
 }
});

router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
 try {
   const { title, description, startDate, endDate, artworks, coverImage } = req.body;
   const updateData = {
     title,
     description,
     startDate, 
     endDate,
     artworks,
     coverImage,
     updatedAt: new Date()
   };
   await db.collection('exhibitions').doc(req.params.id).update(updateData);
   res.json({ id: req.params.id, ...updateData });
 } catch (error) {
   res.status(500).json({ error: 'Error updating exhibition' });
 }
});

router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
 try {
   await db.collection('exhibitions').doc(req.params.id).delete();
   res.json({ message: 'Exhibition deleted successfully' });
 } catch (error) {
   res.status(500).json({ error: 'Error deleting exhibition' });
 }
});

module.exports = router;
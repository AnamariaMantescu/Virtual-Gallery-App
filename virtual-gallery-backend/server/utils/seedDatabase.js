const admin = require('firebase-admin');
const { db } = require('../config/firebase');
const { generateCollections, generateArtworks } = require('./faker');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    await clearCollections(['artworks', 'collections', 'exhibitions']);

    const collections = generateCollections(10);
    console.log(`Generated ${collections.length} collections`);

    const collectionIds = [];
    const collectionsBatch = db.batch();

    collections.forEach((collection) => {
      const docRef = db.collection('collections').doc();
      collectionIds.push(docRef.id);
      collectionsBatch.set(docRef, collection);
    });

    await collectionsBatch.commit();
    console.log('Stored collections in database');

    const artworks = generateArtworks(50, collectionIds);
    console.log(`Generated ${artworks.length} artworks`);

    const artworkIds = [];
    const artworksBatch = db.batch();

    artworks.forEach((artwork) => {
      const docRef = db.collection('artworks').doc();
      artworkIds.push(docRef.id);
      artworksBatch.set(docRef, artwork);
    });

    await artworksBatch.commit();
    console.log('Stored artworks in database');


    const updates = [];
    artworks.forEach((artwork, idx) => {
      const artworkId = artworkIds[idx];
      const collRef = db.collection('collections').doc(artwork.collectionId);

      updates.push(
        collRef.update({
          artworks: admin.firestore.FieldValue.arrayUnion(artworkId),
        })
      );
    });

    await Promise.all(updates);
    console.log('Collections updated with artwork IDs');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function clearCollections(collectionNames) {
  console.log('Clearing existing data...');

  for (const collectionName of collectionNames) {
    const snapshot = await db.collection(collectionName).get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Cleared ${collectionName} collection`);
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;

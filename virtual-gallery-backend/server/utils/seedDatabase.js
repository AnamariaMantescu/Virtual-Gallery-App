const { db } = require('../config/firebase');
const { generateArtworks, generateCollections, generateExhibitions } = require('./faker');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    await clearCollections(['artworks', 'collections', 'exhibitions']);

    const artworks = generateArtworks(50);
    console.log('Generated 50 artworks');
    
    const artworkIds = [];
    const artworksBatch = db.batch();
    
    artworks.forEach((artwork) => {
      const docRef = db.collection('artworks').doc();
      artworkIds.push(docRef.id);
      artworksBatch.set(docRef, artwork);
    });
    
    await artworksBatch.commit();
    console.log('Stored artworks in database');
    
    const collections = generateCollections(10, artworkIds);
    const collectionsBatch = db.batch();
    
    collections.forEach((collection) => {
      const docRef = db.collection('collections').doc();
      collectionsBatch.set(docRef, collection);
    });
    
    await collectionsBatch.commit();
    console.log('Stored collections in database');
    
    const exhibitions = generateExhibitions(5, artworkIds);
    const exhibitionsBatch = db.batch();
    
    exhibitions.forEach((exhibition) => {
      const docRef = db.collection('exhibitions').doc();
      exhibitionsBatch.set(docRef, exhibition);
    });
    
    await exhibitionsBatch.commit();
    console.log('Stored exhibitions in database');
    
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
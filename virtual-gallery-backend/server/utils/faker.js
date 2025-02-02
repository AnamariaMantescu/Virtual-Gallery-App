const { faker } = require('@faker-js/faker');


function generateCollections(count = 5) {
  const collections = [];
  for (let i = 0; i < count; i++) {
    collections.push({
      title: `${faker.word.adjective()} Collection ${faker.number.int({ min: 1, max: 999 })}`,
      description: faker.lorem.paragraphs(2),
      artworks: [],
      theme: faker.helpers.arrayElement([
        'Modern Masters',
        'Contemporary Visions',
        'Abstract Expressions',
        'Nature in Art',
        'Urban Life'
      ]),
      metadata: {
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        createdBy: faker.string.uuid()
      }
    });
  }
  return collections;
}

function generateArtworks(count = 5, collectionIds = []) {
  const artworks = [];
  for (let i = 0; i < count; i++) {
    artworks.push({
      artist: faker.person.fullName(),
      collectionId: faker.helpers.arrayElement(collectionIds),
      description: faker.lorem.sentence(),
      dimensions: {
        depth: faker.number.int({ min: 1, max: 10 }),
        height: faker.number.int({ min: 10, max: 50 }),
        width: faker.number.int({ min: 10, max: 50 })
      },
      imageUrl: `https://source.unsplash.com/800x600/?artwork,${faker.word.noun()}`,
      isApproved: faker.datatype.boolean(),
      medium: faker.helpers.arrayElement(['Paper', 'Canvas', 'Wood', 'Digital']),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: faker.string.uuid(),
        updatedAt: new Date().toISOString()
      },
      status: faker.helpers.arrayElement(['available', 'sold', 'reserved']),
      style: {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement([
          'Surrealism',
          'Cubism',
          'Pop Art',
          'Impressionism',
          'Pointillism',
          'Photorealism',
          'Persian Miniature',
          'Futurism',
          'African Tribal',
          'Symbolism',
          'Abstract',
          'Minimalism'
        ])
      },
      title: `${faker.word.adjective()} ${faker.word.noun()}`,
      year: faker.number.int({ min: 1900, max: 2025 })
    });
  }
  return artworks;
}

module.exports = {
  generateCollections,
  generateArtworks
};

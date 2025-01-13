const { faker } = require('@faker-js/faker');

function generateArtworks(count = 50) {
  const artworks = [];
  for (let i = 0; i < count; i++) {
    artworks.push({
      title: `${faker.word.adjective()} ${faker.word.noun()} ${faker.number.int({ min: 1, max: 999 })}`,
      artist: faker.person.fullName(),
      description: faker.lorem.paragraph(),
      imageUrl: `https://source.unsplash.com/800x600/?artwork,${faker.word.noun()}`,
      year: faker.number.int({ min: 1900, max: 2024 }),
      medium: faker.helpers.arrayElement(['Oil', 'Watercolor', 'Digital', 'Photography', 'Sculpture', 'Mixed Media']),
      dimensions: {
        width: faker.number.int({ min: 20, max: 200 }),
        height: faker.number.int({ min: 20, max: 200 }),
        unit: 'cm'
      },
      category: {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement(['Contemporary', 'Modern', 'Abstract', 'Realism', 'Impressionism']),
        tags: Array(3).fill().map(() => faker.word.adjective())
      },
      status: faker.helpers.arrayElement(['Available', 'On Display', 'In Storage', 'On Loan']),
      metadata: {
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        createdBy: faker.string.uuid()
      }
    });
  }
  return artworks;
}

function generateCollections(count = 10, artworkIds) {
  const collections = [];
  for (let i = 0; i < count; i++) {
    const selectedArtworks = faker.helpers.arrayElements(
      artworkIds,
      faker.number.int({ min: 3, max: Math.min(10, artworkIds.length) })
    );

    collections.push({
      title: `${faker.word.adjective()} Collection ${faker.number.int({ min: 1, max: 999 })}`,
      description: faker.lorem.paragraphs(2),
      artworks: selectedArtworks,
      curator: faker.person.fullName(),
      theme: faker.helpers.arrayElement(['Modern Masters', 'Contemporary Visions', 'Abstract Expressions', 'Nature in Art', 'Urban Life']),
      isPublic: faker.datatype.boolean(),
      metadata: {
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        createdBy: faker.string.uuid()
      }
    });
  }
  return collections;
}

function generateExhibitions(count = 5, artworkIds) {
  const exhibitions = [];
  for (let i = 0; i < count; i++) {
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 30, max: 90 }));

    const selectedArtworks = faker.helpers.arrayElements(
      artworkIds,
      faker.number.int({ min: 5, max: Math.min(15, artworkIds.length) })
    );

    exhibitions.push({
      title: `${faker.word.adjective()} ${faker.word.noun()} Exhibition`,
      description: faker.lorem.paragraphs(3),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      artworks: selectedArtworks,
      coverImage: `https://source.unsplash.com/1200x800/?exhibition,${faker.word.noun()}`,
      curator: faker.person.fullName(),
      location: {
        name: `${faker.location.city()} Gallery`,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country()
      },
      status: faker.helpers.arrayElement(['Upcoming', 'Ongoing', 'Past']),
      metadata: {
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        createdBy: faker.string.uuid()
      }
    });
  }
  return exhibitions;
}

module.exports = {
  generateArtworks,
  generateCollections,
  generateExhibitions
};
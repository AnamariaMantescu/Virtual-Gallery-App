const { db } = require('../config/firebase');

const getAllStyles = async (req, res, next) => {
  try {
    const stylesSnap = await db.collection('styles').orderBy('name').get();
    const styles = [];
    stylesSnap.forEach(doc => {
      const styleData = doc.data();
      console.log('Fetched style:', styleData);
      styles.push({ id: doc.id, ...styleData });
    });

    console.log('Total styles fetched:', styles.length);
    res.json({
      data: styles
    });
  } catch (error) {
    console.error('Error fetching styles:', error);
    next({ statusCode: 500, message: 'Error fetching styles', error: error.message });
  }
};

module.exports = {
  getAllStyles
};

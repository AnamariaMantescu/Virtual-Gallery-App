const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const authRoutes = require('./routes/auth');
const artworkRoutes = require('./routes/artworks');
const collectionRoutes = require('./routes/collections');
const exhibitionRoutes = require('./routes/exhibitions');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Adaugă aceste rute
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/exhibitions', exhibitionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Virtual GALLERY API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
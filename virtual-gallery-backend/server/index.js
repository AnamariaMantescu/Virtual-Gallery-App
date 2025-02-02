const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const authRouter = require('./routes/auth');
const artworksRouter = require('./routes/artworks');
const collectionsRouter = require('./routes/collections');
const usersRouter = require('./routes/users');
const stylesRouter = require('./routes/styles');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/artworks', artworksRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/styles', stylesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Virtual GALLERY API' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const searchRoute = require('./routes/search');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/search', searchRoute);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT} (0.0.0.0)`));

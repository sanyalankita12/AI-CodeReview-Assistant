const projectRoutes = require('./routes/projectRoutes');
const express = require('express');
const cors = require('cors');
require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server chal raha hai!');
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
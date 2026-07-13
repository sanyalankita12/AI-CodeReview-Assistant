require('./config/db');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server started');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
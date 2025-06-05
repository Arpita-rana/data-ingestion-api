const express = require('express');
const app = express();
const ingestRoutes = require('./routes/ingest'); // DO NOT add .js unless needed

app.use(express.json());
app.use('/api', ingestRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

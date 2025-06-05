// routes/ingest.js
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.send('Ingest route is working');
});

module.exports = router;

const express = require('express');
const router = express.Router();
const universalRender = require('./universal-render');

router.get('*', universalRender);

module.exports = router;
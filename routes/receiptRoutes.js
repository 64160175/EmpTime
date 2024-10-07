const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

router.get('/receipt', receiptController.getUsersForReceipt);

module.exports = router;
const express = require('express');
const router = express.Router();
const userReceiptController = require('../controllers/userreceiptController');

router.get('/user_receipt', userReceiptController.getUserReceipts);

module.exports = router;
const express = require('express');
const receiptController = require('../controllers/receiptController');
const router = express.Router();

router.get('/receipt', receiptController.getUsersForReceipt);
router.post('/upload-slip', receiptController.uploadSlip);
router.post('/update-slip-status', receiptController.updateSlipStatus);  // เพิ่ม route ใหม่

module.exports = router;
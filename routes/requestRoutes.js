const express = require('express');
const router = express.Router();
const RequestController = require('../controllers/requestController');

router.get('/request', RequestController.getRequests);
router.post('/update-request-status', RequestController.updateRequestStatus);


module.exports = router;
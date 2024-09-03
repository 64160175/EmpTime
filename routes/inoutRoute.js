const express = require('express');
const router = express.Router();
const inoutCodeController = require('../controllers/inoutCodeController');
const { checkPermission } = require('../controllers/PermissionController');

router.get('/gen_code', checkPermission([3]), (req, res) => {
    res.render('gen_code');
  });
  

router.post('/checkin_outcode',checkPermission([3]), inoutCodeController.generateCode);

module.exports = router;

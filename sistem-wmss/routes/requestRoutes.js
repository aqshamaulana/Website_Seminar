const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/', requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/pending', requestController.getPendingRequests);

module.exports = router;
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/', requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/pending', requestController.getPendingRequests);
router.post('/process-next-request', requestController.processNextRequest);
router.post('/trigger-pengurangan', requestController.finalizeRequest);


module.exports = router;
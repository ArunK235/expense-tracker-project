const express = require('express');

const resetpasswordController = require('../controllers/forgotpasswordc');


const router = express.Router();
router.post('/forgotpassword', resetpasswordController.forgotpassword)

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)



module.exports = router;
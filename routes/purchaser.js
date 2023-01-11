const express = require('express')
const purchaseController = require('../controllers/purchasec');
const userauthentication=require('../middlewares/auth')

const router = express.Router();


router.get('/premiummembership', userauthentication.Authenticate ,purchaseController.purchasePremium)
router.post('/updatetransctionstatus', userauthentication.Authenticate, purchaseController.updateTranscationStatus)

module.exports=router;

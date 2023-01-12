const express = require('express')

const userauthentication=require('../middlewares/auth')

const premiumController = require('../controllers/premium')

const router = express.Router();

router.get('/showLeaderBoard',userauthentication.Authenticate, premiumController.getUserLeaderBoard);

module.exports=router;

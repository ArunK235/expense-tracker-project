const express = require('express');

const userController=require('../controllers/userc')
const userauthentication=require('../middlewares/auth')

const router = express.Router();

router.post("/signup", userController.addUser);

router.post("/login",userController.getUser);



module.exports=router;
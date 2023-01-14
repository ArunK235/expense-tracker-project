const express = require('express');

const userController=require('../controllers/userc')


const router = express.Router();

router.post("/signup", userController.addUser);

router.post("/login",userController.getUser);

router.post('/forgotpassword', userController.SentForgetPasswordMail)

module.exports=router;
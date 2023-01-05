const express = require('express');

const userController=require('../controllers/userc')

const router = express.Router();

router.post('/signup', userController.addUser);

module.exports=router;
const express = require('express');

const expenseController=require('../controllers/expensec')

const userauthentication=require('../middlewares/auth')

const router = express.Router();

router.post('/addExpensive',userauthentication.Authenticate, expenseController.addExpensive)

router.get('/getExpensive', userauthentication.Authenticate ,expenseController.getExpensive)

router.delete('/deleteExpensive/:expenseid', userauthentication.Authenticate ,expenseController.deleteExpensive)

module.exports=router;

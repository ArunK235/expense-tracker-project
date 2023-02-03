const express = require('express');

const expenseController=require('../controllers/expensec')

const userauthentication=require('../middlewares/auth')

const router = express.Router();

router.post('/addExpensive',userauthentication.Authenticate, expenseController.addExpensive)

router.get('/getExpensive', userauthentication.Authenticate ,expenseController.getExpensive)

//router.get('/getExpensive/expensePerPage',userauthentication.Authenticate, expenseController.getExpensivePerPage)

router.get('/get/expensePerPage',userauthentication.Authenticate,expenseController.getExpensesPerPage)

router.delete('/deleteExpensive/:expenseid', userauthentication.Authenticate ,expenseController.deleteExpensive)

router.get('/download',userauthentication.Authenticate , expenseController.downloadexpense)

module.exports=router;

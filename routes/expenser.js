const express = require('express');

const expenseController=require('../controllers/expensec')

const router = express.Router();

router.post('/addExpensive', expenseController.addExpensive)
router.get('/getExpensive',expenseController.getExpensive)
router.delete('/deleteExpensive/:expenseid',expenseController.deleteExpensive)

module.exports=router;

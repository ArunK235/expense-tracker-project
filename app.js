const express = require('express');

const cors= require('cors');

const User=require('./models/user');
const Expense = require ('./models/expense')
const Order= require('./models/orders')
const Forgotpassword = require('./models/forgotpassword');
const db= require('./util/database');

const userR=require('./routes/userr');
const expenseR=require('./routes/expenser')
const purchaseR=require('./routes/purchaser')
const premiumR= require('./routes/premiumr')
const forgotPasswordR = require('./routes/forgotpasswordr')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userR)
app.use('/password',forgotPasswordR)
app.use('/expense', expenseR)
app.use('/user',expenseR)
app.use('/purchase',purchaseR)
app.use('/premium',premiumR)

const dotenv = require('dotenv');

// get config vars
dotenv.config();

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


db.sync({})
.then().catch((err)=>{
    console.log(err);
})
app.listen(3000);
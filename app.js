const express = require('express');

const cors= require('cors');

const User=require('./models/user');
const Expense = require ('./models/expense')
const Order= require('./models/orders')

const db= require('./util/database');

const userR=require('./routes/userr');
const expenseR=require('./routes/expenser')
const purchaseR=require('./routes/purchaser')
const premiumR= require('./routes/premiumr')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userR)
app.use('/expense', expenseR)
app.use('/purchase',purchaseR)
app.use('/premium',premiumR)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

db.sync({})
.then().catch((err)=>{
    console.log(err);
})
app.listen(3000);
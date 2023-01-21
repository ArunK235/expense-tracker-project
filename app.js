const express = require('express');

const cors= require('cors');

const User=require('./models/user');
const Expense = require ('./models/expense')
const Order= require('./models/orders')
const Forgotpassword = require('./models/forgotpassword');
const db= require('./util/database');
const dotenv = require('dotenv');
const helmet =require('helmet');
const fs = require('fs');
const path=require('path')
const morgan = require ('morgan');
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
// get config vars
dotenv.config();

const userR=require('./routes/userr');
const expenseR=require('./routes/expenser')
const purchaseR=require('./routes/purchaser')
const premiumR= require('./routes/premiumr')
const forgotPasswordR = require('./routes/forgotpasswordr')

const app = express();
app.use(helmet())
app.use(morgan('combined',{stream:accessLogStream}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userR)
app.use('/password',forgotPasswordR)
app.use('/expense', expenseR)
app.use('/user',expenseR)
app.use('/purchase',purchaseR)
app.use('/premium',premiumR)



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
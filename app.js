const express = require('express');

const cors= require('cors');

const User=require('./backend/models/user');
const Expense = require ('./backend/models/expense')
const Order= require('./backend/models/orders')
const Forgotpassword = require('./backend/models/forgotpassword');
const dotenv = require('dotenv');
dotenv.config();
const db= require('./backend/util/database');

const helmet =require('helmet');
const fs = require('fs');
const path=require('path')
const morgan = require ('morgan');
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});


const userR=require('./backend/routes/userr');
const expenseR=require('./backend/routes/expenser')
const purchaseR=require('./backend/routes/purchaser')
const premiumR= require('./backend/routes/premiumr')
const forgotPasswordR = require('./backend/routes/forgotpasswordr')

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
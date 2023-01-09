const express = require('express');

const cors= require('cors');

const User=require('./models/user');
const Expense = require ('./models/expense')
const db= require('./util/database');

const userR=require('./routes/userr');
const expenseR=require('./routes/expenser')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userR)
app.use('/expense', expenseR)

User.hasMany(Expense);
Expense.belongsTo(User);


db.sync()
.then().catch((err)=>{
    console.log(err);
})
app.listen(3000);
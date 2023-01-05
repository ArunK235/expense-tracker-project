const express = require('express');

const cors= require('cors');

const user=require('./models/user');
const db= require('./util/database');

const userR=require('./routes/userr');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userR)

db.sync().then().catch((err)=>{
    console.log(err);
})
app.listen(3000);
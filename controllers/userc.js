const User = require('../models/user')

module.exports.addUser=(req,res,next)=>{
    User.create({
        name:req.body.name,
        email : req.body.email,
        password : req.body.password
    })
    .then(()=>{
        res.sendStatus(200);
    })
    .catch(err => console.log(err));
}
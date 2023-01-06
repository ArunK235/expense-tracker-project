const User = require('../models/user')


function stringvalid(string){
    if(string === undefined || string.length === 0){
        return true;
    }else{
        return false
    }
}

module.exports.addUser=async (req,res,next)=>{
    try{
        const{name,email, password}=req.body;
        if(stringvalid(name) || stringvalid(email)|| stringvalid(password)){
            res.status(500).json({message: 'something missing'})
        }
        
        await User.create({name,email,password })
        .then(()=>{
           return res.status(200).json({message:'sucessfully created the user'});
        })
    }catch(err){
        console.log(err)
    } 
}
module.exports.getUser= async (req,res,next)=>{
    try{
        const {email, password}= req.body;
        console.log(email);
        User.findAll({ where: { email } })
        .then(user =>{
            if(user.length > 0){
                if(user[0].password === password){
                    res.status(200).json({ success: true, message: "user successfully loged in"})
                }
                else{
                    return res.status(401).json({ success:false, message: " User not authorized"})
                }
            }
            else{
                return res.status(404).json({success: false, message: 'User does not exist'})
            }
        })
        .catch(err =>{
            res.status(500).json({ success: false, message : 'err'})
        })
    }
    catch(err) {
        console.log(err);
    }
}
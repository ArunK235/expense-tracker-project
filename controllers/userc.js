const User = require('../models/user')

const bcrypt= require('bcrypt')

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
        const saltrounds= 10;
        bcrypt.hash(password, saltrounds, async(err, hash)=>{
            console.log(err);
            await User.create({name,email,password:hash })
            
            return res.status(200).json({message:'sucessfully created the user'});
        
        })
        
    }catch(err){
        console.log(err)
    } 
}
module.exports.getUser= async (req,res,next)=>{
    try{
        const {email, password}= req.body;
        if( stringvalid(email)|| stringvalid(password)){
            res.status(500).json({message: 'something missing'})
        }
        
        await User.findAll({ where: { email } })
        .then(user =>{
            if(user.length > 0){
                bcrypt.compare(password, user[0].password , (err, result)=>{
                    if(err){
                        throw new Error('something went wrong ')
                    }
                    else if(result === true)
                    {
                        res.status(200).json({ success: true, message: "user successfully loged in"})
                    }
                    else{
                        return res.status(401).json({ success:false, message: " User not authorized"})
                    }
                })
                
            }
            else{
                return res.status(404).json({success: false, message: 'User does not exist'})
            }
        })
        .catch(err =>{
            res.status(500).json({ success: false, message : err})
        })
    }
    catch(err) {
        console.log(err);
    }
}

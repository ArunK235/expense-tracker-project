const Expense = require('../models/expense')

module.exports.addExpensive= async (req,res,next)=>{
    try{
        const{amount,description,category}=req.body;
        await Expense.create({amount, description, category, userId : req.user.id })
        .then(()=>{
            res.status(200).json({message:'sucessfully added the expense'});
        })       
    }
    catch(err){
        console.log(err)
    } 
}
module.exports.getExpensive = async(req,res)=>{
    try{
        Expense.findAll({where:{ userId : req.user.id}}).then(expense =>{
            return res.status(200).json({ expense, success:true})
        })
        .catch(err =>{
            return res.status(402).json({error:err, success: false})
        })
    }
    catch(err){
        console.log(err)
    }
}
module.exports.deleteExpensive = async(req,res)=>{
    try{
        const expenseid = req.params.expenseid;
        if(expenseid == undefined || expenseid.length === 0){
            return res.status(400).json({success: false})
        }
        Expense.destroy({where:{id: expenseid, userId: req.user.id}}).then((noodrows)=>{
            if(noodrows ===0 ){
                res.status(500).json({success:false, message:'expense doesnot belongs to these user'})
            }
            return res.status(200).json({success: true, message: 'deleted successfully'})
        })
        .catch(err =>{
            return res.status(500).json({success:false , message:'failed'})
        })
    }
    catch{
        console.log(err);
    }
}
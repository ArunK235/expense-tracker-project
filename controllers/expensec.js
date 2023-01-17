const Expense = require('../models/expense')
//const AWS = require('aws-sdk');
const UserServices = require ('../services/userservices')
const S3Services = require('../services/s3services')

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
/*function uploadToS3(data, filename){
    const BUCKET_NAME ='expensetracking235';
    const IAM_USER_KEY='AKIAVGJDC44765WCTHP6';
    const IAM_USER_SECRET_KEY ='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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey : IAM_USER_SECRET_KEY
    })
    
    var params = {
        Bucket: BUCKET_NAME,
        Key : filename,
        Body : data,
        ACL: 'public-read'
    }
        return new Promise((resolve,reject )=>{
            s3bucket.upload(params, (err,s3response)=>{
                if(err){
                    console.log('something went wrong', err)
                    reject(err)
                }
                else{
                    console.log('success',s3response);
                    resolve(s3response.Location) ;
                }
            })
        })
        
    
}*/

module.exports.downloadexpense = async (req,res)=>{
    const expenses = await UserServices.getExpenses(req);
    //console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename= `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
    //console.log(fileURL,'error')
    res.status(200).json({fileURL, success:true})
}
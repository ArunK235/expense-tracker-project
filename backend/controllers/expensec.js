const Expense = require('../models/expense')
const User= require('../models/user')
//const AWS = require('aws-sdk');
const UserServices = require ('../services/userservices')
const S3Services = require('../services/s3services')
const fileData = require('../models/fileData')

module.exports.addExpensive= async (req,res,next)=>{
    try{
        const{amount,description,category}=req.body;
        const result = await Expense.create({amount, description, category, userId : req.user.id })
        res.status(200).json({allExpense:[result],message:'sucessfully added the expense'});
              
    }
    catch(err){
        console.log(err)
    } 
}
module.exports.getExpensive = async(req,res)=>{
    try{
        const id = req.user.id;
        const ispremium= req.user.ispremiumuser;
        const expenseData = await Expense.findAll({where:{userId:id}})
        const userFiles = await fileData.findAll({where:{userId:id}})
        if(expenseData){
            return res.status(200).json({success:true,message:expenseData,premium:ispremium,hasFiles:userFiles})
        }   
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
    const userId = req.user.id
    try{
        const checkUserPremium = await User.findOne({where:{id:userId}})
        console.log(checkUserPremium.ispremiumuser,'premium',typeof(checkUserPremium.ispremiumuser))
        if(checkUserPremium.ispremiumuser === 1){
            const expenses = await UserServices.getExpenses(req);
            //console.log(expenses);
            const stringifiedExpenses = JSON.stringify(expenses);
            const userId = req.user.id;
            const filename= `Expense${userId}/${new Date()}.txt`;
            const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
            //console.log(fileURL,'error')
            if(fileURL){
                await fileData.create({
                    URL:fileURL,
                    userId:userId
                })
            }
            const previousFiles = await fileData.findAll({where:{userId:userId}})
            console.log(previousFiles)
            return res.status(200).json({fileURL,success:true,userData:previousFiles})
        }
        else{
            throw new Error
        }   
    }
    catch(err){
        console.log(err);
    }
    
}
module.exports.getExpensesPerPage = async(req,res)=>{
    
    try{
        const userId = req.user.id
        const ispremium = Number(req.user.ispremiumuser)
        let page = Number(req.query.page || 1)
        let expensesPerPage = Number(req.query.expPerPage)
        console.log(page,expensesPerPage)
        const offset = (page-1)*expensesPerPage
        const expneseInfo = await Expense.findAll({where:{userId:userId},offset: offset, limit: expensesPerPage})
        let totalExpenses = await Expense.count({where:{userId:userId}})
        const userFiles = await fileData.findAll({where:{userId:userId}})
        console.log(totalExpenses)
        let lastPage = Math.ceil(totalExpenses/expensesPerPage)
        return res.status(200).json({
            allExpense:expneseInfo,
            currentPage:page,
            hasNextPage:(expensesPerPage*page)<totalExpenses,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            limit:expensesPerPage,
            lastPage:lastPage,
            ispremium:ispremium,
            hasFiles:userFiles
        })
    }
    catch(err){
        console.log(err,'error happend at expense per page')
    }
    
}
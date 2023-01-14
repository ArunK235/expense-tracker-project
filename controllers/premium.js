const User=require('../models/user');
const Expense = require('../models/expense');
const e = require('express');
const sequelize = require('../util/database');

module.exports.getUserLeaderBoard = async(req,res,next)=>{
    try{
        const userLeaderBoardDetails = await User.findAll({
            attributes :['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost']],
            include:[
                {
                    model: Expense,
                    attributes:[]
                }
            ],
            group:['user.id']
        })
        return res.status(200).json(userLeaderBoardDetails);
        /*const userAggregatedExpenses=await Expense.findAll({
            attributes :['userId',[sequelize.fn('sum',sequelize.col('expense.amount')),'total_cost']],
            group:['userId']
        });
        console.log(userAggregatedExpenses);
        const userAggregatedExpenses= {}
        expenses.forEach((expense)=>{
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.amount
            }
            else{
                userAggregatedExpenses[expense.userId] = expense.amount
            }
        })
        var userLeaderBoardDetails = [];
        users.forEach((user)=>{
            userLeaderBoardDetails.push({name:user.name, total_cost : userAggregatedExpenses[user.id]||0})
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b)=> b.total_cost - a.total_cost);*/
        //return res.status(200).json(userLeaderBoardDetails);

    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}
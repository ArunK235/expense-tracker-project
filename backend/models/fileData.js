const Sequelize= require('sequelize');
const { DataTypes } = require('sequelize')
const sequelize = require('../util/database');
const fileData = sequelize.define('fileExpense',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    URL:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = fileData
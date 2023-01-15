const Order= require("../models/orders")
const Razorpay = require('razorpay')
const userController= require('./userc')
const dotenv = require('dotenv');
dotenv.config();

module.exports.purchasePremium =  (req,res)=>{
    try{
        /*var rzp = new Razorpay ({
            key_id: 'rzp_test_2X1vrJVBMfHawA',
            key_secret: 'ieu6L1lUFK3DKsPXH4mEAkDY'
        })*/
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount=1499;

        rzp.orders.create({ amount, currency:'INR'}, (err, order) =>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({ orderid: order.id, status:'PENDING'}).then(()=>{
                return res.status(201).json({ order, key_id: rzp.key_id});
            })
            .catch(err => console.log(err))
        })
    }
    catch(err){
        console.log(err)
        res.status(403).json({message:'something error'})
    }
}

module.exports.updateTranscationStatus = async (req, res, next)=>{
    try{
        const userId = req.user.id
        const {payment_id, order_id}=req.body;
        const order= await Order.findOne({ where: {orderid:order_id}})
        const promise1=order.update({paymentid : payment_id, status:'SUCCESSFUL'})
        const promise2=req.user.update({ispremiumuser: true})
        
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(201).json({success:true, message:'transcation successful', token: userController.generateToken(userId, undefined,true)})
        })
        .catch(err =>{
            throw new Error(err);
        })     
    }
    catch(err){
        console.log(err);
        res.status(401).json({error:err, message:'something went wrong'})
    }
}
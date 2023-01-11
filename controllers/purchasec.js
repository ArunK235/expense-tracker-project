const Order= require("../models/orders")
const Razorpay = require('razorpay')

module.exports.purchasePremium =  (req,res)=>{
    try{
        var rzp = new Razorpay ({
            key_id: 'rzp_test_fwB4V1OZRzhSd6',
            key_secret: 'GgSJe6BzjkFVt7ILt8TuiAlJ'
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
        const {payment_id, order_id}=req.body;
        const order= await Order.findOne({ where: {orderid:order_id}})
        const promise1=order.update({paymentid : payment_id, status:'SUCCESSFUL'})
        const promise2=req.user.update({ispremiumuser: true})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(201).json({success:true, message:'transcation successful'})
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
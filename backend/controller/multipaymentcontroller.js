import catchasyncerror from "../middleware/catchasyncerror.js";
import Errorhandler from "../utils/errorhandler.js"
import dotenv from "dotenv"
if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config.env"})
};
import axios from "axios"



export const hitpaycontroller=catchasyncerror(async(req,res,next)=>{
    
    const {amount,currency,name,email}=req.body;
    const redirect_url=process.env.redirect_url;
    if(!amount){
        return next(new Errorhandler("Please enter amount",400))
    };
    if(!currency){
        return next(new Errorhandler("Please enter currecy",400))
    };
    if(!redirect_url){
        return next(new Errorhandler("Please enter url",400))
    };
    if(!name){
        return next(new Errorhandler("Please enter name",400))
    };
    if(!email){
        return next(new Errorhandler("Please enter email",400))
    }

    const hitpaydata=await axios.post(`https://api.sandbox.hit-pay.com/v1/payment-requests`,{
        amount,currency,redirect_url,name,email,
    },{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "X-Requested-With":"XMLHttpRequest",
            "X-BUSINESS-API-KEY":process.env.hitpay_api_key
        }
    });
    const requiredurl=hitpaydata.data.url;

    res.status(200).json({
        success:true,
        url:requiredurl
    })

    


        });


export const checkpaymentstatuscontroller=catchasyncerror(async(req,res,next)=>{
    const {ref}=req.body;
    if(!ref){
        return next(new Errorhandler("server did not find payment id, try again later, please",400))
    }

    const checkstatus=await axios.get(`https://api.sandbox.hit-pay.com/v1/payment-requests/${ref}`,{
        headers:{
            "X-BUSINESS-API-KEY":process.env.hitpay_api_key
        }
    });
    
    const paymentstatus=checkstatus.data;
    if(paymentstatus && paymentstatus.status!=="completed"){
        return next(new Errorhandler("some error occured, please try again later",400))
    }
    const amount=paymentstatus.amount;
    const currency=paymentstatus.currency;
    const name=paymentstatus.name;
    const email=paymentstatus.email;
    
    res.status(200).json({
        success:true,
        message:"payment done successfully",
        name,email,currency,amount
    })
})


        
import catchasyncerror from "../middleware/catchasyncerror.js";
import Errorhandler from "../utils/errorhandler.js"
import dotenv from "dotenv"
if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config.env"})
};
import axios from "axios";
import stripe from "stripe";

const secretkey=process.env.stripe_secret_key;


export const checkoutsessioncontroller=catchasyncerror(async(req,res,next)=>{
    let {amount,currency,email,name}=req.body;
    if(!amount || !currency ||!email ||!name){
        return next(new Errorhandler("missing required parameters", 400))
    };
    currency=currency.toLowerCase()
    const stripeapikey=process.env.stripe_api_key;
    if(!stripeapikey){
        return next(new Errorhandler("missing key, not founnd", 400))
    }
    const stripeclient=new stripe(secretkey,{
        apiVersion:"2023-10-16"
    })
    const session=await stripeclient.checkout.sessions.create({
        payment_method_types: ['card'],          
          mode: 'payment',
          line_items:[
            {
                price_data:{
                    currency:currency,
                    product_data:{
                        name:"total_amount"
                    },
                    unit_amount:amount*100,
                },
                quantity:1,
            },
            
          ],
          metadata:{
            name:name,
          },
          customer_email:"Khurram@gmail.com",
          success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `http://localhost:3000/cancel.html`,
          
    })
    const sessionurl=session.url;

    
    
    res.status(200).json({
        success:true,
        sessionurl:sessionurl,
    })
});


export const checkstripecontroller=catchasyncerror(async(req,res,next)=>{
    const {stripesessionid}=req.body;

    if(!stripesessionid){
        return next(new Errorhandler("missing required id, network problem", 400))
    }
    const stripeclient=new stripe(secretkey,{
        apiVersion:"2023-10-16"
    })
    const sessionid=stripesessionid;

    const session=await stripeclient.checkout.sessions.retrieve(sessionid);
    const amount=session.amount_total/100;
    const currency=session.currency;
    const name=session.metadata.name;
    const email=session.customer_email;
    
    res.status(200).json({
        success:true,
        amount,
        currency,
        name,
        email,
        session

    })

})


        
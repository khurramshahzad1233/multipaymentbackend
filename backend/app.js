import express from "express";
import Errormiddleware from './middleware/error.js'
import multipayment from "./routes/multipaymentroute.js"
import stripepayment from "./routes/striperoute.js"
import bodyParser from "body-parser";
import cors from 'cors'
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cors())


app.use('/api',multipayment);
app.use("/api",stripepayment);


app.use(Errormiddleware)
export default app;

import express from "express"
import { checkpaymentstatuscontroller, hitpaycontroller } from "../controller/multipaymentcontroller.js";

const router=express.Router();
router.route("/hitpay/new").post(hitpaycontroller);
router.route("/hitpay/status").post(checkpaymentstatuscontroller)





export default router  ;
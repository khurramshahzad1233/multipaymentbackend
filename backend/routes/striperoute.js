import express from "express"
import { checkoutsessioncontroller, checkstripecontroller } from "../controller/stripepaymentcontroller.js";

const router=express.Router();
router.route("/stripe/checkoutsession").post(checkoutsessioncontroller);
router.route("/stripe/status").post(checkstripecontroller)




export default router;
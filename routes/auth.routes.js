import express from 'express';
import { signup,signin } from '../controllers/auth.controllers.js';
const router = express.Router();

router.post("/signup",signup)
router.post("/signin",signin)
router.get("/logout",(req,res) => {
    res.clearCookie("access_token").json({message:"Logged out"})
})
export default router;
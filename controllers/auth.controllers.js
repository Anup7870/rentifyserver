import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { erroHandler } from '../utils/errorhandler.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req, res,next) => {
    const { firstName, lastName, email, phone, password, role } = req.body;
    if(!firstName || !lastName || !email || !phone || !password){
        return next(erroHandler(400,"All fields are required"));
    }
    // console.log(req.body)
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User ({
        firstName,
        lastName,
        email,
        phone,
        password:hashedPassword,
        role
    });

    try {
        await user.save();
        res.status(201).json({message:"User created successfully"})
    } catch (error) {
        next(error)
    }

}

export const signin = async (req, res,next) => {
    const {email,password} = req.body;
    if(!email || !password|| !email.trim() || !password.trim()){
        return next(erroHandler(400,"All fields are required"));
    }
    

    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(erroHandler(400,"Invalid email or password"));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword){
            return next(erroHandler(400,"Invalid email or password"));
        }
        const token = jwt.sign({
            id:validUser._id,
           
        },process.env.JWT_SECRET)
        const {password:pass, ...rest} = validUser._doc;
        return res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest)
    } catch (error) {
        next(error)
    }
}

export const signout = async (req, res,next) => {
    return res.clearCookie("access_token").json({message:"Signout successfully"})
}
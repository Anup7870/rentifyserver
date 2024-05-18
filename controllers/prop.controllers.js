import Prop from '../models/prop.model.js';
import {erroHandler} from '../utils/errorHandler.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
dotenv.config();
export const createProperty = async (req, res, next) => {
    // console.log(req.body)
    const {type, for_, prize, bed, bath, area, discription, city, pincode, nearby, image,userId} = req.body;
    if(!type || !for_ || !prize || !bed || !bath || !area || !discription || !city || !pincode || !nearby || !image){
        return next(erroHandler(400,"All fields are required"));
    }
    // console.log(req.body)
    const newProp = new Prop({
        userId,
        type,
        for_,
        prize,
        bed,
        bath,
        area,
        discription,
        city,
        pincode,
        image,
        nearby:{
            hospital:nearby.Hospital,
            school:nearby.School,
            playground:nearby.Playground
        
        }
    });
    try {
        await newProp.save();
        res.status(201).json({message:"Property created successfully"})
    } catch (error) {
        next(error)
    }
}

export const getProp = async (req, res, next) => {
    // console.log(req.query)
    const query = {};
    console.log(req.query)
    req.query.city && (query.city = req.query.city);
    req.query.bed && (query.bed = req.query.bed);
    req.query.bath && (query.bath = req.query.bath);
    req.query.area && (query.area = req.query.area);
    req.query.pincode && (query.pincode = req.query.pincode);
    req.query.hospital && (query.hospital = req.query.hospital);
    req.query.school && (query.school = req.query.school);
    req.query.playground && (query.playground = req.query.playground);
    req.query.userId && (query.userId = req.query.userId);
    
    try {
        const prop = await Prop.find(query);
        return res.status(200).json({prop})
    } catch (error) {
        next(error)
    }
}

export const like = async (req, res, next) => {
    const {propId,userId} = req.body;
    if(!propId || !userId){
        return next(erroHandler(400,"All fields are required"));
    }
    try {
        const prop = await Prop.findById(propId);
        if(!prop){
            return next(erroHandler(404,"Property not found"));
        }
        if(prop.likes.includes(userId)){
            //unlike the post
            prop.likes = prop.likes.filter((id) => id !== userId);
            await prop.save();
            return res.status(200).json({message:"Unliked"})
        }
        prop.likes.push(userId);
        await prop.save();
        return res.status(200).json({message:"Liked"})
    } catch (error) {
        next(error)
    }
}

// for sending the mail to both the user and the owner of the property

let transporer = nodemailer.createTransport({
    host: process.env.smtp_host ,
    port:process.env.smtp_port,
    secure:false,
    auth:{
        user:process.env.user,
        pass:process.env.password
    }
})

export const contact = async (req, res, next) => {
    const {user,propId} = req.body;
    console.log(user)
    if(!user || !propId){
        return next(erroHandler(400,"All fields are required"));
    }
    try {
        
        const prop = await Prop.findById(propId);
        if(!prop){
            return next(erroHandler(404,"Property not found"));
        }
        console.log(prop.userId)
        const sellerId = await User.findById(prop.userId);
        // send mail to the owner of the property using nodemailer
        console.log(sellerId)
        var ownerEmailOption ={
            from:process.env.user,
            to:prop.userId,
            subject:"Interested in your property",
            text:`${user.firstName} ${user.lastName} is interested in your property please contact him on ${user.email} or you can contact him on his phone number ${user.phone} `
        } 

        var userEmailOption ={
            from:process.env.user,
            to:user.email,
            subject:"Property details",
            text:`You have shown interest in the property ${prop.type} located in ${prop.city} the owner of the property will contact you soon or you can contact him on his phone number ${sellerId.phone} or email him on ${sellerId.email}`
        }
        try {
            await transporer.sendMail(ownerEmailOption);
            await transporer.sendMail(userEmailOption);
            console.log("Mail sent")
            return res.status(200).json({message:"Mail sent"})
        } catch (error) {
            next(error)
        }
        // await transporer.sendMail(ownerEmailOption);
        // await transporer.sendMail(userEmailOption);
        
        return res.status(200).json({message:"Mail sent"})
    } catch (error) {
        next(error)
    }
}


// delte the property

export const deleteProp = async (req, res, next) => {
    console.log(req.query)
    const {propId} = req.query;
    if(!propId){
        return next(erroHandler(400,"All fields are required"));
    }
    try {
        const prop = await Prop.findByIdAndDelete(propId);
        if(!prop){
            return next(erroHandler(404,"Property not found"));
        }
        return res.status(200).json({message:"Property deleted successfully"})
    } catch (error) {
        next(error)
    }
}
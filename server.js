// IgG9OTDIqXmLqFsM
// mongodb+srv://kumaranup2505:<password>@mearn-blog.ul2poel.mongodb.net/?retryWrites=true&w=majority&appName=mearn-blog
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from './routes/auth.routes.js';
import prop from './routes/prop.routes.js';
const app = express();

app.listen(443,()=>{
    console.log("server is runing on port 3000");
    mongoose.connect("mongodb+srv://kumaranup2505:IgG9OTDIqXmLqFsM@mearn-blog.ul2poel.mongodb.net/rentify?retryWrites=true&w=majority&appName=mearn-blog").then(()=>{
        console.log("Database connected");
    })
})
app.use(cors({
    origin: '*'
  }));
// App Middleware
app.use(express.json());
// app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use("/api/auth",auth )
app.use("/api/prop",prop)
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        sucess:false,
        statusCode,
        message
    });
})

app.post("/",(req,res)=>{
    return res.json({message:"Hello World"})
})
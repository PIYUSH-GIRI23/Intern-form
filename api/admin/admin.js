const express = require('express');
const db=require('../../database/db');
var jwt = require('jsonwebtoken');
const validity = require('../../middleware/validity');
// const validity=require('../../middleware/validity');
const router = express.Router();
const jwtkey=process.env.SECRET_KEY
const id=process.env.admin_id;
const password=process.env.admin_password;
router.post('/credentials',(req,res)=>{
    try{
        const {admin_id,admin_password}=req.body;
        if(id===admin_id && password===admin_password){
            const jwtpayload={
                userId:id
            }
            const token=jwt.sign(jwtpayload,jwtkey,{expiresIn:"30d"});
            return res.json({message:'login successful',status:200,token:token});
        }
        return res.json({message:'Invalid Credentials',status:400});
    }
    catch(err){
        res.json({message:err.message,status:500});
    }
})
router.post('/details',async(req,res)=>{
    // detailsid 1 for doctor and detailsid 2 for speciality
    try{
        const {Patients} = await db();
        const verify=validity(req,id,jwtkey);
        if(verify.status===200){
            const {detailsid}=req.body;
            // console.log(detailsid);
            if(detailsid==1){
                const details=await Patients.find({type:"Doctor"}).toArray();
                return res.json({message:'Details fetched successfully',status:200,details:details});
            }
            if(detailsid==2){
                const details=await Patients.find({type:"Specialist"}).toArray();
                return res.json({message:'Details fetched successfully',status:200,details:details});
            }
            return res.json({message:'Invalid detailsid',status:400});
        }
        return res.json({message:verify.message,status:verify.status});
    }
    catch(err){
        res.json({message:err.message,status:500});
    }
})
module.exports = router;
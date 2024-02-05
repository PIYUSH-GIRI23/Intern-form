const express = require('express');
const db=require('../../database/db');
const router = express.Router();
/*

Form 1: Doctor

email
name
phone number
age

Form 2 : specialist

email
name
phone number
age
specialization
suferring from how many days
Details


*/
const form1check=(email,phone,age)=>{
    const emailRegex = /^[^\d][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^\d{10}$/;
    const ageRegex = /^\d+$/;
    const emailvalid=emailRegex.test(email);
    const phonevalid=phoneRegex.test(phone);
    const agevalid=ageRegex.test(age);
    if(!emailvalid) return {message:'Email is not valid',status:450};
    if(!phonevalid) return {message:'Phone number is not valid',status:451};
    if(!agevalid) return {message:'Age is not valid',status:452};
    return {message:'Valid',status:200}

}
const form2check=(email,phone,age,days)=>{
    const emailRegex = /^[^\d][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^\d{10}$/;
    const ageRegex = /^\d+$/;
    const daysRegex = /^\d+$/;
    const emailvalid=emailRegex.test(email);
    const phonevalid=phoneRegex.test(phone);
    const agevalid=ageRegex.test(age);
    const daysvalid=daysRegex.test(days);
    if(!emailvalid) return {message:'Email is not valid',status:450};
    if(!phonevalid) return {message:'Phone number is not valid',status:451};
    if(!agevalid) return {message:'Age is not valid',status:452};
    if(!daysvalid) return {message:'Days is not valid',status:453};
    return {message:'Valid',status:200}
}
const getdate=()=>{
    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const formattedDate = `${day}/${month}/${year}`;

    const formattedTime = `${hours}:${minutes}`;

    return {date:formattedDate,time:formattedTime};

}
router.post('/submitform',async(req,res)=>{
    try{
        // connecting to database
        const {Patients} = await db();

        // getting form id a/w to which particular form is submitted
        const {formid} = req.body;

        // form 1
        if(formid===1){
            const {email,name,phone_number,age} = req.body;

            //validtion
            const response=form1check(email,phone_number,age);
            if(response.status==200){
                // check if the email already exists
                const checkemail=await Patients.findOne({email:email});
                if(checkemail) return res.json({message:"Email already exists",status:410});
                
                // check if the phone number already exists
                const checkphone=await Patients.findOne({phone_number:phone_number});
                if(checkphone) return res.json({message:"Phone number already exists",status:411});

                // if both feilds unique then insert the data
                const patientDetails={
                    email:email,
                    name:name,
                    phone_number:phone_number,
                    age:age,
                    type:"Doctor",
                    submitdate:getdate().date,
                    submittime:getdate().time
                }
                const insertpatient=await Patients.insertOne(patientDetails);
                if(insertpatient){
                    return res.json({message:"Form 1 submitted Successfully",status:200});
                }
                return res.json({message:"Error while submitting form",status:401});
            }
            return res.json({message:response.message,status:400});
        }

        // form 2
        if(formid===2){
            const {email,name,phone_number,age,specialization,days,Details} = req.body;

            //validation
            const response=form2check(email,phone_number,age,days);
            if(response.status==200){
                // check if the email already exists
                const checkemail=await Patients.findOne({email:email});
                if(checkemail) return res.json({message:"Email already exists",status:410});
                
                // check if the phone number already exists
                const checkphone=await Patients.findOne({phone_number:phone_number});
                if(checkphone) return res.json({message:"Phone number already exists",status:411});

                // if both feilds unique then insert the data
                const patientDetails={
                    email:email,
                    name:name,
                    phone_number:phone_number,
                    age:age,
                    specialization:specialization,
                    days:days,
                    Details:Details,
                    type:"Specialist",
                    submitdate:getdate().date,
                    submittime:getdate().time
                }
                const insertpatient=await Patients.insertOne(patientDetails);
                if(insertpatient){
                    return res.json({message:"Form 2 submitted Successfully",status:200});
                }
                return res.json({message:"Error while submitting form",status:401});
            }
            return res.json({message:response.message,status:400});
        
        }

        return res.json({message:"Please enter a valid form",status:402});
    }
    catch(err){
        res.json({message:"Internal server error",status:500});
    }
})
module.exports = router;
var jwt = require('jsonwebtoken');
const validity=(req,id,jwtkey)=>{
    try{
        const{token}=req.headers;
        const tokendetails=jwt.verify(token,jwtkey);
        if(tokendetails.userId===id) return {status:200};
        return {status:400,message:"Invalid Token"};
    }
    catch(err){
        return {message:err.message,status:500};
    }
}
module.exports=validity;
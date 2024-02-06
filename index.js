const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());
const PORT=process.env.PORT;
app.use(express.json());
app.get('/',(req,res)=>{
    res.send({message:'Hello World',status:200});
});
app.use('/api/form',require('./api/form/form'));
app.use('/api/admin',require('./api/admin/admin'));
app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
});
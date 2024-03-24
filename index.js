require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./router/router')
const cors = require('cors'); // Correct import
const mongoose = require('mongoose')
app.use(cors({
    origin:"*"
})); // Use cors() middleware
app.use(express.urlencoded({ extended: false }));

app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(express.json());
mongoose.connect(process.env.Mongooseurl).then(()=>
{
console.log("succesfully connected db");
}).catch(()=>{
    console.log("error in db");
})


app.use(router)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("server start at ", PORT);
});

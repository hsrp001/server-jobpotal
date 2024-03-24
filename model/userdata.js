const mongoose = require('mongoose');

const userdata = new mongoose.Schema({

    catagory :{
        type:String,
        require:true,
        
    },

    username :{
        type:String,
        require:true,
        
    },

    password :{
        type:String,
        require:true,
        
        
    },

    email :{
        type:String,
        require:true,
        unique:true
        
    },

    phone :{
        type:Number,
        require:true,
        unique:true,
        
    },

    token:
    {
        type:String,
        default:""
    },

    file :{
        type:String,
        require:true,
        default:""
    }


    
    

});

const userdatas = mongoose.model('userdata', userdata);

module.exports = userdatas;
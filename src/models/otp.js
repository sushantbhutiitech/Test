const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema({
    email:{
        type:String
    },
	otp : { 
        type: String, 
    },
    otpExpiresAt: {
        type: Date,
      },
},{
    timestamps:true
});

module.exports = mongoose.model("Otp", otpSchema);

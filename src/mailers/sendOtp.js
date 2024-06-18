const transporter = require("../config/nodemailer");
const otpGenerator = require("otp-generator");
const   CustomGraphQLError=require("../config/nodemailer")
const Otp=require("../models/otp")


module.exports.forgetPasswordMailer = (user, next) => {
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    specialChars: true,
    lowerCaseAlphabets: true,
  });
   
  transporter.sendMail(
    {
      from: "no-reply@gmail.com",
      to: user.email,
      subject: "Otp for password change",
      html: `<p>your one-time--password for changing password is ${otp} </p>`,
    },
    async(err, info) => {
      if (err) {
        throw new CustomGraphQLError(
            "otp not sent",
           { 
             extensions:{code:"conflict"},
           }
         );
      }
      let d = new Date();
      console.log("d",d)
      console.log("user",user)
      await Otp.findOneAndUpdate({email:user.email},{
        otp:otp,
        otpExpiresAt:new Date(Date.now() + 5 * 60 * 1000)
      })
      
      return
    }
  );
};

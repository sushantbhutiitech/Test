const issueJWT = require("../utils/issueJWT");
const CustomGraphQLError = require("../handlers/AppError");

//
const streamToBuffer = require("stream-to-buffer");
const s3 = require("../handlers/aws");
const bucketName = process.env.AWS_BUCKET_NAME
  ? process.env.AWS_BUCKET_NAME
  : "";

const { PutObjectCommand } = require("@aws-sdk/client-s3");

const { getS3PublicUrl } = require("../utils/common");

// models import
const User = require("../models/user");
const Image = require("../models/image");
const Otp = require("../models/otp");
const otpMailer = require("../mailers/sendOtp");
const { Domain } = require("../models/domains");

// models import

module.exports.getUserDetail = async (_root, args) => {
  try {
    const token = await issueJWT(args.name);
    console.log("token", token);
  } catch (error) {}
};

module.exports.getJob = async (_root, args) => {
  try {
    // const token= await issueJWT(args.name);
    // console.log("token",token)
    // return  token
  } catch (error) {}
};

module.exports.createUser = async (_root, args) => {
  try {
    console.log("argg", args);
    const data = await User.create(args.body);
    console.log("password", data);
    if (!data) {
      throw new CustomGraphQLError("user not created", {
        extensions: { code: "403" },
      });
    }

    //  await Otp.create({
    //   email:args.body.email
    //  })
    const token = await issueJWT(data._id);
    return {
      token,
      data,
    };
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

module.exports.loginManualy = async (_root, args) => {
  try {
    console.log("args", args);
    let user = await User.findOne({
      email: args.email,
    }).select("+password");

    if (!user) {
      throw new CustomGraphQLError("user not found with this email", {
        extensions: { code: "404" },
      });
    }
    const password = args.password;

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new CustomGraphQLError("invalid credentials", {
        extensions: { code: "401" },
      });
    }
    const token = await issueJWT(user._id);
    let data = await User.findOne({
      email: args.email,
    });
    return {
      token,
      data,
    };
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

module.exports.generateOtp = async (_root, args) => {
  try {
    let user = await User.findOne({
      email: args.email,
    });

    if (!user) {
      throw new CustomGraphQLError("user not found with this email", {
        extensions: { code: "404" },
      });
    }

    await otpMailer.forgetPasswordMailer(user);
    return {
      message: "otp sent successfully",
      success: true,
    };
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

module.exports.submitOtp = async (_root, args) => {
  try {
    let userOtp = await Otp.findOne({
      email: args.email,
    });
    console.log("otpuser", userOtp);
    if (!userOtp) {
      throw new CustomGraphQLError("user not found with this email", {
        extensions: { code: "404" },
      });
    }
    if (userOtp.otpExpiresAt < Date.now()) {
      throw new CustomGraphQLError("otp is expired", {
        extensions: { code: "403" },
      });
    }

    if (userOtp.otp == args.otp) {
    } else {
      return {
        message: "otp is invalid",
        success: false,
      };
    }
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

module.exports.changePassword = async (args) => {
  try {
    console.log("args", args);
    let user = await User.findOne({
      email: args.email,
    });
    let OtpUser = await Otp.findOne({
      email: args.email,
    });

    console.log("user", user, "otpUser", OtpUser);
    if (user.email == OtpUser.email && args.otp == OtpUser.otp) {
      user.password = args.newPassword;
      user.save();
      return {
        success: true,
        message: "Password changed successfully",
      };
    } else {
      return {
        success: false,
        message: "Password not updated",
      };
    }
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

module.exports.setupUserProfile = async (parent, { body, file }, userId) => {
  try {
    let user = await User.findById(userId);

    if (!user) {
      throw new CustomGraphQLError("User not found", {
        extentions: { code: "NOT_FOUND" },
      });
    }

    const { createReadStream, filename, mimetype, encoding } = await file;

    // converting file to buffer for s3
    const buffer = await new Promise((resolve, reject) => {
      streamToBuffer(createReadStream(), (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf);
        }
      });
    });
    // converting file to buffer for s3

    // s3 uri creation

    const imageName = `${Date.now()}-${filename}`;
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: "image/jpeg",
    };

    // sending params to s3 bucket

    const putCommand = await new PutObjectCommand(params);

    let s3data = await s3.send(putCommand).catch((err) => {
      if (err) {
        throw new CustomGraphQLError("error in s3 upload", {
          extensions: { code: "403" },
        });
      }
    });

    const url = await getS3PublicUrl(bucketName, imageName);

    let obj = {
      key: imageName,
      url: url,
    };
    let createdImage = await Image.create(obj);

    // update user avatar

    const data = await User.findByIdAndUpdate(
      userId,
      {
        ...body,
        avatar: createdImage?.url,
      },
      { new: true }
    );
    return {
      data,
    };
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};


// Interested Domain Service
module.exports.addInterestedDomains = async (domains, userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomGraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (user.intrestedDomains && user.intrestedDomains.length > 0) {
      throw new CustomGraphQLError("Domains have already been added", {
        extensions: { code: "ALREADY_EXISTS" },
      });
    }

    // Ensure each domain exists or create it
    const domainPromises = domains.map(async (domain) => {
      let existingDomain = await Domain.findOne({ name: domain.name });

      if (!existingDomain) {
        existingDomain = new Domain({ name: domain.name });
        await existingDomain.save();
      }

      return existingDomain;
    });

    const resolvedDomains = await Promise.all(domainPromises);

    user.intrestedDomains.push(
      ...resolvedDomains.map((domain) => ({
        _id: domain._id,
        name: domain.name,
      }))
    );

    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

module.exports.updateUserProfile = async ({ body, file }, userId) => {
  try {
    let user = await User.findById(userId);
    if (!user) {
      throw new CustomGraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    let updateData = { ...body };

    if (file) {
      const { createReadStream, filename } = await file;

      const buffer = await new Promise((resolve, reject) => {
        streamToBuffer(createReadStream(), (err, buf) => {
          if (err) {
            reject(err);
          } else {
            resolve(buf);
          }
        });
      });

      const imageName = `${Date.now()}-${filename}`;
      const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: buffer,
        ContentType: "image/jpeg",
      };

      try {
        const putCommand = new PutObjectCommand(params);
        await s3.send(putCommand);
      } catch (err) {
        throw new CustomGraphQLError("Error in S3 upload", {
          extensions: { code: "403" },
        });
      }

      const url = await getS3PublicUrl(bucketName, imageName);

      let createdImage = await Image.create({ key: imageName, url: url });

      updateData.avatar = createdImage.url; //changed here
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return updatedUser;
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

// get a user
module.exports.getUser = async (userId) => {
  try {
    const user = await User.findById(userId).populate("intrestedDomains");
    if (!user) {
      throw new CustomGraphQLError("User not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return user;
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

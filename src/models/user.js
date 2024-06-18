const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Domain } = require("../models/domains");
// const domain = require("../models/domains");
const { Schema } = mongoose;
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      trim: true,
      minLength: [3, "firtName should contain atleat 3 letters"],
      maxLength: [32, "firstName must be of less than 32 lettera"],
      required: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
      minLength: [3, "lastName should contain atleat 3 letters"],
      maxLength: [32, "lastName must be of less than 32 lettera"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "contributer"],
      default: "contributer",
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
    },
    otp: {
      type: String,
      trim: true,
    },
    reminders: {
      type: Boolean,
      default: true,
      trim: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    intrestedDomains: {
      type: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: String
      }], // added the domain model to store the values as object
      // validate: {
      //   validator: function (value) {
      //     return value.length >= 5;
      //   },
      //   message: (props) => `${props.value} should be atleast 5`,

      // },
      ref: Domain
    },

    avatar: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },

    isRemindersOn: {
      type: Boolean,
      default: true,
    },
    isAutoLogoutOn: {
      type: Boolean,
      default: false,
    },

    rewardPoints: {
      type: Number,
      default: 1000,
    },
    level: {
      type: String,
      default: "Bronze",
    },
    socialMedia: {
      linkedIn: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    gender: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    staticUrl: {
      type: String,
    },

    phoneNumber: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },

  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("this.password", this.password);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("matching", enteredPassword, this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);

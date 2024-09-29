const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentsModel = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [4, "first name should be atleast 4 character long"],
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      minLength: [4, "Last name should be atleast 4 character long"],
    },
    contact: {
      type: String,
      required: [true, " Contact is required"],
      minLength: [10, "Contact should be atleast 10 character long"],
      maxLength: [10, "Contact  must not exceed 10 character long"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
      minLength: [3, "city should be atleast 3 character long"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      required: [true, "password is required"],
      minLength: [6, "A minimum of 6 characters is required"],
      maxLength: [15, "A maximum of 15 characters is allowed"],
      //   match: [
      //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   ],
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },

    avatar: {
      type: Object,
      default: {
        fileId: "",
        url: "https://plus.unsplash.com/premium_photo-1727437241647-28bffe00be03?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    },

    resume: {
      education: [],
      jobs: [],
      internship: [],
      responsibilities: [],
      courses: [],
      projects: [],
      skills: [],
      accomplishments: [],
    },
  },

  { timestamps: true }
);

studentsModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

studentsModel.methods.comparepassword = function (password) {
  if (!this.password) {
    throw new Error("No password set for this user.");
  }
  return bcrypt.compareSync(password, this.password);
};

studentsModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("students", studentsModel);

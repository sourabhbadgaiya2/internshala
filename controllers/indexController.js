const path = require("path");
const { catchasyncErrors } = require("../middlewares/catchasyncErrors");
const students = require("../models/studentsModel");
const ErrorHandler = require("../utils/errorHandler");
const { sendMail } = require("../utils/nodemailer");
const { sendtoken } = require("../utils/sendtoekn");
const imagekit = require("../utils/imagekit").initImagekit();

exports.homepage = catchasyncErrors(async (req, res, next) => {
  res.json({ message: "Secure homepage" });
});

exports.currentUser = catchasyncErrors(async (req, res, next) => {
  const student = await students.findById(req.id).exec();
  res.json({ student });
});

exports.studentssingup = catchasyncErrors(async (req, res, next) => {
  const student = await new students(req.body).save();
  sendtoken(student, 201, res);
  // res.status(201).json(student);
});

exports.studentssingin = catchasyncErrors(async (req, res, next) => {
  // const student = await students.findOne({ email: req.body.email }).exec();
  const student = await students
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!student)
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );

  const isMatch = student.comparepassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("wrong credientials", 500));

  // res.json(student);
  sendtoken(student, 200, res);
});

exports.studentssingout = catchasyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully signout" });
});

exports.studentssendmail = catchasyncErrors(async (req, res, next) => {
  const student = await students.findOne({ email: req.body.email });

  if (!student)
    return next(new ErrorHandler("User not found with this email address"));

  const url = `${req.protocol}://${req.get("host")}/student/forget-link/${
    student._id
  }`;

  student.resetPasswordToken = "1";
  await student.save();
  //
  sendMail(req, res, next, url);

  res.json({ student, url });
});
exports.studentsforgetlink = catchasyncErrors(async (req, res, next) => {
  const student = await students.findById(req.params.id);

  if (!student)
    return next(new ErrorHandler("User not found with this email address"));

  if (student.resetPasswordToken === "1") {
    student.resetPasswordToken = "0";

    student.password = req.body.password;
  } else {
    return next(
      new ErrorHandler("Invalid Reset Password Link! Please try again")
    );
  }
  await student.save();
  res.status(200).json({ message: "password has been successfully changed" });
});

exports.studentsresetpassword = catchasyncErrors(async (req, res, next) => {
  const student = await students.findById(req.id).exec();
  student.password = req.body.password;

  await student.save();
  sendtoken(student, 201, res);
});

exports.studentsupdate = catchasyncErrors(async (req, res, next) => {
  await students.findByIdAndUpdate(req.params.id, req.body).exec();
  res
    .status(200)
    .json({ success: true, message: "students updated successfully" });
});

exports.studentsavatar = catchasyncErrors(async (req, res, next) => {
  const student = await students.findById(req.params.id).exec();
  const file = req.files.avatar;
  const modifiedFileName = `resumebuider-${Date.now()}${path.extname(
    file.name
  )}`;

  if (student.avatar.fileId !== "") {
    await imagekit.deleteFile(student.avatar.fileId);
  }

  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });

  student.avatar = { fileId, url };
  await student.save();
  res
    .status(200)
    .json({ success: true, message: "Profile updated successfully!" });
});

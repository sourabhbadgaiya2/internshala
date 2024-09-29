const path = require("path");
const { catchasyncErrors } = require("../middlewares/catchasyncErrors");
const Employe = require("../models/employeModel");
const ErrorHandler = require("../utils/errorHandler");
const { sendMail } = require("../utils/nodemailer");
const { sendtoken } = require("../utils/sendtoekn");
const imagekit = require("../utils/imagekit").initImagekit();

exports.homepage = catchasyncErrors(async (req, res, next) => {
  res.json({ message: "Secure employe homepage" });
});

exports.currentEmploye = catchasyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  res.json({ employe });
});

exports.employesingup = catchasyncErrors(async (req, res, next) => {
  const employe = await new Employe(req.body).save();
  sendtoken(employe, 201, res);
  // res.status(201).json(employe);
});

exports.employesingin = catchasyncErrors(async (req, res, next) => {
  // const employe = await Employe.findOne({ email: req.body.email }).exec();
  const employe = await Employe.findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!employe)
    return next(
      new ErrorHandler("User not found with this email address", 404)
    );

  const isMatch = employe.comparepassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("wrong credientials", 500));

  // res.json(employe);
  sendtoken(employe, 200, res);
});

exports.employesingout = catchasyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully signout" });
});

exports.employesendmail = catchasyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email });

  if (!employe)
    return next(new ErrorHandler("User not found with this email address"));

  const url = `${req.protocol}://${req.get("host")}/employe/forget-link/${
    employe._id
  }`;

  employe.resetPasswordToken = "1";
  await employe.save();
  //
  sendMail(req, res, next, url);

  res.json({ employe, url });
});
exports.employeforgetlink = catchasyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id);

  if (!employe)
    return next(new ErrorHandler("User not found with this email address"));

  if (employe.resetPasswordToken === "1") {
    employe.resetPasswordToken = "0";

    employe.password = req.body.password;
  } else {
    return next(
      new ErrorHandler("Invalid Reset Password Link! Please try again")
    );
  }
  await employe.save();
  res.status(200).json({ message: "password has been successfully changed" });
});

exports.employeresetpassword = catchasyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  employe.password = req.body.password;

  await employe.save();
  sendtoken(employe, 201, res);
});

exports.employeupdate = catchasyncErrors(async (req, res, next) => {
  await Employe.findByIdAndUpdate(req.params.id, req.body).exec();
  res
    .status(200)
    .json({ success: true, message: "Employe updated successfully" });
});

// exports.Employeavatar = catchasyncErrors(async (req, res, next) => {
//   const employe = await Employe.findById(req.params.id).exec();
//   const file = req.files.avatar;
//   const modifiedFileName = `resumebuider-${Date.now()}${path.extname(
//     file.name
//   )}`;

//   if (employe.avatar.fileId !== "") {
//     await imagekit.deleteFile(employe.avatar.fileId);
//   }

//   const { fileId, url } = await imagekit.upload({
//     file: file.data,
//     fileName: modifiedFileName,
//   });

//   employe.avatar = { fileId, url };
//   await employe.save();
//   res
//     .status(200)
//     .json({ success: true, message: "Profile updated successfully!" });
// });

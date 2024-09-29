const path = require("path");
const { catchasyncErrors } = require("../middlewares/catchasyncErrors");
const students = require("../models/studentsModel");
const ErrorHandler = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");

exports.resume = catchasyncErrors(async (req, res, next) => {
  const resume = await students.findById(req.id).exec();

  res.json({ message: "Secure resume page", resume });
});

exports.addeducation = catchasyncErrors(async (req, res, next) => {
  const student = await students.findById(req.id).exec();
  student.resume.education.push({ ...req.body, id: uuidv4 });
  await student.save();
  res.json({ message: "Education added" });
});

exports.editeducation = catchasyncErrors(async (req, res, next) => {
  const student = await students.findById(req.id).exec();
  const eduIndex = student.resume.education.findIndex(
    (i) => i.id === req.params.eduid
  );
  student.resume.education[eduIndex] = {
    ...student.resume.education[eduIndex],
    ...req.body,
  };
  await student.save();
  res.json({ message: "Education updated" });
});

exports.deleteducation = catchasyncErrors(async (req, res, next) => {
  const student = await students.findById(req.id).exec();
  const filterEdu = student.resume.education.filter(
    (i) => i.id === req.params.eduid
  );
  student.resume.education = filterEdu;
  await student.save();
  res.json({ message: "Education Deleted" });
});

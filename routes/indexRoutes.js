const express = require("express");
const {
  homepage,
  currentUser,
  studentssingup,
  studentssingin,
  studentssingout,
  studentssendmail,
  studentsforgetlink,
  studentsresetpassword,
  studentsupdate,
  studentsavatar,
} = require("../controllers/indexController");

const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.get("/", homepage);

router.post("/student", isAuthenticated, currentUser);

router.post("/student/signup", studentssingup);

router.post("/student/signin", studentssingin);

router.get("/student/signout", isAuthenticated, studentssingout);

router.post("/student/send-mail", studentssendmail);

router.get("/student/forget-link/:id", studentsforgetlink);

router.post(
  "/student/reset-password/:id",
  isAuthenticated,
  studentsresetpassword
);

router.post("/student/update/:id", isAuthenticated, studentsupdate);

router.post("/student/avatar/:id", isAuthenticated, studentsavatar);

module.exports = router;

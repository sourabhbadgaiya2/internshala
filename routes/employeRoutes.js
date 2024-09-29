const express = require("express");
const {
  homepage,
  currentEmploye,
  employesingup,
  employesingin,
  employesingout,
  employesendmail,
  employeforgetlink,
  employeresetpassword,
  employeupdate,
} = require("../controllers/empController");

const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.get("/", homepage);

router.post("/employe", isAuthenticated, currentEmploye);

router.post("/signup", employesingup);

router.post("/signin", employesingin);

router.get("/signout", isAuthenticated, employesingout);

router.post("/send-mail", employesendmail);

router.get("/forget-link/:id", employeforgetlink);

router.post("/reset-password/:id", isAuthenticated, employeresetpassword);

router.post("/update/:id", isAuthenticated, employeupdate);

module.exports = router;

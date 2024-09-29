const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
  resume,
  addeducation,
  editeducation,
  deleteducation,
} = require("../controllers/resumeController");

router.get("/", isAuthenticated, resume);

router.post("/add-edu", isAuthenticated, addeducation);

router.post("/edit-edu/:eduid", isAuthenticated, editeducation);

router.post("/delete-edu/:eduid", isAuthenticated, deleteducation);

module.exports = router;

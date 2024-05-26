const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const User = require("../models/User");
const multer = require("multer");
const bcrypt = require("bcryptjs");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, res, cb) => {
    cb(null, Date.now() + Path2D.extname(file.originalname));
  },
});

const upload = multer({ storage });
router.get("/", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log("User:", user);
    res.render("userProfile", { user });
  } catch (error) {
    res.status(500).send("Error Loading profile.");
  }
});

router.post("/", authenticateUser, upload.single("photo"), async (req, res) => {
  try {
    const { name, bio, phone, email, password, isPrivate } = req.body;
    console.log(req.body);
    const user = await User.findById(req.userId);

    if (req.file) {
      user.photo = "/uploads" + req.file.filename;
    }
    user.name = name;
    user.bio = bio;
    user.phone = phone;
    user.email = email;
    user.isPrivate = isPrivate === "on";

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    res.status(500).send("Error updating profile");
  }
});

module.exports = router;

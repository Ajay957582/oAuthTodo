const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback Route
router.get(
  "/google/page",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/",
  })
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("http://localhost:3000/"));
});

module.exports = router;

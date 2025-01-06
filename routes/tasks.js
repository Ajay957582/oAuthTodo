const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  // console.log("req from ensureAuthenticated", req.user);
  if (req.isAuthenticated()) {
    // console.log("yeahhhhhhhh req is authenticated");
    return next();
  } else {
    console.log("nowwww req is not authenticated", req.user);
    res.status(201).json({
      message: "user session not found",
      success: false,
      user: null,
    });
  }
  // res.status(401).json({ message: "GOTOLOGIN" });
};

// Get Tasks
router.get("/", async (req, res) => {
  console.log("checking if user exists on request ?", req.user);
  if (req.user) {
    const user = await User.findOne({ email: req.user.email });
    console.log("here is the user in tasks route", user);
    if (!user) {
      res.status(201).json({
        message: "user session not found",
        success: false,
      });
    } else {
      res.status(200).json({
        message: "user session exists",
        success: true,
        user,
      });
    }
  } else {
    res.status(201).json({
      message: "user session not found",
      success: false,
      user: null,
    });
  }
});

// Add Task
router.post("/", ensureAuthenticated, async (req, res) => {
  // console.log("user on req", req.user);
  // console.log("body on req", req.body);
  if (req.body.message === "ADD") {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // Filter to find the user
      {
        $push: {
          tasks: { title: req.body.newTodo, completed: false }, // Push the new task
        },
      },
      { new: true } // Option to return the updated document
    );

    if (updatedUser) {
      res
        .status(200)
        .json({ message: "user Updated Succuessfully ", updatedUser });
    }
  }

  if (req.body.message === "DELETE") {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // Find the user by their ID
      {
        $pull: {
          tasks: { _id: req.body.id }, // Remove the task with the specified ID
        },
      },
      { new: true } // Return the updated user document
    );

    if (updatedUser) {
      res
        .status(200)
        .json({ message: "user Updated Succuessfully ", updatedUser });
    }
  }
});

module.exports = router;

// models/User  .js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String, // Field to store the URL of the user's profile picture
    default: "", // Default value is an empty string
  },
  tasks: [TaskSchema], // Array of tasks for each user
});

module.exports = mongoose.model("User  ", UserSchema);

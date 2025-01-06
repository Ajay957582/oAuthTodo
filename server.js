const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const dotenv = require("dotenv");
const cors = require("cors");
const MongoStore = require("connect-mongo");
dotenv.config();

// Initialize App
const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // Allow your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));

require("./config/passport")(passport);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
      collectionName: "sessions", // Optional: Name of the collection to store sessions
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.get("/isauth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "yes authenticated", user: req.user });
  } else {
    res.json({ message: "NOt authenticated" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

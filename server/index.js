const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const authRoute = require("./Routes/AuthRoute");
const jobRoute = require("./Routes/JobRoute");
const contactRoute = require("./Routes/ContactRoute");
const skillRoute = require("./Routes/SkillRoute");

const app = express();
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://jobtrackerwebapp-e713d33594b0.herokuapp.com' : 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Route handlers
app.use("/", authRoute);
app.use("/", jobRoute);
app.use("/", contactRoute);
app.use("/", skillRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/the-app/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/the-app/build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

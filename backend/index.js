const express = require("express");
require("dotenv").config();
const loginRouter = require("./api/login");
const registerRouter = require("./api/register");
const bodyParser = require("body-parser");
const { validateToken } = require("./utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const usersRouter = require("./api/users");
const cors = require("cors");
const locationsRouter = require("./api/locations");
const ranksRouter = require("./api/ranks");
const dutyApptsRouter = require("./api/dutyAppts");
const dutiesRouter = require("./api/duties");
const employeesRouter = require("./api/employees");
const contactRouter = require("./api/contactAddresses");
const bioRouter = require("./api/biodatas");
const nokInfoRouter = require("./api/nokInfos");
const promotionStatusRouter = require("./api/promotionstatauses");
const medicalstatusesRouter = require("./api/medicalstatuses");
const leavetypesRouter = require("./api/leavetypes");
const cadresRouter = require("./api/cadres");
const courseCompletionRouter = require("./api/coursecompletions");
const batteriesRouter = require("./api/batteries");
const coursesRouter = require("./api/courses");
const dashboardRouter = require("./api/dashboards");
const leavesRouter = require("./api/leaves");
const schedulesRouter = require("./api/schedules");
const civilianDataRouter = require("./api/civiliandatas");
const resetPasswordRouter = require("./api/resetPassword"); // Assuming the file is named resetPassword.js
const leaveCircle = require("./api/leaveCircle"); // Assuming the file is named resetPassword.js

// const path = require('path');  // Required for path manipulation
const app = express();
/// For Image Handling
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// console.log(path.join(__dirname, 'build'));

// // Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname, "..", "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads/images")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Or specify a particular domain
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});
// List images endpoint
app.get("/api/images", validateToken, (req, res) => {
  const uploadPath = path.join(__dirname, "..", "uploads");
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to list images" });
    }
    const images = files.map((file) => `/uploads/${file}`);
    res.status(200).json(images);
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"]; // Allowed image types
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and JPG allowed."));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set a reasonable file size limit (optional)
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 25 },
});

app.use(upload.single("image"));
app.use(bodyParser.json({ limit: "30mb" })); // Parse JSON request bodies
const port = process.env.PORT || 8000; // Use environment variable or default port 3000

function loggingMiddleware(req, res, next) {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware or route handler
}
app.use(loggingMiddleware); // Apply loggingMiddleware to all routes

// Error handling for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Other errors
    return res.status(500).json({ error: "Something went wrong" });
  }
  next();
});

app.get("/list", validateToken, (req, res) => {
  res.send("protected GEMS API!");
});

app.use("/api", loginRouter);
app.use("/api", registerRouter);
app.use("/api", usersRouter);
app.use("/api", locationsRouter);
app.use("/api", ranksRouter);
app.use("/api", batteriesRouter);
app.use("/api", dutiesRouter);
app.use("/api", medicalstatusesRouter);
app.use("/api", leavetypesRouter);
app.use("/api", cadresRouter);
app.use("/api", contactRouter);
app.use("/api", bioRouter);
app.use("/api", nokInfoRouter);
app.use("/api", employeesRouter);
app.use("/api", promotionStatusRouter);
app.use("/api", resetPasswordRouter);
app.use("/api", courseCompletionRouter);
app.use("/api", leavesRouter);
app.use("/api", dutyApptsRouter);
app.use("/api", schedulesRouter);
app.use("/api", dashboardRouter);
app.use("/api", coursesRouter);
app.use("/api", civilianDataRouter);
app.use("/api", leaveCircle);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;

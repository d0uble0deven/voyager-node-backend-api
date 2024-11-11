const express = require("express");
const router = express.Router();

// Define a route
router.get("/", (req, res) => {
  res.send("<h3>This is a Posts route!</h3>");
});

router.get("/101", (req, res) => {
  res.send("<h3>This is a Posts 101 route!</h3>");
});

router.get("/102", (req, res) => {
  res.send("<h3>This is a Posts 102 route!</h3>");
});

module.exports = router;

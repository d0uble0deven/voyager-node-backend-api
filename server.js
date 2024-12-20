// // fileName : server.js
// // Example using the http module
// const http = require("http");

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//   // Set the response headers
//   res.writeHead(200, { "Content-Type": "text/html" });

//   // Write the response content
//   res.write("<h1>Hello, Node.js HTTP Server!</h1>");
//   res.end();
// });

// // Specify the port to listen on
// const port = 3001;

// // Start the server
// server.listen(port, () => {
//   console.log(`Node.js HTTP server is running on port ${port}`);
// });

/*
https://medium.com/@ibrahimhz/creating-your-first-backend-with-node-js-step-by-step-guide-892769af4cb0
*/

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();
let cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors());

const allowlist = [
  "http://localhost:8081",
  "http://localhost:3002",
  "http://localhost:3000",
];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true }; // Enable for allowlisted origins
  } else {
    corsOptions = { origin: false }; // Disable for other requests
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.send("<h1>Hello, Express.js Server!</h1>");
});

// Include route files
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const flightsRoute = require("./routes/flights");
const hotelsRoute = require("./routes/hotels");
const tripadvisorRoutes = require("./routes/tripadvisor");
const locationsRoute = require("./routes/locations");
const perplexityRoute = require("./routes/perplexity");

// User routes
app.use("/users", userRoute);
app.use("/posts", postsRoute);
app.use("/flights", flightsRoute);
app.use("/hotels", hotelsRoute);
app.use("/tripadvisor", tripadvisorRoutes);
app.use("/locations", locationsRoute);
app.use("/perplexity", perplexityRoute);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

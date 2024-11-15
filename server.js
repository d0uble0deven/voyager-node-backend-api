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

app.get("/", (req, res) => {
  res.send("<h1>Hello, Express.js Server!</h1>");
});

// Include route files
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");

// User routes
app.use("/users", userRoute);
app.use("/posts", postsRoute);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const router = express.Router();

const getPost = async () => {
  //   console.log(await fetch(`https://jsonplaceholder.typicode.com/posts/`));
  let posts = await fetch(`https://jsonplaceholder.typicode.com/posts/`)
    .then((response) => response.json())
    .then((posts) => console.log("posts: ", posts));
  return posts;
  //   await fetch(`https://jsonplaceholder.typicode.com/posts/`)
  //     .then((response) => (posts = response.json()))
  //     .then((posts) => console.log("posts: ", posts));
  //   return posts;
};

// Define a route
router.get("/", (req, res) => {
  //   res.json({ data: getPost() });
  //   res.json({ data: getPost() });
  //   res.json({ username: "Flavio" });
  //   res.end(JSON.stringify(getPost()));
  //   res.json(getPost());
  //   res.send(`<h3>This is a Posts route! ${getPost()}</h3>`);
});

router.get("/101", (req, res) => {
  res.send("<h3>This is a Posts 101 route!</h3>");
});

router.get("/102", (req, res) => {
  res.send("<h3>This is a Posts 102 route!</h3>");
});

module.exports = router;

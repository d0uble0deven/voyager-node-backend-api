const express = require("express");
const router = express.Router();

const Amadeus = require("amadeus");

const amadeus = new Amadeus({
  clientId: "cPChGttUxcdk6JRrZw52SG7yjINc5TJm",
  clientSecret: "1x4A8UNVM2BBMWI9",
});

// amadeus.shopping.flightOffersSearch
//   .get({
//     originLocationCode: "SYD",
//     destinationLocationCode: "BKK",
//     departureDate: "2022-06-01",
//     adults: "2",
//   })
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (responseError) {
//     console.log(responseError.code);
//   });

// Define a route
// router.post("/create", function (req = {}, res) {
//   console.log("/create !!!! ", req);
//   res.send("<h3>This is a Flights create route!</h3>");
//   res.end();
// });

router.post("/create", function (req, res) {
  console.log("/create !!!! ");
  console.log("req.body: ", req.body);
  let data;
  try {
    // Find the cheapest flights from SYD to BKK
    console.log("about to call Amadeus ");

    amadeus.shopping.flightOffersSearch
      .post(req.body)
      .then((response) => (data = res.json(response)))
      .then(() => console.log("data: ", data.statusCode))
      .catch(function (responseError) {
        console.log("responseError: ", responseError);
      });
  } catch (error) {
    console.error("error: ", error);
  }
  console.log("data: ", data);
});

router.get("/101", (req, res) => {
  res.send("<h3>This is a Flights 101 route!</h3>");
});

router.get("/102", (req, res) => {
  res.send("<h3>This is a Flights 102 route!</h3>");
});

router.get("/inspo", (req, res) => {
  let data;
  console.log(" --- req.query: ", req.query);
  // console.log(" --- req.query: ", req.query);
  return amadeus.shopping.flightDestinations
    .get(req.query)
    .then(function (response) {
      // console.log("response: ", response.data);
      console.log("response: ", JSON.stringify(response.data));
      // res.json(data);
      data = response.data;
      return res.json(data);
      // return response.data;
    })
    .catch(function (responseError) {
      console.log("error: ", responseError);
    });
  return res.end();
});

router.get("/", (req, res) => {
  let data;
  amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: "SYD",
      destinationLocationCode: "BKK",
      departureDate: "2025-06-01",
      adults: "2",
    })
    .then(function (response) {
      // console.log("response: ", response.data);
      console.log("response: ", JSON.stringify(response.data));
      // res.json(data);
      data = response.data;
      res.json(data);
      // return response.data;
    })
    .catch(function (responseError) {
      console.log("error: ", responseError);
    });
  res.end();

  // res.json(data);
  // res.json(Object.keys(data));
  // res.send(`<h3>This is a Flights route! ${data}</h3>`);
});

module.exports = router;

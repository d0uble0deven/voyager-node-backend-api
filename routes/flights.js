const express = require("express");
const router = express.Router();

const Amadeus = require("amadeus");

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
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

router.get(`/flight-search`, (req, res) => {
  console.log("/flight-search");
  const originCode = req.query.originCode;
  const destinationCode = req.query.destinationCode;
  const dateOfDeparture = req.query.dateOfDeparture;
  // Find the cheapest flights
  return amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: dateOfDeparture,
      adults: "1",
      max: "7",
    })
    .then(function (response) {
      console.log("response.result: ", response.result);
      res.send(response.result);
    })
    .catch(function (response) {
      console.log("response: ", response);
      res.send(response);
    });
});

// Confirm a flight's price and availability
router.post("/flight-confirmation", (req, res) => {
  const flight = req.body.flight; // Flight data from the request body
  if (!flight) {
    return res.status(400).json({ error: "Flight data is required" });
  }

  console.log("Confirming flight:", flight);

  amadeus.shopping.flightOffers.pricing
    .post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flight],
        },
      })
    )
    .then((response) => {
      console.log("Confirmation Response:", response.result);
      res.status(200).json(response.result);
    })
    .catch((error) => {
      console.error("Error confirming flight:", error);
      res.status(500).json({ error: error.description || "An error occurred" });
    });
});

// Book a flight
router.post("/flight-booking", (req, res) => {
  const { flight, name } = req.body; // Flight and traveler details from the request body

  if (!flight || !name || !name.first || !name.last) {
    return res
      .status(400)
      .json({ error: "Flight and traveler information is required" });
  }

  console.log("Booking flight:", flight);
  console.log("Traveler Name:", name);

  amadeus.booking.flightOrders
    .post(
      JSON.stringify({
        data: {
          type: "flight-order",
          flightOffers: [flight],
          travelers: [
            {
              id: "1",
              dateOfBirth: "1982-01-16",
              name: {
                firstName: name.first,
                lastName: name.last,
              },
              gender: "MALE",
              contact: {
                emailAddress: "example@example.com",
                phones: [
                  {
                    deviceType: "MOBILE",
                    countryCallingCode: "1",
                    number: "5551234567",
                  },
                ],
              },
              documents: [
                {
                  documentType: "PASSPORT",
                  birthPlace: "City",
                  issuanceLocation: "City",
                  issuanceDate: "2015-04-14",
                  number: "00000000",
                  expiryDate: "2025-04-14",
                  issuanceCountry: "US",
                  validityCountry: "US",
                  nationality: "US",
                  holder: true,
                },
              ],
            },
          ],
        },
      })
    )
    .then((response) => {
      console.log("Booking Response:", response.result);
      res.status(200).json(response.result);
    })
    .catch((error) => {
      console.error("Error booking flight:", error);
      res.status(500).json({ error: error.description || "An error occurred" });
    });
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
  console.log("Flights!!!!");

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

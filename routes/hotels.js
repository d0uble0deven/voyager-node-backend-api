const express = require("express");
const router = express.Router();
const Amadeus = require("amadeus");

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Helper function to chunk array
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Endpoint: Search hotels in a city
router.get("/searchHotels", async (req, res) => {
  console.log("/searchHotels");
  const { city, checkInDate, checkOutDate } = req.query;

  if (!city || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      error:
        "Missing required query parameters: city, checkInDate, or checkOutDate",
    });
  }

  try {
    // Step 1: Get cityCode
    const locationResponse = await amadeus.referenceData.locations.get({
      keyword: city,
      subType: Amadeus.location.city,
    });

    if (!locationResponse.data || locationResponse.data.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const cityCode = locationResponse.data[0].address.cityCode;
    console.log("cityCode: ", cityCode);

    // Step 2: Get hotels in the city
    const hotelsResponse =
      await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode,
      });

    if (!hotelsResponse.data || hotelsResponse.data.length === 0) {
      return res
        .status(404)
        .json({ error: "No hotels found for the given city" });
    }

    // Extract hotelIds
    const hotelIds = hotelsResponse.data.map((hotel) => hotel.hotelId);

    console.log("hotelIds: ", hotelIds);

    // Step 3: Paginate hotelIds and query hotel offers
    const hotelIdChunks = chunkArray(hotelIds, 50); // Adjust the chunk size to fit the URI limit
    const hotelOffers = [];

    for (const chunk of hotelIdChunks) {
      const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
        hotelIds: chunk.join(","),
        checkInDate,
        checkOutDate,
      });

      if (offersResponse.data) {
        hotelOffers.push(...offersResponse.data);
      }
    }

    if (hotelOffers.length === 0) {
      return res
        .status(404)
        .json({ error: "No offers found for the specified hotels" });
    }

    // Format and return hotel offers
    const hotels = hotelOffers.map((offer) => ({
      name: offer.hotel.name || "Unnamed Hotel",
      address:
        offer.hotel.address?.lines?.join(", ") || "Address not available",
      checkInDate: offer.checkInDate,
      checkOutDate: offer.checkOutDate,
      price:
        offer.offers[0]?.price?.total + " " + offer.offers[0]?.price?.currency,
      category: offer.category || "Unknown category",
    }));

    console.log("hotels: ", hotels);

    res.json({ hotels });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({
      error:
        "An error occurred while fetching hotel offers. Check server logs for details.",
    });
  }
});

module.exports = router;

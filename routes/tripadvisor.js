const express = require("express");
const router = express.Router();

const API_KEY = process.env.TRIPADVISOR_API_KEY;

// Endpoint: Search locations with details and photos
router.get("/search", async (req, res) => {
  console.log("/search");
  const { searchQuery, category } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // Fetch location search results
    const searchUrl = new URL(
      "https://api.content.tripadvisor.com/api/v1/location/search"
    );
    searchUrl.searchParams.append("key", API_KEY);
    searchUrl.searchParams.append("searchQuery", searchQuery);
    searchUrl.searchParams.append("category", category || "hotels");
    searchUrl.searchParams.append("language", "en");

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.error) {
      return res.status(400).json({ error: searchData.error.message });
    }

    const enrichedResults = await Promise.all(
      (searchData.data || []).map(async (location) => {
        const locationId = location.location_id;

        try {
          // Fetch details
          const detailsUrl = new URL(
            `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details`
          );
          detailsUrl.searchParams.append("key", API_KEY);
          detailsUrl.searchParams.append("language", "en");

          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          // Fetch photos
          const photosUrl = new URL(
            `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos`
          );
          photosUrl.searchParams.append("key", API_KEY);
          photosUrl.searchParams.append("language", "en");
          photosUrl.searchParams.append("limit", "5");

          const photosResponse = await fetch(photosUrl);
          const photosData = await photosResponse.json();

          return {
            ...location,
            details: detailsData,
            photos:
              photosData.data?.map((photo) => photo.images.large.url) || [],
          };
        } catch (error) {
          console.error(
            `Error fetching data for locationId ${locationId}:`,
            error
          );
          return { ...location, details: null, photos: [] };
        }
      })
    );

    res.json(enrichedResults);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

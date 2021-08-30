const Amadeus = require("amadeus");
const express = require("express");
require("dotenv").config();

const app = express();
const amadeus = new Amadeus({
  clientId: process.env.API_KEY,
  clientSecret: process.env.API_SECRET,
});
const port = 3000;

app.use(express.static("public"));
app.get("/api/autocomplete", async (request, response) => {
  try {
    const { query } = request;
    const { data } = await amadeus.referenceData.locations.get({
      keyword: query.keyword,
      subType: Amadeus.location.city,
    });
    response.json(data);
  } catch (error) {
    console.error(error.response);
    response.json([]);
  }
});
app.get("/api/search", async (request, response) => {
  try {
    const { query } = request;
    console.log(query);
    const { data } = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: query.origin,
      destinationLocationCode: query.destination,
      departureDate: query.departureDate,
      adults: query.adults,
      children: query.children,
      infants: query.infants,
      travelClass: query.travelClass,
      ...(query.returnDate ? { returnDate: query.returnDate } : {}),
    });
    response.json(data);
  } catch (error) {
    console.error(error.response);
    response.json([]);
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

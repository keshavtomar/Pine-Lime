const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use("/style", express.static(__dirname + "/style"));

app.get("/", (req, res) => {
  res.render("form");
});

app.get("/map", (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const description = req.query.description;
  const city = req.query.city;

  // Render the map.mustache template with the coordinates
  res.render("map", { latitude, longitude, description, city });
});

app.post("/submit", async (req, res) => {
  const city = req.body.city;
  const description = req.body.description;

  // Check if either city name or both latitude and longitude are filled
  if (
    (!city && (!req.body.latitude || !req.body.longitude)) ||
    (req.body.latitude && !req.body.longitude) ||
    (!req.body.latitude && req.body.longitude)
  ) {
    // Return an error message to the frontend
    res.render("form", {
      error:
        "Either the city name or both latitude and longitude should be filled.",
    });
    return;
  }

  let latitude, longitude;

  // If city name is provided, fetch coordinates from OpenWeather API
  if (city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=5148a17aade8598e3088f02cfe1ca5c3`
      );
      const data = await response.json();

      if (data.length > 0) {
        latitude = data[0].lat;
        longitude = data[0].lon;
      } else {
        // Handle case where OpenWeather API returns empty coordinates (city not found)
        res.render("form", {
          error: "Invalid city name. Please enter a valid city name.",
        });
        return;
      }
    } catch (error) {
      console.error("Error fetching coordinates from OpenWeather API:", error);
      res.render("form", {
        error: "Error fetching coordinates. Please try again.",
      });
      return;
    }
  } else {
    // Use provided latitude and longitude
    latitude = req.body.latitude;
    longitude = req.body.longitude;

    // Check if latitude and longitude are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      res.render("form", {
        error: "Latitude and longitude must be valid numbers.",
      });
      return;
    }

    //check if latitude and longitude are within range
    if(latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180){
      res.render("form", {
        error: "Latitude must be between -90 and 90 and longitude must be between -180 and 180.",
      });
      return;
    }
  }

  // Continue with processing the form data if conditions are met
  // ...

  // Redirect to the /map endpoint with coordinates as URL parameters
  res.redirect(`/map?latitude=${latitude}&longitude=${longitude}&description=${description}&city=${city}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

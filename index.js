const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');



const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use('/style', express.static(__dirname + '/style'));


app.get('/', (req, res) => {
  res.render('form');
});

app.get('/map', (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  // Render the map.mustache template with the coordinates
  res.render('map', { latitude, longitude });
});

app.post('/submit', (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const city = req.body.city;
    const description = req.body.description;
  

    if ((!city && (!latitude || !longitude)) || (latitude && !longitude) || (!latitude && longitude)) {
        // Return an error message to the frontend
        res.render('form', { error: 'Either the city name or both latitude and longitude should be filled.' });
        return;
    }
    // res.send(`Form submitted successfully! Latitude: ${latitude}, Longitude: ${longitude}, City: ${city}, Description: ${description}`);

    console.log(`Form submitted successfully! Latitude: ${latitude}, Longitude: ${longitude}, City: ${city}, Description: ${description}`);
    res.redirect(`/map?latitude=${latitude}&longitude=${longitude}`);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

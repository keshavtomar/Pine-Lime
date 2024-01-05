const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();
const port = 3000;

// Configure Mustache template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Define routes
app.get('/form', (req, res) => {
  // Render the form.mustache template
  res.render('form');
});

app.get('/map', (req, res) => {
  // Render the map.mustache template
  res.render('map');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

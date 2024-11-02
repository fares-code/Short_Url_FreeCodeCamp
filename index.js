require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrls = [];
const shortUrls = [];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;

  // URL validation
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    return res.json({ error: "Invalid URL" });
  }

  const indexUrl = originalUrls.indexOf(url);
  if (indexUrl === -1) {
    // Store new URL
    originalUrls.push(url);
    shortUrls.push(originalUrls.length - 1);

    return res.json({
      original_url: url,
      short_url: originalUrls.length - 1
    });
  }

  return res.json({
    original_url: url,
    short_url: indexUrl
  });
});

// Retrieve original URL from short URL
app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = parseInt(req.params.shorturl, 10);

  if (isNaN(shorturl) || shorturl >= originalUrls.length) {
    return res.json({ error: "No short URL found for the given input" });
  }

  res.redirect(originalUrls[shorturl]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

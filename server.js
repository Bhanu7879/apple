const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3200;
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};
const staticFilesPath = path.join(__dirname, "public");
app.use(express.static(staticFilesPath));
https.createServer(options, app).listen(port, () => {
  console.log(`Express server running over HTTPS on port ${port}`);
});
const express = require("express");

const server = express();

//support JSON input for the server endpoints
server.use(express.json());

//Root endpoint
server.get("/", (req, res) => {
   res.send(`<h1>The Blog Spot</h1>`);
});

//Root API endpoint
server.get("/api", (req, res) => {
   res.json({
      message: "Blog Spot API is active.",
   });
});

//404 Not Found
server.use((req, res) => {
   res.status(404).json({
      message: "Oops!! We couldn't find that page.",
   });
});

//Global Error Handler
server.use((error, req, res, next) => {
   res.status(500).json({
      message: "An error occured!",
      error,
   });
});

module.exports = server;

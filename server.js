const express = require("express");
const welcomeRouter = require("./routes/welcome");
const postsRouter = require("./routes/posts");

const server = express();

//support JSON input for the server endpoints
server.use(express.json());
server.use(welcomeRouter);
server.use("/api/posts", postsRouter);

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

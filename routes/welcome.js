const express = require("express");

const router = express.Router();

//Root endpoint
router.get("/", (req, res) => {
   res.send(`<h1>The Blog Spot</h1>`);
});

//Root API endpoint
router.get("/api", (req, res) => {
   res.json({
      message: "Blog Spot API is active.",
   });
});

module.exports = router;

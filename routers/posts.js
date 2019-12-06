const express = require("express");
const db = require("../data/db");

//instanciate a router
const router = express.Router();

/**
 * GET	/api/posts
 * Returns an array of all the post objects contained in the database.
 * @returns {Array}
 */
router.get("/", async (request, response) => {
   try {
      const data = await db.find();
      response.json(data);
   } catch (error) {
      response.status(500).json({ error: "The posts information could not be retrieved." });
   }
});

/**
 * GET	/api/posts/:id
 * Returns the post object with the specified id.
 * @param {number} id
 * @returns {Object}
 */
/*
find(): calling find returns a promise that resolves to an array of all the posts contained in the database.
findById(): this method expects an id as it's only parameter and returns the post corresponding to the id provided or an empty array if no post with that id is found.

When the client makes a GET request to /api/posts:
   If there's an error in retrieving the posts from the database:
      cancel the request.
      respond with HTTP status code 500.
      return the following JSON object: { error: "The posts information could not be retrieved." }.
*/
router.get("/:id", (request, response) => {
   
});

/**
 * GET	/api/posts/:id/comments
 * Returns an array of all the comment objects associated with the post with 
 * the specified id.
 * @param {number} id
 * @returns {Array}
 */

module.exports = router;
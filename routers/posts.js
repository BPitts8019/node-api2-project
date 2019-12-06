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
router.get("/:id", async (request, response) => {
   try {
      const data = await db.findById(request.params.id);

      if (!data || data.length === 0) {
         return response.status(404).json({ message: "The post with the specified ID does not exist." });
      }

      response.json(data);
   } catch (error) {
      response.status(500).json({ error: "The post information could not be retrieved." });
   }
});

/**
 * GET	/api/posts/:id/comments
 * Returns an array of all the comment objects associated with the post with 
 * the specified id.
 * @param {number} id
 * @returns {Array}
 */
/*
findById(): this method expects an id as it's only parameter and returns the post corresponding to the id provided or an empty array if no post with that id is found.

When the client makes a GET request to /api/posts/:id:
   If the post with the specified id is not found:
      return HTTP status code 404 (Not Found).
      return the following JSON object: { message: "The post with the specified ID does not exist." }.

   If there's an error in retrieving the post from the database:
      cancel the request.
      respond with HTTP status code 500.
      return the following JSON object: { error: "The post information could not be retrieved." }.
*/

module.exports = router;
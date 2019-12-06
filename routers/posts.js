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
findPostComments(): the findPostComments accepts a postId as its first parameter and returns all comments on the post associated with the post id.

When the client makes a GET request to /api/posts/:id/comments:
   If the post with the specified id is not found:
      return HTTP status code 404 (Not Found).
      return the following JSON object: { message: "The post with the specified ID does not exist." }.

   If there's an error in retrieving the comments from the database:
      cancel the request.
      respond with HTTP status code 500.
      return the following JSON object: { error: "The comments information could not be retrieved." }.
*/
router.get("/:id/comments", async (request, response) => {

   try {
      //does the post exist?
      const post = await db.findById(request.params.id);
      if (!post || post.length === 0) {
         return response.status(404).json({ message: "The post with the specified ID does not exist." });
      }

      //Yes, get the comments
      const data = await db.findPostComments(request.params.id);
      response.json(data);
   } catch (error) {
      response.status(500).json({ error: "The comments information could not be retrieved." });
   }
});

module.exports = router;
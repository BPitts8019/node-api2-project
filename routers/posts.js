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
 * POST	/api/posts
 * Creates a post using the information sent inside the request body.
 * @param {String} title 
 * @param {String} contents
 * @returns {Object}
 */
router.post("/", async (request, response) => {
   try {
      if (!request.body.title || !request.body.contents) {
         return response.status(400).json({ errorMessage: "Please provide title and contents for the post." });
      }

      const {id} = await db.insert(request.body);
      const [newPost] = await db.findById(id);

      response.status(201).json(newPost);
   } catch (error) {
      response.status(500).json({ error: "There was an error while saving the post to the database" });
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
/*
insert(): calling insert passing it a post object will add it to the database and return an object with the id of the inserted post. The object looks like this: { id: 123 }.

When the client makes a POST request to /api/posts:
   If the request body is missing the title or contents property:
      cancel the request.
      respond with HTTP status code 400 (Bad Request).
      return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.

   If the information about the post is valid:
      save the new post the the database.
      return HTTP status code 201 (Created).
      return the newly created post.

   If there's an error while saving the post:
      cancel the request.
      respond with HTTP status code 500 (Server Error).
      return the following JSON object: { error: "There was an error while saving the post to the database" }.
*/

module.exports = router;
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
      const [data] = await db.findById(request.params.id);

      if (!data) {
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
      const [post] = await db.findById(request.params.id);
      if (!post) {
         return response.status(404).json({ message: "The post with the specified ID does not exist." });
      }

      //Yes, get the comments
      const data = await db.findPostComments(request.params.id);
      response.json(data);
   } catch (error) {
      response.status(500).json({ error: "The comments information could not be retrieved." });
   }
});

/**
 * POST	/api/posts/:id/comments
 * Creates a comment for the post with the specified id using information sent 
 * inside of the request body.
 * @param {number} id
 * @returns {Object}
 */
router.post("/:post_id/comments", async (request, response) => {
   try {
      //Did user provide good data?
      if (!request.body.text) {
         return response.status(400).json({ errorMessage: "Please provide text for the comment." });
      }

      //Does this post exist?
      const [post] = await db.findById(request.params.post_id);
      if (!post) {
         return response.status(404).json({ message: "The post with the specified ID does not exist." });
      }

      //create new comment, then return the result
      const {id} = await db.insertComment({
         text: request.body.text,
         post_id: request.params.post_id
      });
      const [newComment] = await db.findCommentById(id);
      response.status(201).json(newComment);

   } catch (error) {
      response.status(500).json({ error: "There was an error while saving the comment to the database" });
   }
});

/*
/api/posts/:id/comments
insertComment(): calling insertComment while passing it a comment object will add it to the database and return an object with the id of the inserted comment. The object looks like this: { id: 123 }. This method will throw an error if
findCommentById(): accepts an id and returns the comment associated with that id.

{
   text: "The text of the comment", // String, required
   post_id: "The id of the associated post", // Integer, required, must match the id of a post entry in the database
   created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
   updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
}


When the client makes a POST request to /api/posts/:id/comments:
   If the post with the specified id is not found:
      return HTTP status code 404 (Not Found).
      return the following JSON object: { message: "The post with the specified ID does not exist." }.

   If the request body is missing the text property:
      cancel the request.
      respond with HTTP status code 400 (Bad Request).
      return the following JSON response: { errorMessage: "Please provide text for the comment." }.

   If the information about the comment is valid:
      save the new comment the the database.
      return HTTP status code 201 (Created).
      return the newly created comment.

   If there's an error while saving the comment:
      cancel the request.
      respond with HTTP status code 500 (Server Error).
      return the following JSON object: { error: "There was an error while saving the comment to the database" }.
*/

module.exports = router;
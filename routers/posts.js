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

/**
 * DELETE	/api/posts/:id
 * Removes the post with the specified id and returns the deleted post object. 
 * You may need to make additional calls to the database in order to satisfy 
 * this requirement.
 * @param {number} id
 * @returns {Object}
 */
router.delete("/:id", async (request, response) => {
   try {
      //Does the post exist?
      const [oldPost] = await db.findById(request.params.id);
      if (!oldPost) {
         return response.status(404).json({ message: "The post with the specified ID does not exist." });
      }

      //Delete the post
      console.log(`Deleting post: ${oldPost.id}`);
      const num = await db.remove(oldPost.id);
      console.log(`Removed ${num} files`);
      response.json(oldPost);
   } catch (error) {
      response.status(500).json({ error: "The post could not be removed" });
   }
});

/*
findById(): this method expects an id as it's only parameter and returns the post corresponding to the id provided or an empty array if no post with that id is found.
remove(): the remove method accepts an id as its first parameter and upon successfully deleting the post from the database it returns the number of records deleted.

{
   title: "The post title", // String, required
   contents: "The post contents", // String, required
   created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
   updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
}

When the client makes a DELETE request to /api/posts/:id:
   // If the post with the specified id is not found:
   //    return HTTP status code 404 (Not Found).
   //    return the following JSON object: { message: "The post with the specified ID does not exist." }.
   
   // If there's an error in removing the post from the database:
   //    cancel the request.
   //    respond with HTTP status code 500.
   //    return the following JSON object: { error: "The post could not be removed" }.
*/

module.exports = router;
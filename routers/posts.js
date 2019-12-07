const express = require("express");
const db = require("../data/db");

//instanciate a router
const router = express.Router();

/**
 * GET	/api/posts
 * Returns an array of all the post objects contained in the database.
 * @returns {Array} all the posts
 */
router.get("/", async (request, response) => {
   try {
      const allPosts = await db.find();
      response.json(allPosts);
   } catch (error) {
      response.status(500).json({ error: "The posts information could not be retrieved." });
   }
});

/**
 * GET	/api/posts/:id
 * Returns the post object with the specified id.
 * @param {number} post_id
 * @returns {Object} the post with the specified id
 */
router.get("/:post_id", async (request, response) => {
   try {
      const [post] = await db.findById(request.params.post_id);

      if (!post) {
         return response.status(404).json({ message: "The post with the specified ID does not exist." });
      }

      response.json(post);
   } catch (error) {
      response.status(500).json({ error: "The post information could not be retrieved." });
   }
});

/**
 * GET	/api/posts/:id/comments
 * Returns an array of all the comment objects associated with the post with 
 * the specified id.
 * @param {number} post_id
 * @returns {Array} all of the comments for the post with 
 */
router.get("/:post_id/comments", async (request, response) => {

   try {
      //does the post exist?
      const [post] = await db.findById(request.params.post_id);
      if (!post) {
         return response.status(404).json({ message: "The post with the specified ID does not exist." });
      }

      //Yes, get the comments
      const allComments = await db.findPostComments(post.id);
      response.json(allComments);
   } catch (error) {
      response.status(500).json({ error: "The comments information could not be retrieved." });
   }
});

/**
 * POST	/api/posts
 * Creates a post using the information sent inside the request body.
 * @param {string} title 
 * @param {string} contents
 * @returns {Object} the new post
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
 * @param {number} post_id
 * @returns {Object} the new comment
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
 * @param {number} post_id
 * @returns {Object} the post that was deleted
 */
router.delete("/:post_id", async (request, response) => {
   try {
      //Does the post exist?
      const [oldPost] = await db.findById(request.params.post_id);
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

/**
 * PUT	/api/posts/:id
 * Updates the post with the specified id using data from the request body. 
 * Returns the modified document, NOT the original.
 * @param {number} id
 * @param {Object} postUpdate
 * @returns {Object} The modified post
 */
router.put("/:id", async (request, response) => {
   try {
      if (!request.body.title || !request.body.contents) {
         return response.status(400).json({ errorMessage: "Please provide title and contents for the post." });
      }

      //Is there a post to update?
      let [post] = await db.findById(request.params.id);
      if (!post) {
         return response.status(404).json({ message: "The post with the specified ID does not exist." });
      }

      //Update the post
      console.log(`Updating post id-${post.id}`);
      const num = await db.update(post.id, request.body);
      console.log("done");
      
      //get new post and return to user
      [post] = await db.findById(post.id);
      response.json(post);
   } catch (error) {
      response.status(500).json({ error: "The post information could not be modified." });
   }
});

module.exports = router;
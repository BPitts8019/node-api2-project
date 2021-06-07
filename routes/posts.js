const express = require("express");
const postsDb = require("../data/db");

const router = express.Router();

/*
Method	Endpoint	Description
POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
*/
router.post("/", async (req, res) => {
   if (!req.body.title || !req.body.contents) {
      res.status(400).json({
         errorMessage: "Please provide title and contents for the post.",
      });
      return;
   }

   try {
      const { id } = await postsDb.insert({
         title: req.body.title,
         contents: req.body.contents,
      });
      const [newPost] = await postsDb.findById(id);
      res.status(201).json(newPost);
   } catch (error) {
      res.status(500).json({
         error: "There was an error while saving the post to the database.",
      });
   }
});

router.get("/", async (req, res) => {
   try {
      const posts = await postsDb.find();
      res.json(posts);
   } catch (error) {
      res.status(500).json({
         error: "The posts information could not be retrieved.",
      });
   }
});

router.get("/:id", async (req, res) => {
   const { id } = req.params;

   try {
      const [post] = await postsDb.findById(id);
      if (post) {
         res.json(post);
         return;
      }

      res.status(404).json({
         message: "The post with the specified ID does not exist.",
      });
   } catch (error) {
      res.status(500).json({
         error: "The post information could not be retrieved.",
      });
   }
});

router.put("/:id", async (req, res) => {
   const { id } = req.params;
   const { title, contents } = req.body;

   if (!title || !contents) {
      res.status(400).json({
         message: "Please provide title and contents for the post.",
      });
      return;
   }

   try {
      const [post] = await postsDb.findById(id);
      if (!post) {
         res.status(404).json({
            message: "The post with the specified ID does not exist.",
         });
         return;
      }

      await postsDb.update(id, {
         title,
         contents,
      });

      const [updatedPost] = await postsDb.findById(id);
      res.json(updatedPost);
   } catch (error) {
      res.status(500).json({
         error: "The post information could not be modified.",
      });
   }
});

module.exports = router;

const express = require("express");
const postsDb = require("../data/db");

const router = express.Router();

/*
Method	Endpoint	Description
POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
GET	/api/posts/:id	Returns the post object with the specified id.
GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.



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
         error: "There was an error while saving the post to the database",
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

module.exports = router;

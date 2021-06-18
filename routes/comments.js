const express = require("express");
const db = require("../data/db");

const router = express.Router({
   mergeParams: true,
});

router.post("/", async (req, res) => {
   const { id: post_id } = req.params;
   const { text } = req.body;

   if (!text) {
      res.status(400).json({ message: "Please provide text for the comment." });
      return;
   }

   try {
      const [post] = await db.findById(post_id);
      if (!post) {
         res.status(404).json({
            message: "The post with the specified ID does not exist.",
         });
         return;
      }

      const { id: commentId } = await db.insertComment({ text, post_id });
      const [newComment] = await db.findCommentById(commentId);
      res.status(201).json(newComment);
   } catch (error) {
      res.status(500).json({
         message: "There was an error while saving the comment to the database",
         error,
      });
   }
});

router.get("/", async (req, res) => {
   const { id } = req.params;

   try {
      const [post] = await db.findById(id);
      if (!post) {
         res.status(404).json({
            message: "The post with the specified ID does not exist.",
         });
         return;
      }

      const comments = await db.findPostComments(id);
      res.json(comments);
   } catch (error) {
      res.status(500).json({
         error: "The comments information could not be retrieved.",
      });
   }
});

module.exports = router;

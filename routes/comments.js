const express = require("express");

const router = express.Router({
   mergeParams: true,
});

/*
Method	Endpoint	Description
POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.


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


When the client makes a GET request to /api/posts/:id/comments:
If the post with the specified id is not found:
   return HTTP status code 404 (Not Found).
   return the following JSON object: { message: "The post with the specified ID does not exist." }.

If there's an error in retrieving the comments from the database:
   cancel the request.
   respond with HTTP status code 500.
   return the following JSON object: { error: "The comments information could not be retrieved." }.
*/
router.get("/", (req, res) => {
   const { id } = req.params;
   res.json({ message: `It Works! ${id}` });
});

module.exports = router;

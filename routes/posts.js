const express = require("express");
const postsDb = require("../data/db");

const router = express.Router();

/*

Method	Endpoint	Description
POST	/api/posts	Creates a post using the information sent inside the request body.
POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
GET	/api/posts/:id	Returns the post object with the specified id.
GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.


GET	/api/posts	Returns an array of all the post objects contained in the database.
When the client makes a GET request to /api/posts:

find(): calling find returns a promise that resolves to an array of all the posts contained in the database.

If there's an error in retrieving the posts from the database:
cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The posts information could not be retrieved." }.
*/

router.get("/", async (req, res) => {
   try {
      const data = await postsDb.find();
      res.json({ data });
   } catch (error) {
      res.status(500).json({
         error: "The posts information could not be retrieved.",
      });
   }

   res.json({ message: "it's working" });
});

module.exports = router;

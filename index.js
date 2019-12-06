const express = require("express");
const postsRouter = require("./routers/posts");

//App instance
const app = express();

//endpoint routers
app.use("/api/posts", postsRouter);

//start the server
const port = 8080;
app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
});


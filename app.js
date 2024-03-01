const express = require("express");
const userRouter = require("./routes/userRouter.js");
const blogRouter = require("./routes/blogRouter.js");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const {
  checkForAuthentictaionCookie,
} = require("./middleware/authentication.js");
const { Blog } = require("./models/blogModel.js");

const app = express();
const PORT = process.env.PORT || 8300;

async function connecMongoDb() {
  try {
    return mongoose.connect(process.env.MONGO_URL);
  } catch (err) {
    console.log(err);
  }
}
connecMongoDb()
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuthentictaionCookie("newAuthToken"));
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  //res.render("addBlog");
  res.render("homepage", { user: req.user, blogs: allBlogs });
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

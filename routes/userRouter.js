const { Router } = require("express");
const { User } = require("../models/userModel");

const router = Router();

router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenToken(email, password);

    if (!token) {
      return res.redirect("/user/signin");
    }
    return res.cookie("newAuthToken", token).redirect("/");
  } catch (err) {
    return res.render("signin", { error: "Invalid Login Password" });
  }
});
router.get("/logout", async (req, res) => {
  try {
    return res.clearCookie("newAuthToken").redirect("/");
  } catch (err) {
    return res.render("signin", { error: "Invalid Login Password" });
  }
});
module.exports = router;

const express = require("express");
const { auth, admin, seller } = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, admin, (req, res) => {
  res.json({ message: "Analytics endpoint" });
});

module.exports = router;
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("its user route");
});

module.exports = router;

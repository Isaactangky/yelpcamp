const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");

const upload = multer({ storage });
router.route("/").get(catchAsync(campgrounds.index)).post(
  isLoggedIn,

  upload.array("image", 12),
  validateCampground,
  catchAsync(campgrounds.createCampground)
);
// create new
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// edit

router
  .route("/:id")
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image", 12),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  // show details
  .get(catchAsync(campgrounds.showCampground))
  // delete
  .delete(catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);
module.exports = router;

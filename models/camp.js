const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const opts = { toJSON: { virtuals: true } };
const imageSchema = Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campgroundSchema = Schema(
  {
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);
campgroundSchema.virtual("properties.popUpText").get(function () {
  return `<a href="/campgrounds/${this._id}" target="_blank">${this.title}</a>
  <p>${this.location}</p>`;
});

campgroundSchema.post("findOneAndDelete", async (campground) => {
  if (campground) {
    await Review.deleteMany({
      _id: { $in: campground.reviews },
    });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);

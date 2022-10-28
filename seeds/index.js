const Campground = require("../models/camp");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected seeds");
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "635642a2517441d648175fed",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dhqibjrrn/image/upload/v1666751415/YelpCamp/k8yh6knkf3k7qegtvlpa.png",
          filename: "YelpCamp/k8yh6knkf3k7qegtvlpa",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam temporibus fuga aliquid officia similique sequi! Doloremque qui totam vero harum repudiandae deserunt ducimus assumenda debitis tempore? Ipsam ipsa adipisci amet.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});

const express = require("express");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
  res.render("index", {
    title: "CSE Motors - Quality Pre-Owned Vehicles",
    featuredVehicles: [
      {
        name: "2022 Honda Civic",
        price: "$22,500",
        image: "/images/vehicle1.jpg"
      },
      {
        name: "2021 Toyota Camry",
        price: "$24,800",
        image: "/images/vehicle2.jpg"
      },
      {
        name: "2023 Ford Escape",
        price: "$28,300",
        image: "/images/vehicle3.jpg"
      },
      {
        name: "2022 Chevrolet Malibu",
        price: "$23,900",
        image: "/images/vehicle4.jpg"
      }
    ]
  });
});

module.exports = router;

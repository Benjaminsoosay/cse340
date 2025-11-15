function buildInventoryDetail(vehicle) {
  if (!vehicle) {
    return "<p>Vehicle not found</p>";
  }

  // Format price with commas and dollar sign
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(vehicle.inv_price);

  // Format mileage with commas
  const formattedMileage = new Intl.NumberFormat("en-US").format(vehicle.inv_miles);

  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" class="img-fluid">
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <div class="price-mileage">
          <h2 class="price">${formattedPrice}</h2>
          <p class="mileage">Mileage: ${formattedMileage} miles</p>
        </div>
        <div class="vehicle-specs">
          <p><strong>Color:</strong> ${vehicle.inv_color}</p>
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
          <p><strong>Type:</strong> ${vehicle.inv_type}</p>
        </div>
        <div class="contact-info">
          <button class="btn btn-primary">Contact Us About This Vehicle</button>
        </div>
      </div>
    </div>
  `;
}

module.exports = { buildInventoryDetail };

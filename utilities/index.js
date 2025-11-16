// Example utility function
function buildVehicleDetail(vehicle) {
  return `
    <div class="vehicle-detail">
      <h2>${vehicle.make} ${vehicle.model}</h2>
      <img src="${vehicle.image}" alt="Image of ${vehicle.make} ${vehicle.model}">
      <p>Year: ${vehicle.year}</p>
      <p>Price: $${vehicle.price.toLocaleString()}</p>
      <p>Mileage: ${vehicle.miles.toLocaleString()} miles</p>
      <p>Description: ${vehicle.description}</p>
    </div>
  `;
}

// Export functions
module.exports = {
  buildVehicleDetail
};

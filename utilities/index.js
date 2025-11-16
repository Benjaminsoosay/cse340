// Utilities module
const utilities = {};

// Format price with commas and USD symbol (Requirement 3)
utilities.formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
};

// Format mileage with commas (Requirement 9)
utilities.formatMileage = (mileage) => {
  return new Intl.NumberFormat('en-US').format(mileage);
};

// Build inventory list HTML (Requirement 6 for list view)
utilities.buildInventoryList = (vehicles) => {
  let html = '<div class="vehicle-list">';
  vehicles.forEach(vehicle => {
    const formattedPrice = utilities.formatPrice(vehicle.price);
    const formattedMileage = utilities.formatMileage(vehicle.mileage);

    html += `
      <div class="vehicle-card">
        <a href="/inventory/vehicle/${vehicle.id}">
          <img src="${vehicle.image}" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}" class="vehicle-thumb">
          <h2>${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
        </a>
        <p class="vehicle-price">${formattedPrice}</p>
        <p class="vehicle-mileage">${formattedMileage} miles</p>
        <p class="vehicle-color">Color: ${vehicle.color}</p>
      </div>
    `;
  });
  html += '</div>';
  return html;
};

// Build vehicle detail HTML (Requirement 6 for detail view)
utilities.buildVehicleDetail = (vehicleData) => {
  const formattedPrice = utilities.formatPrice(vehicleData.price);
  const formattedMileage = utilities.formatMileage(vehicleData.mileage);

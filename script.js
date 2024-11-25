const apiBaseUrl = "http://127.0.0.1:5000/api";
const chartCanvas = document.getElementById("airQualityChart");
const errorElement = document.getElementById("error");
const loadingElement = document.getElementById("loading");

// Buttons
const airQualityBtn = document.getElementById("airQualityBtn");
const temperatureBtn = document.getElementById("temperatureBtn");
const humidityBtn = document.getElementById("humidityBtn");
const loadDataBtn = document.getElementById("loadDataBtn");
const monthlyTrendBtn = document.getElementById("monthlyTrendBtn");
const dailyTrendBtn = document.getElementById("dailyTrendBtn");
const weeklyTrendBtn = document.getElementById("weeklyTrendBtn");
const saveThresholdBtn = document.getElementById("saveThresholdBtn");

// Other Inputs
const thresholdInput = document.getElementById("threshold");
const locationSelect = document.getElementById("locationSelect");

let chart;
let airQualityData = { air_quality_index: [], timestamp: [], temperature: [], humidity: [] };
let selectedFeature = "air_quality_index"; // Default feature

// Fetch environmental data based on location
async function fetchData(location = "location1") {
  try {
    loadingElement.style.display = "block"; // Show loading spinner
    const response = await fetch(`${apiBaseUrl}/environmental_data?location=${location}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    airQualityData = data;
    renderChart(); // Render the chart after data is loaded
    loadingElement.style.display = "none"; // Hide loading spinner
  } catch (error) {
    console.error("Error fetching data:", error);
    errorElement.textContent = "Failed to load data. Please try again.";
    errorElement.style.display = "block";
    loadingElement.style.display = "none"; // Hide loading spinner
  }
}

// Render the chart based on selectedFeature
function renderChart() {
  const ctx = chartCanvas.getContext("2d");
  if (chart) chart.destroy(); // Destroy previous chart if exists

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: airQualityData.timestamp,
      datasets: [
        {
          label: "Air Quality Index",
          data: airQualityData.air_quality_index,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          hidden: selectedFeature !== "air_quality_index",
        },
        {
          label: "Temperature (°C)",
          data: airQualityData.temperature,
          borderColor: "orange",
          backgroundColor: "rgba(255, 165, 0, 0.1)",
          hidden: selectedFeature !== "temperature",
        },
        {
          label: "Humidity (%)",
          data: airQualityData.humidity,
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          hidden: selectedFeature !== "humidity",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
            },
          },
        },
      },
      scales: {
        x: { title: { display: true, text: "Time" } },
        y: { title: { display: true, text: "Measurements" } },
      },
    },
  });
}

// Change chart type based on trends
function changeChartType(type) {
  console.log(`Chart type changed to: ${type}`);
  // Fetch data for the selected trend (monthly, daily, weekly)
  // Placeholder logic, can be adjusted based on specific trend logic
  fetchData(locationSelect.value); // Fetch data from selected location

  // Update chart accordingly (in a more complete implementation, you would filter the data based on time range)
}

// Set threshold
function setThreshold() {
  const threshold = parseFloat(thresholdInput.value);
  if (isNaN(threshold)) {
    console.error("Invalid threshold value.");
    errorElement.textContent = "Invalid threshold value.";
    errorElement.style.display = "block";
    return;
  }
  console.log(`Threshold set to: ${threshold}`);
  errorElement.style.display = "none";
}

// Button click events to switch features
airQualityBtn.addEventListener("click", () => {
  selectedFeature = "air_quality_index";
  renderChart();
});

temperatureBtn.addEventListener("click", () => {
  selectedFeature = "temperature";
  renderChart();
});

humidityBtn.addEventListener("click", () => {
  selectedFeature = "humidity";
  renderChart();
});

// Other button events
loadDataBtn.addEventListener("click", () => fetchData(locationSelect.value)); // Pass selected location
monthlyTrendBtn.addEventListener("click", () => changeChartType("monthly"));
dailyTrendBtn.addEventListener("click", () => changeChartType("daily"));
weeklyTrendBtn.addEventListener("click", () => changeChartType("weekly"));
saveThresholdBtn.addEventListener("click", setThreshold);

// Dark Mode Toggle
document.getElementById("toggleDarkMode").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

// Initialize
fetchData(locationSelect.value); // Initialize with default location

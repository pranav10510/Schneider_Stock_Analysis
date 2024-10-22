// Existing stock data visualization (same as before)
const stockData = {
    '2012': {
        dates: ['2012-03-20', '2012-03-21', '2012-03-22', '2012-03-23', '2012-03-26'],
        closePrices: [61.75, 64.80, 66.90, 68.75, 69.60],
        volumes: [1201451, 545730, 82634, 37156, 120794],
        highPrices: [65.00, 64.80, 68.00, 69.50, 71.25],
        lowPrices: [61.75, 58.70, 63.95, 66.00, 67.40]
    },
    '2013': {
        dates: ['2013-03-20', '2013-03-21', '2013-03-22', '2013-03-23', '2013-03-26'],
        closePrices: [70.80, 74.80, 76.90, 78.75, 79.60],
        volumes: [1001451, 505730, 76234, 35156, 110794],
        highPrices: [75.00, 74.80, 78.00, 79.50, 81.25],
        lowPrices: [71.75, 70.70, 73.95, 76.00, 77.40]
    }
};

// Global variables for chart type and current chart instance
let currentChartType = 'line';
let priceChart, additionalChart;

const priceCtx = document.getElementById('priceChart').getContext('2d');
const additionalCtx = document.getElementById('additionalChart') ? document.getElementById('additionalChart').getContext('2d') : null; // Ensure additionalCtx is defined

// Function to create the main chart with the current data and chart type
function createChart(data) {
    priceChart = new Chart(priceCtx, {
        type: currentChartType,
        data: {
            labels: data.dates,
            datasets: [{
                label: 'Closing Price',
                data: data.closePrices,
                backgroundColor: currentChartType === 'pie' ? ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff9999'] : 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: currentChartType !== 'pie' ? {
                x: { title: { display: true, text: 'Date' }},
                y: { title: { display: true, text: 'Price (INR)' }}
            } : {}
        }
    });
}

// Function to create the additional chart for Page 2
function createAdditionalChart(data) {
    if (additionalCtx) {
        if (additionalChart) {
            additionalChart.destroy();  // Destroy the previous chart before creating a new one
        }

        additionalChart = new Chart(additionalCtx, {
            type: 'bar', // You can choose another chart type here
            data: {
                labels: data.dates,
                datasets: [{
                    label: 'Volume',
                    data: data.volumes,
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Date' }},
                    y: { title: { display: true, text: 'Volume' }}
                }
            }
        });
    }
}

// Function to update the main chart based on the selected year
function updateCharts() {
    const selectedYear = document.getElementById('yearDropdown').value;

    if (selectedYear === 'all') {
        const allData = combineData(stockData);
        updateChart(allData);
        createAdditionalChart(allData); // Update additional chart too
    } else {
        const filteredData = stockData[selectedYear];
        updateChart(filteredData);
        createAdditionalChart(filteredData); // Update additional chart too
    }
}

// Combine data from all available years
function combineData(data) {
    const combined = {
        dates: [],
        closePrices: [],
        volumes: []
    };

    for (const year in data) {
        combined.dates.push(...data[year].dates);
        combined.closePrices.push(...data[year].closePrices);
        combined.volumes.push(...data[year].volumes);
    }

    return combined;
}

// Function to set the chart type (line, bar, pie) and update the main chart
function setChartType(type) {
    currentChartType = type;

    // Update the chart based on the current data
    const selectedYear = document.getElementById('yearDropdown').value;
    const data = selectedYear === 'all' ? combineData(stockData) : stockData[selectedYear];

    updateChart(data);
}

// Update the chart instance with new data
function updateChart(data) {
    if (priceChart) {
        priceChart.destroy();
    }

    createChart(data);
}

// Initialize the main chart with all data
const initialData = combineData(stockData);
createChart(initialData);

// Initialize the additional chart with all data (on additional page load)
if (additionalCtx) {
    createAdditionalChart(initialData);
}

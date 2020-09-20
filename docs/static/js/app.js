/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */


// Drop Down Menu  
// Initializes the page with a default plot
function init() {

    data = [{
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16] }];
  
    var CHART = d3.selectAll("#plot").node();
  
    Plotly.newPlot(CHART, data);
  
    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("body").on("change", updatePlotly);

    // This function is called when a dropdown menu item is selected
    function updatePlotly() {
        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var dataset = dropdownMenu.node().value;

        var CHART = d3.selectAll("#plot").node();

        // Initialize x and y arrays
        var x = [];
        var y = [];

        switch(dataset) {
            case "dataset1":
            x = [1, 2, 3, 4, 5];
            y = [1, 2, 4, 8, 16];
            break;

            case "dataset2":
            x = [10, 20, 30, 40, 50];
            y = [1, 10, 100, 1000, 10000];
            break;

            case "dataset3":
            x = [100, 200, 300, 400, 500];
            y = [10, 100, 50, 10, 0];
            break;

            default:
            x = [1, 2, 3, 4, 5];
            y = [1, 2, 3, 4, 5];
            break;
        }
    }
    // Note the extra brackets around 'x' and 'y'
    Plotly.restyle(CHART, "x", [x]);
    Plotly.restyle(CHART, "y", [y]);

    // Meta Data Section
    function buildMeta() {
        // Get data from samples.json
        d3.json("data/samples.json").then(function(data) {

            // Grab values from the response json object to build the plots
            var name = data.dataset.name;
            var stock = data.dataset.dataset_code;
            var startDate = data.dataset.start_date;
            var endDate = data.dataset.end_date;
            var dates = unpack(data.dataset.data, 0);
            var openingPrices = unpack(data.dataset.data, 1);
            var highPrices = unpack(data.dataset.data, 2);
            var lowPrices = unpack(data.dataset.data, 3);
            var closingPrices = unpack(data.dataset.data, 4);
        })
    }

    getMonthlyData();

    function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
        var table = d3.select("#summary-table");
        var tbody = table.select("tbody");
        var trow;
        for (var i = 0; i < 12; i++) {
            trow = tbody.append("tr");
            trow.append("td").text(dates[i]);
            trow.append("td").text(openPrices[i]);
            trow.append("td").text(highPrices[i]);
            trow.append("td").text(lowPrices[i]);
            trow.append("td").text(closingPrices[i]);
            trow.append("td").text(volume[i]);
        }
    }

    function buildBarPlot(stock) {

        // Build Bar Chart
        d3.json("data/samples.json").then(function(data) {
            
            // Sort the data array using the greekSearchResults value
            data.sort(function(a, b) {
                return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
            });

            // Slice the first 10 objects for plotting
            data = data.slice(0, 10);

            // Reverse the array due to Plotly's defaults
            data = data.reverse();

            // Trace1 for the Greek Data
            var trace1 = {
                x: data.map(row => row.greekSearchResults),
                y: data.map(row => row.greekName),
                text: data.map(row => row.greekName),
                name: "Greek",
                type: "bar",
                orientation: "h"
            };

            // data
            var chartData = [trace1];

            // Apply the group bar mode to the layout
            var layout = {
                title: "Greek gods search results",
                margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
                }
            };

            // Render the plot to the div tag with id "plot"
            Plotly.newPlot("plot", chartData, layout);
        });
    }
}

init();
/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - names
 * index 1 - metadata
 * index 2 - samples
 */

// not sure if I need this unpack function yet
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}

// Initializes the page with a default plot
function init() {
    // First Step is to grab the dropdown selector to select each dataset
    var selDataset = d3.select("#selDataset");

    // Append names to the selDataset dropdown
    d3.json("data/samples.json").then((data) => {
        var nameIds = data.names;
        console.log(nameIds)
        
        nameIds.forEach((i) => {
          selDataset
          .append("option")
          .text(i)
          .property("value", i);
    });


    // Initial nameId used to build plots on site load
    const initName = nameIds[0];
    buildCharts(initName);
    buildMetadata(initName);
    })
}

// build the charts for the dashboard
function buildCharts(sampleID) {

    // grab sample data from the samples.json file  
    d3.json("data/samples.json").then((data) => {
        
        // Object to Array of data
        // Create an array of each values data
        // creating the variables to use in charting
        var samples = data.samples;
        console.log(samples);
        var samplesFilter = samples.filter(sampleObject => sampleObject.id == sampleID);
        console.log(samplesFilter);
        var result = samplesFilter[0];
        console.log(result);
        var otu_ids = result.otu_ids;
        console.log(otu_ids);
        var otu_labels = result.otu_labels; 
        console.log(otu_labels);
        var sample_values = result.sample_values;
        console.log(sample_values);


        /// !!!*** REMOVE THIS SORTING and perform it in the trace
        // Sort the sampleArray array using the top OTUs value
        //     sampleValueArray.sort(function(a, b) {
        //       return parseFloat(b.sample_values) - parseFloat(a.sample_values);
        //     });
        
        //     // Slice the first 10 objects for plotting
        //     var data = sampleValueArray.slice(0, 10);
        //     console.log(data);
        
        //     // Reverse the array due to Plotly's defaults
        //     data = data.reverse();
        

        // Bar Chart
        var trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(oIDs => `OTU ${oIDs}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "OTU",
            type: "bar",
            orientation: "h"
        };
        var data = [trace1];
        var layout = {
            title: "Top 10 OTUs for Subject" + sampleID,
            margin: {l: 100, r: 100, t: 40, b: 100}
        };
      Plotly.newPlot("bar", data, layout);  
    });
}
    // d3.json("data/samples.json").then((importedData) => {
    //     // console.log(importedData);
    //     var data = importedData;
        //console.log(data);
        
        // Object to Array of data
        // Create an array of each values data
        // var namesArray = Object.values(data.names);
        // var metadataArray = Object.values(data.metadata);
        // var samplesArray = Object.values(data.samples);
        // var sampleValueArray = Object.keys(samplesArray.sample_values);
        // var otuIds = Object.keys(samplesArray.out_ids);
        // console.log(otuIds);
        // console.log(sampleValueArray);
        
        


        // Sort the sampleArray array using the top OTUs value
    //     sampleValueArray.sort(function(a, b) {
    //       return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    //     });
        
    //     // Slice the first 10 objects for plotting
    //     var data = sampleValueArray.slice(0, 10);
    //     console.log(data);
        
    //     // Reverse the array due to Plotly's defaults
    //     data = data.reverse();
        
    //     // Trace1 for the Greek Data
    //     var trace1 = {
    //       x: data.map(row => row.sample_values),
    //       y: data.map(row => row.sample_values),
    //       text: data.map(row => row.otu_labels),
    //       name: "OTU",
    //       type: "bar",
    //       orientation: "h"

    //     };
        
    //     // data
    //     var chartData = [trace1];
        
    //     // Apply the group bar mode to the layout
    //     var layout = {
    //       //title: "Top 10 OTUs",
    //       margin: {
    //         l: 100,
    //         r: 100,
    //         t: 100,
    //         b: 100
    //       }
    //     };
        
    //     // Render the plot to the div tag with id "plot"
    //     Plotly.newPlot("bar", chartData, layout);
    //   });

    //     switch(dataset) {
    //         case "dataset1":
    //         x = [1, 2, 3, 4, 5];
    //         y = [1, 2, 4, 8, 16];
    //         break;

    //         case "dataset2":
    //         x = [10, 20, 30, 40, 50];
    //         y = [1, 10, 100, 1000, 10000];
    //         break;

    //         case "dataset3":
    //         x = [100, 200, 300, 400, 500];
    //         y = [10, 100, 50, 10, 0];
    //         break;

    //         default:
    //         x = [1, 2, 3, 4, 5];
    //         y = [1, 2, 3, 4, 5];
    //         break;
    //     }
    //     // Note the extra brackets around 'x' and 'y'
    //     Plotly.restyle(CHART, "x", [x]);
    //     Plotly.restyle(CHART, "y", [y]);



    // // Meta Data Section
    // function buildMeta() {
    //     // Get data from samples.json
    //     d3.json("data/samples.json").then(function(data) {

    //         // Grab values from the response json object to build the plots -c
    //         var name = data.dataset.name;
    //         var stock = data.dataset.dataset_code;
    //         var startDate = data.dataset.start_date;
    //         var endDate = data.dataset.end_date;
    //         var dates = unpack(data.dataset.data, 0);
    //         var openingPrices = unpack(data.dataset.data, 1);
    //         var highPrices = unpack(data.dataset.data, 2);
    //         var lowPrices = unpack(data.dataset.data, 3);
    //         var closingPrices = unpack(data.dataset.data, 4);
    //     })
    // }

    // getMonthlyData();

    // function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
    //     var table = d3.select("#summary-table");
    //     var tbody = table.select("tbody");
    //     var trow;
    //     for (var i = 0; i < 12; i++) {
    //         trow = tbody.append("tr");
    //         trow.append("td").text(dates[i]);
    //         trow.append("td").text(openPrices[i]);
    //         trow.append("td").text(highPrices[i]);
    //         trow.append("td").text(lowPrices[i]);
    //         trow.append("td").text(closingPrices[i]);
    //         trow.append("td").text(volume[i]);
    //     }
    // }
    // }

init();
// ** not sure if I need this helper function still
/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - names
 * index 1 - metadata
 * index 2 - samples
 */

// ** not sure if I need this unpack function yet
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
            orientation: "h",
            marker: {
                color: 'rgb(78, 105, 228)'
              }
        };
        var data = [trace1];
        var layout = {
            title: "Top 10 OTUs for Subject" + sampleID,
            margin: {l: 100, r: 100, t: 40, b: 100}
        };
      Plotly.newPlot("bar", data, layout);  
    });
}
// Gather and update metadata for the Demographic Info Panel
function buildMetadata(meta) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        console.log(metadata);
        var metaArray = metadata.filter(samplePick => samplePick.id == meta);
        console.log(metadata);
        var result = metaArray[0];
        // Select the panel in the HTML file for assigning the metadata
        var metaPanel = d3.select("#sample-metadata");

        // clear panel before populating
        metaPanel.html("");
        // Populate the Demographic panel. Remember to Uppercase the Key
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
    })
}

// Return the data when a new subject is picked in the dropdown
function optionChanged(newSubject) {
    buildCharts(newSubject);
    buildMetadata(newSubject);
    }
// load the initial data function when site loads
init();
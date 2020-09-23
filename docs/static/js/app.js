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
// Template Literals is the same as F strings in Python
//var name = "Jay"
//`Hello my name is ${name}.` == f"Hello my name is {name}"
// Referencing json data
//d3.json("samples.json").then((data)......

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
            xaxis: {title: "Top 10 OTUs for Subject " + sampleID},
            /*title: {
             text: 'Top 10 OTUs for Subject '+ sampleID,
             font: {
               family: 'Arial, monospace',
               size: 18,
               color: 'rgb(10,10,10)'
             }
            },*/
           
            margin: {l: 100, r: 100, t: 40, b: 100}
        };
      Plotly.newPlot("bar", data, layout, {displaylogo: false}, {modebar: 'l'});  

      // Bubble Chart
      var trace1 = {
          
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
          size: sample_values,
          color: otu_ids,
          colorscale:"Electric"
          }
      };
      var data = [trace1];
      var layout = {
          showlegend: false,
          hovermode: 'closest',
          xaxis: {title:"OTU Sample Amounts for ID " + sampleID},
          margin: {t:30}
      };
      Plotly.newPlot('bubble', data, layout, {displaylogo: false}); 
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
        

        // Adding Gauge Chart
        // *** This is code raw from plotly **customize**
        var data = [
         {
           type: "indicator",
           value: 200,
           title: 'Belly Button Washing Frequency<br> Scrubs per Week',
           titlefont: {family: 'Arial, Helvetica, sans-serif'},
           delta: { reference: 160 },
           gauge: { axis: { visible: false, range: [0, 250] } },
           domain: { row: 0, column: 0 }
         },
        //  {
        //    type: "indicator",
        //    value: 120,
        //    gauge: {
        //      shape: "bullet",
        //      axis: {
        //        visible: false,
        //        range: [-200, 200]
        //      }
        //    },
        //    domain: { x: [0.1, 0.5], y: [0.15, 0.35] }
        //  },
        //  {
        //    type: "indicator",
        //    mode: "number+delta",
        //    value: 300,
        //    domain: { row: 0, column: 1 }
        //  },
        //  { type: "indicator", mode: "delta", value: 40, domain: { row: 1, column: 1 } }
       ];
       
       var layout = {
         width: 600,
         height: 400,
         //margin: { t: 25, b: 25, l: 25, r: 25 },
         grid: { rows: 2, columns: 2, pattern: "independent" },
         template: {
           data: {
             indicator: [
               {
                mode: "number+delta+gauge",
                delta: { reference: 90 }
               }
             ]
           }
         }
       };
       
       Plotly.newPlot('gauge', data, layout);
    })
}

// Return the data when a new subject is picked in the dropdown
function optionChanged(newSubject) {
    buildCharts(newSubject);
    buildMetadata(newSubject);
    }
// load the initial data function when site loads
init();
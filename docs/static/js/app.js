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
        console.log(result);
        // Select the panel in the HTML file for assigning the metadata
        var metaPanel = d3.select("#sample-metadata");

        // clear panel before populating
        metaPanel.html("");
        // Populate the Demographic panel. Remember to Uppercase the Key
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
        

        // Adding Gauge Chart
        var data = [
          {
            type: "indicator",
            mode: "gauge+number",
            value: result.wfreq,
            title: { text: "Belly Button Washing Frequency<br> Scrubs per Week", font: { size: 24 } },
            // delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
            gauge: {
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [0, 9], color: "ABBDFF" },
                { range: [250, 400], color: "royalblue" }
              ],
              threshold: {
                line: { color: "935D96", width: 4 },
                thickness: 0.75,
                value: result.wfreq
              }
            } 
          }
        ];
        
        var layout = {
          width: 400,
          height: 400,
          margin: { t: 25, r: 25, l: 25, b: 25 },
          paper_bgcolor: "white",
          font: { color: "black", family: "Arial" }
        };
        
        Plotly.newPlot('gauge', data, layout);
        // // Enter a speed between 0 and 180
        // var level = 175;

        // // Trig to calc meter point
        // var degrees = 180 - level,
        //   radius = .5;
        // var radians = degrees * Math.PI / 180;
        // var x = radius * Math.cos(radians);
        // var y = radius * Math.sin(radians);

        // // Path: may have to change to create a better triangle
        // var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        //   pathX = String(x),
        //   space = ' ',
        //   pathY = String(y),
        //   pathEnd = ' Z';
        // var path = mainPath.concat(pathX,space,pathY,pathEnd);

        // var data = [{ type: 'scatter',
        //   x: [0], y:[0],
        //   marker: {size: 28, color:'850000'},
        //   showlegend: false,
        //   name: 'amount',
        //   text: level,
        //   hoverinfo: 'text+name'},
        //   { values: [20/6, 20/6, 20/6, 20/6, 20/6, 20/6, 20/6, 20/6, 20],
        //   rotation: 90,
        //   text: ['0-1', '1-2', '2-3', '3-4',
        //       '4-5', '5-6', '6-7', '6-7', '7-8', '8-9'],
        //   textinfo: 'text',
        //   textposition:'inside',	  
        //   marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
        //             'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
        //             'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
        //             'rgba(255, 255, 255, 0)']},
        //   labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
        //   hoverinfo: 'label',
        //   hole: .5,
        //   type: 'pie',
        //   showlegend: false
        // }];

        // var layout = {
        //   shapes:[{
        //       type: 'path',
        //       path: path,
        //       fillcolor: '850000',
        //       line: {
        //         color: '850000'
        //       }
        //     }],
        //   title: 'Belly Button Washing Frequency<br> Scrubs per Week',
        //   titlefont: {family: '"Arial", "Helvetica", san-serif'},
        //   height: 400,
        //   width: 450,
        //   xaxis: {zeroline:false, showticklabels:false,
        //       showgrid: false, range: [-1, 1]},
        //   yaxis: {zeroline:false, showticklabels:false,
        //       showgrid: false, range: [-1, 1]}
        // };

        // Plotly.newPlot('gauge', data, layout, {showSendToCloud:true});
    })
}

// Return the data when a new subject is picked in the dropdown
function optionChanged(newSubject) {
    buildCharts(newSubject);
    buildMetadata(newSubject);
    }
// load the initial data function when site loads
init();
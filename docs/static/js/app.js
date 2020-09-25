
// Initializes the page with a default plot
function init() {
    // First Step is to grab the dropdown selector to select each dataset
    var selDataset = d3.select("#selDataset");

    // Append names to the selDataset dropdown
    d3.json("data/samples.json").then((data) => {
        var nameIds = data.names;
        // console.log(nameIds)
        
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
        // console.log(samples);
        var samplesFilter = samples.filter(sampleObject => sampleObject.id == sampleID);
        // console.log(samplesFilter);
        var result = samplesFilter[0];
        // console.log(result);
        var otu_ids = result.otu_ids;
        // console.log(otu_ids);
        var otu_labels = result.otu_labels; 
        // console.log(otu_labels);
        var sample_values = result.sample_values;
        // console.log(sample_values);


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
        // console.log(metadata);
        var metaArray = metadata.filter(samplePick => samplePick.id == meta);
        // console.log(metadata);
        var result = metaArray[0];
        // console.log(result);
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
    })
}

// Return the data when a new subject is picked in the dropdown
function optionChanged(newSubject) {
    buildCharts(newSubject);
    buildMetadata(newSubject);
    }
// load the initial data function when site loads
init();
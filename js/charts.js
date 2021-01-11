function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;

    // 3-1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataObj = data.metadata.filter(sampleObj => sampleObj.id == sample)
    
    // 1-4. Create a variable that holds the first sample in the array.
    var sampleObj = sampleArray[0];

    // 3-2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = metadataObj[0];

    // 1-5. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleValues = sampleObj.sample_values;
    var sampleOtuId = sampleObj.otu_ids;
    var sampleOtuLabel = sampleObj.otu_labels;


    // 3-3. Create a variable that holds the washing frequency.
   var wfreq = metadataResult.wfreq
   console.log(wfreq)

    // 1-4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    top10Id = sampleOtuId.slice(0,10)
    // console.log(top10Id);

    var yticks = top10Id.map(function(id){
      return "OTU " + id
    })
    var xticks = sampleValues.sort((a,b) => b-a).slice(0,10);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: sampleOtuLabel
    };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: { text: "Top 10 Bacteria Cultures Found", font: {size: 20} },
      xaxis: {
          title: "Sample Value"
      },
      yaxis: {
          title: "OTU ID",
          autorange: 'reversed'
      },
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout)

    var otu_ids = Object.values(samples.otu_ids)
    console.log(otu_ids)

    // Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_ids,
        colorscale: "Earth"
      }
    };

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis:{title: "OTU ID"},
      height: 600,
      width: 800
    };

    // D2: 3. Use Plotly to plot the data with the layout.
   Plotly.newPlot("bubble",[bubbleData], bubbleLayout);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = {
     domain: {x: [0,9], y:[0,9]},
     value: wfreq,
     title: {text: "Scrubs per Week", font: {size:18}},
     type: "indicator",
     mode: "gauge+number",
     gauge: {
      axis: { range: [null, 9], tickwidth: 2, tickmode: "array", tickvals: [0,1,2,3,4,5,6,7,8,9] },
      bar: {color: "antiquewhite"},
      borderwidth: 2,
      steps: [
        { range: [0, 1], color: "aquamarine"},
        { range: [1, 2], color: "mediumturquoise"},
        { range: [2, 3], color: "darkcyan"},
        { range: [3, 4], color: "mediumspringgreen"},
        { range: [4, 5], color: "mediumseagreen"},
        { range: [5, 6], color: "seagreen"},
        { range: [6, 7], color: "plum"},
        { range: [7, 8], color: "orchid"},
        { range: [8, 9], color: "darkorchid"}
      ]}
    };
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: {text:"Belly Button Washing Frequency", font: {size:20} },
     width: 430,
     height: 400
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}
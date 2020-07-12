function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    d3.json("samples.json").then((data) => { 
      var metadata = data.metadata;

      var resultArray = metadata.filter (sampleObj => sampleObj.id == sample);
      var result = resultArray [0];
    // Use d3 to select the panel with id of `#sample-metadata`
      var sampleData = d3.select('#sample-metadata');
  
  // Use `.html("") to clear any existing metadata
      sampleData.html(" ");
  
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  
    Object.entries(result).forEach(([key, value]) => {
      sampleData.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
  
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
});
  }
  
  function buildCharts(sample) {
  
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  d3.json("samples.json").then((data) => {
  
    var samples = data.samples
    var resultArray = samples.filter (sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
  
   
    //Build a Bubble Chart
    var bubble = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: `markers`,
      marker: {
        size: sample_values, 
        color: otu_ids,
        colorscale: "Electric"
      }
     }
    ];
      
    var layout = {
      
      title: "Belly Button Bacteria",
      margin: {t: 0},
      hovermode: "closest",
      xaxis: {title: "OTU ID"}, 
      margin: {t: 30}      
    };
  
    Plotly.newPlot('bubble', bubble, layout);
    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x:sample_values.slice (0,10).reverse(),
        text: otu_labels.slice (0,10).reverse(),
        type:"bar",
        orientation: "h",
      }
    ];
    
   var layoutbar = {
     title: "Top 10 Bacteria Cultures Found",
     margin: {t:30, l:150}
   };
   
   Plotly.newPlot("bar",barData,layoutbar);
 });
 }

    
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
  
  function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();

  

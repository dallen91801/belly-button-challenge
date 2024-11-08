// URL for the data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to initialize the dashboard
function init() {
  // Fetch the JSON data
  d3.json(url).then((data) => {
    // Get the list of sample names
    const sampleNames = data.names;

    // Use d3 to select the dropdown menu and populate it with sample IDs
    const dropdown = d3.select("#selDataset");
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Use the first sample to build the initial charts and metadata
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function to build the demographic information panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    // Filter for the metadata of the selected sample
    const metadata = data.metadata.find(meta => meta.id === parseInt(sample));

    // Select the panel and clear any existing metadata
    const panel = d3.select("#sample-metadata");
    panel.html("");

    // Add each key-value pair to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build the charts
function buildCharts(sample) {
  d3.json(url).then((data) => {
    // Filter the samples data for the selected sample
    const sampleData = data.samples.find(s => s.id === sample);

    // Extract the OTU IDs, labels, and values for the charts
    const otuIDs = sampleData.otu_ids;
    const otuLabels = sampleData.otu_labels;
    const sampleValues = sampleData.sample_values;

    // Build the bar chart for the top 10 OTUs
    const yticks = otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      margin: { l: 100, r: 50, t: 50, b: 50 }
    };
    Plotly.newPlot("bar", [barTrace], barLayout);

    // Build the bubble chart for all OTUs
    const bubbleTrace = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Earth"
      }
    };
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      hovermode: "closest",
      margin: { t: 50 }
    };
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  });
}

// Function to handle dropdown selection change
function optionChanged(newSample) {
  // Rebuild the charts and metadata panel when a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard on page load
init();

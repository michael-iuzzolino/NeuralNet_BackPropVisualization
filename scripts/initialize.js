
var svg_height = 500;
var svg_width = 500;
var svg_background = "#f2f2f2";

var NN_svg_height = 400;
var NN_svg_width = 400;
var NN_svg_background = "#f2f2ff";

var node_radius = 20;
var input_neurons = 3;
var hidden_neurons = 4;
var output_neurons = 1;

var topology = [input_neurons, hidden_neurons, output_neurons];

var grid, weight_grid; 


var datasets;
var current_dataset;
var default_dataset = "XOR";


var test_input_1 = 0;
var test_input_2 = 0;
var expected_test_output = 0;


function scaleY(i, neurons) {
  
  NN_margin = NN_svg_height*0.1;
  
  var yScale = d3.scaleLinear().domain([0, neurons-1]).range([NN_svg_height - NN_margin, 0+NN_margin]);
  
  return yScale(i);
}





function initializeDataSets() {
  var and_data, or_data, xor_data;
  
  // X common to all
  X = [[0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1]];
  
  // AND Dataset
  Y = [[0], [0], [0], [1]];
  and_data = {"x" : X, "y" : Y};
  
  // OR Dataset
  Y = [[0], [1], [1], [1]];
  or_data = {"x" : X, "y" : Y};
  
  // XOR Dataset
  Y = [[0], [1], [1], [0]];
  xor_data = {"x" : X, "y" : Y};
  
  // Set Datasets
  datasets = {"AND" : and_data, "OR" : or_data, "XOR" : xor_data};
  
  
  // Set default dataset as XOR set
  current_dataset = datasets[default_dataset];
}

function changeDataSet(selected_dataset) {
  current_dataset = datasets[selected_dataset];
  addGateHeader(selected_dataset);
}

function initialize() {
  
  initializeDataSets();
  initializeNetworkWeightMatrices();
  setupContainers();
  // Add header
  addGateHeader(default_dataset);
  
}


function addGateHeader(selected_dataset) {
  d3.select("#model_header").remove();
  d3.select("#main_svg_container")
    .append("text")
    .attr("id", "model_header")
    .attr("x", 20)
    .attr("y", 20)
    .text(function() {
    console.log(selected_dataset)
      return "Gate: " + selected_dataset;
    });
}


function setupControls() {
  
  // Setup Div
  var controls_div = d3.select("#main_container").append("div").attr("id", "controls_div");
  
  
  
  // Gate select
  
  
  // Create Pulldown menu to select MODEL type: NEAT or ANN for now
  var gates = ["XOR", "AND", "OR"];
  controls_div.append("select")
                .attr("id", "model_select_menu")
                .selectAll("option")
                .data(gates).enter()
              .append("option")
                .text(function (d, i) { return d; })

  // Add on change functionality to menu - set selected model upon change
  d3.select("#model_select_menu")
      .on("change", function(d, i) {
        var selected_dataset = d3.select(this).property("value");
        changeDataSet(selected_dataset);
        
      });
  
  
  
  // Setup Start Button
  controls_div.append("input")
              .attr("type", "button")
              .attr("value", "Train!")
              .style("display", "block")
              .on("click", function() {
                run();
              });
  
  // Setup Timestep
  controls_div.append("p").html("Time Step").append("input")
              .attr("type", "number")
              .attr("min", "1")
              .attr("max", "1000")
              .attr("step", "50")
              .attr("value", epoch_steps)
              .style("display", "block")
              .on("change", function() {
                var self = d3.select(this);
                updateTimeStep(self);
              });
  
  
  // Setup Test Button
  controls_div.append("input")
              .attr("type", "button")
              .attr("value", "Test!")
              .style("display", "block")
              .on("click", function() {
                testNetwork();
              });
  
  var inputs = [0, 1];
  
  // Test input 1
  controls_div.append("p").html("Input 1: ").append("select")
                .attr("id", "test_input_1_select")
                .selectAll("option")
                .data(inputs).enter()
              .append("option")
                .text(function (d, i) { return d; })

  // Add on change functionality to menu - set selected model upon change
  d3.select("#test_input_1_select")
      .on("change", function(d, i) {
        test_input_1 = d3.select(this).property("value");
        getExpectedTestOutput();
    
        test_data = [[test_input_1, test_input_2, 1]];
        visualizeTestValues(test_data);
        
      });
  
  // Test input 2
  controls_div.append("p").html("Input 2: ").append("select")
                .attr("id", "test_input_2_select")
                .selectAll("option")
                .data(inputs).enter()
              .append("option")
                .text(function (d, i) { return d; })

  // Add on change functionality to menu - set selected model upon change
  d3.select("#test_input_2_select")
      .on("change", function(d, i) {
        test_input_2 = d3.select(this).property("value");
        getExpectedTestOutput();
        test_data = [[test_input_1, test_input_2, 1]];
        visualizeTestValues(test_data);
        
      });
  
  
  
  
  // Setup Reset Button
  controls_div.append("input")
              .attr("type", "button")
              .attr("value", "Reset")
              .on("click", function() {
                resetVis();
              });
  
}




function getExpectedTestOutput() {
  
  var X = current_dataset.x;
  var Y = current_dataset.y;
  
  for (var i=0; i < X.length; i++) {
    var x1 = X[i][0];
    var x2 = X[i][1];
    console.log(test_input_1)
    if (x1 == test_input_1 && x2 == test_input_2) {
      expected_test_output = Y[i];
      break;
    }
  }
  console.log(expected_test_output)
}

function setupNNVis() {
  
  d3.select("#main_vis_div").remove();
  
  // Setup div
  var main_vis_div = d3.select("#main_container").append("div").attr("id", "main_vis_div");
  
  // Setup container for SVG
  var main_svg_container = main_vis_div.append("svg")
                                        .attr("id", "main_svg_container")
                                        .attr("height", svg_height)
                                        .attr("width", svg_width);
  
//  // Background
//  main_svg_container.append("rect")
//                      .attr("height", svg_height)
//                      .attr("width", svg_width)
//                      .style("fill", svg_background)
//                      .style("stroke", "black");
  
  // Setup margins
  var top_margin = (svg_height - NN_svg_height) / 2.0;
  var left_margin = (svg_width - NN_svg_width) / 2.0;
  var margins = { "top" : top_margin, "left" : left_margin };
  
  // Setup div
  var NN_Container = d3.select("#main_svg_container")
                          .append("g")
                          .attr("id", "NN_container")
                          .attr("transform", "translate("+margins.left+", "+margins.top+")");
  
//  // Background
//  NN_Container.append("rect")
//                .attr("height", NN_svg_height)
//                .attr("width", NN_svg_width)
//                .style("fill", NN_svg_background)
//                .style("stroke", "black")
//                .style("stroke-width", "0.5px");
  
  // Setup grids
  setupGrid();
  
  // Setup links
  setupLinks();
  
  // Setup nodes
  setupNodes();
}












function setupGrid() {
  
  grid = [];
  
  // Initialize grid
  for (var layer=0; layer < 3; layer++) {
    var new_layer = [];
    for (var neuron=0; neuron < topology[layer]; neuron++) {
      var x = undefined;
      var y = undefined;
      var location = {"x" : x, "y" : y};
      new_layer.push(location);
    }
    grid.push(new_layer);
  }
  
  
  // Initialize horizontal margins
  var input_top, input_left, hidden_top, hidden_left, output_top, output_left;
  
  input_left = NN_svg_width / 3.0 / 2.0;
  hidden_left = input_left + NN_svg_width / 3.0;
  output_left = hidden_left + NN_svg_width / 3.0;
  
  var layer_margins = {"input" : input_left,
                       "hidden" : hidden_left,
                       "output" : output_left};
  
  
  var n_margin, M;
  
  
  // Input layers
  for (var i=0; i < input_neurons; i++) {
    var y = scaleY(i, input_neurons);
    grid[0][i].x = layer_margins.input;
    grid[0][i].y = y;
       
  }
  
  // Hidden layers
  for (var i=0; i < hidden_neurons; i++) {
    var y = scaleY(i, hidden_neurons);
    grid[1][i].x = layer_margins.hidden;
    grid[1][i].y = y;
  }
  
  
  // Output neurons
  for (var i=0; i < output_neurons; i++) {
    var y = NN_svg_height / 2;
    grid[2][i].x = layer_margins.output;
    grid[2][i].y = y;
    
  }
}










function setupLinks(weights = false) {
  
  var weight_matrices = (weights) ? weights : WEIGHT_MATRICES;
  
  d3.select("#matrix_group").remove();
  
  var matrix_group = d3.select("#NN_container").append("g").attr("id", "matrix_group");
  
  weight_grid = [];
  
  for (var i=0; i < 2; i++) {
    var n = i + 1;
    var current_layer = grid[i];
    var next_layer = grid[n];
    
    var weight_group = matrix_group
                          .append("g")
                          .attr("id", function() { return "matrix_group_"+i;});
    
    var new_weight_grid = []
    
    var current_weight_matrix = weight_matrices[i];
    
    for (var j=0; j < current_layer.length; j++) {
      var x1 = current_layer[j].x;
      var y1 = current_layer[j].y;
    
      var new_row = []
      for (var k=0; k < next_layer.length; k++) {
       
        var x2 = next_layer[k].x;
        var y2 = next_layer[k].y;
        
        
        
        var weight = current_weight_matrix[j][k];
        var weight_M = current_weight_matrix;
        
        var data = {"x1" : x1, "x2" : x2, "y1" : y1, "y2" : y2, "w" : weight, "weight_matrix" : weight_M};
        new_row.push(data);
        
        weight_group.append("line")
                      .data([data])
                      .attr("id", function() { return "weight_"+j+"_"+k; })
                      .attr("x1", x1)
                      .attr("x2", x2)
                      .attr("y1", y1)
                      .attr("y2", y2)
                      .style("stroke", function(d) {
                        var w = d.w;
                        var w_matrix = d.weight_matrix;
                        var color = colorWeight(w, w_matrix);
          
                        return color;
                      })
                      .style("stroke-width", function(d) {
                        var w = d.w;
                        var w_matrix = d.weight_matrix;
                        var w_scaled = scaleWeight(w, w_matrix);
          
                        return w_scaled;
                      })
                      .on("mouseover", function(d) {
                        console.log(d);
                      });
      }
      new_weight_grid.push(new_row);
    }
    weight_grid.push(new_weight_grid);
  }
}










function setupNodes() {
  
  
  d3.selectAll(".nodes_group").remove();
  var neural_layers_group = d3.select("#NN_container").append("g").attr("class", "nodes_group");
  
  
  var input_top, input_left, hidden_top, hidden_left, output_top, output_left;
  
  input_left = NN_svg_width / 3.0 / 2.0;
  hidden_left = input_left + NN_svg_width / 3.0;
  output_left = hidden_left + NN_svg_width / 3.0;
  
  var layer_margins = {"input" : input_left,
                       "hidden" : hidden_left,
                       "output" : output_left};
  
  var input_div = neural_layers_group
                      .append("g")
                      .attr("id", "input_layer")
                      .attr("transform", "translate("+layer_margins.input+", 0)");
  
  
  var hidden_div = neural_layers_group
                      .append("g")
                      .attr("id", "hidden_layer")
                      .attr("transform", "translate("+layer_margins.hidden+", 0)");
  
  
  var output_div = neural_layers_group
                      .append("g")
                      .attr("id", "output_layer")
                      .attr("transform", "translate("+layer_margins.output+", 0)");
  
  
  
  
  
  // Input layers
  for (var i=0; i < input_neurons; i++) {
    input_div.append("circle")
      .attr("cx", 0)
      .attr("cy", function() {
        return grid[0][i].y;
      })
      .attr("r", node_radius)
      .style("fill", "white")
      .style("stroke", "black")
      .on("mouseover", function() {
        console.log(i);
      });
  }
  
  // Hidden layers
  for (var i=0; i < hidden_neurons; i++) {
    hidden_div.append("circle")
      .attr("cx", 0)
      .attr("cy", function() {
        return grid[1][i].y;
      })
      .attr("r", node_radius)
      .style("fill", "white")
      .style("stroke", "black")
      .on("mouseover", function() {
        console.log(i);
      });
  }
  
  
  // Output neurons
  for (var i=0; i < output_neurons; i++) {
    output_div.append("circle")
      .attr("cx", 0)
      .attr("cy", function() {
        return grid[2][i].y;
      })
      .attr("r", node_radius)
      .style("fill", "white")
      .style("stroke", "black")
      .on("mouseover", function() {
        console.log(i);
      });
  }
  
}



function setupContainers() {
  
  var main_div = d3.select("body").append("div").attr("id", "main_container");
  
  // Controls Container
  setupControls();
  
  
  // Neural Network Containter
  setupNNVis();
  
}
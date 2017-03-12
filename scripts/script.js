var epoch_steps = 500;
var time_step_default = 500;

var total_epochs = 0;
var alpha = 0.1;

var X, Y, W0, W1;
var layer_1, layer_2;
var layer_1_activation, layer_2_activation;
var layer_1_error, layer_2_error;

var layer_1_delta, layer_2_delta;
var dE_dW1, dE_dW2;

var WEIGHT_MATRICES;



function colorWeight(weight, W) {
  var min, max;
  
  min = W[0][0];
  max = W[0][0];
  
  for (var i=0; i < W.length; i++) {
    for (var j=0; j < W[i].length; j++) {
      if (W[i][j] > max) {
        max = W[i][j];
      }  
      else if (W[i][j] < min) {
        min = W[i][j];
      }      
    }
  }
  
  var colorScale = d3.scaleLinear()
                    .domain([min, 0, max])
                    .range(["#ff471a", "#3333cc", "#66ff66"]);
  
  return colorScale(weight);
}


function scaleWeight(weight, W) {
  
  var min, max;
  
  min = W[0][0];
  max = W[0][0];
  
  for (var i=0; i < W.length; i++) {
    for (var j=0; j < W[i].length; j++) {
      if (W[i][j] > max) {
        max = W[i][j];
      }  
      else if (W[i][j] < min) {
        min = W[i][j];
      }      
    }
  }
  
  var weightScale = d3.scaleLinear()
                    .domain([min, 0, max])
                    .range([12, 2, 12]);
  
  return weightScale(weight);
}






function feedForward(X) {
  // Input
    layer_0 = X;
    
    layer_1 = numeric.dot(layer_0, W0);
    layer_1_activation = activate(layer_1);
    layer_2 = numeric.dot(layer_1_activation, W1);
    layer_2_activation = activate(layer_2);
}

function initializeNetworkWeightMatrices() {
  W0 = createArray(3, 4);
  W1 = createArray(4, 1);
  WEIGHT_MATRICES = [W0, W1];
}

function run() {
  X = current_dataset['x'];
  Y = current_dataset['y'];
  
  for (var j=0; j < epoch_steps; j++) {
    
    // Feed Forward
    feedForward(X);
    
    // Error
    layer_2_error = numeric.sub(Y, layer_2_activation);
    
    
    // Backprop
    layer_2_delta = numeric.mul(layer_2_error, activate(layer_2_activation, deriv=true));
    dE_dW1 = numeric.dot(numeric.transpose(layer_1_activation), layer_2_delta);
    
    layer_1_error = numeric.dot(layer_2_delta, numeric.transpose(W1));
    layer_1_delta = numeric.mul(layer_1_error, activate(layer_1_activation, deriv=true));
    dE_dW0 = numeric.dot(numeric.transpose(layer_0), layer_1_delta);
    
    
    // Update Weights
    W1 = numeric.add(W1, elementMultiply(alpha, dE_dW1));
    W0 = numeric.add(W0, elementMultiply(alpha, dE_dW0));
    
    var new_weight_matrices = [W0, W1];
    
    
    // Print Error
    var print_interval = Math.floor(epoch_steps * 0.1);
    if (j % print_interval == 0) {
      var average_error = averageError(layer_2_error);
      printError(average_error);
    }
    
    // Update Visualization
//    var vis_interval = Math.floor(epoch_steps * 0.5);
//    if (j % vis_interval == 0) {
//      updateVisualization(new_weight_matrices);
//    }
    
    total_epochs++;
  }
  
  updateVisualization(new_weight_matrices);
  printError(average_error);
}



function visualizeTestValues(test_data) {
  
  d3.selectAll(".IO_text").remove();
  
  d3.select("#NN_container")
      .append("text")
      .attr("id","input_text")
      .attr("class","IO_text")
      .attr("x", grid[0][0].x)
      .attr("y", function() {
        return grid[0][0].y;
      })
      .text(function() {
        return test_data[0][0];
      });
  
  d3.select("#NN_container")
      .append("text")
      .attr("id","input_text")
      .attr("class","IO_text")
      .attr("x", grid[0][1].x)
      .attr("y", function() {
        return grid[0][1].y;
      })
      .text(function() {
        return test_data[0][1];
      });
  
  d3.select("#NN_container")
      .append("text")
      .attr("id","input_text")
      .attr("class","IO_text")
      .attr("x", grid[0][2].x)
      .attr("y", function() {
        return grid[0][2].y;
      })
      .text(function() {
        return test_data[0][2];
      });
  
  
  
  
  // Expected output
  d3.select("#NN_container")
      .append("text")
      .attr("id","input_text")
      .attr("class","IO_text")
      .attr("x", grid[2][0].x + 40)
      .attr("y", function() {
        return grid[2][0].y;
      })
      .text(function() {
        return "Expected: " + expected_test_output;
      });
}


function testNetwork() {
  
  d3.selectAll(".IO_text").remove();
  
  var result;
  
  var test_data = [[test_input_1, test_input_2, 1]];
  
  feedForward(test_data);
  result = (layer_2_activation[0][0] >= 0.5) ? 1 : 0;
  console.log("Result: " + result);
  console.log("Expected: " + expected_test_output);
  
  
  // Print Results
  // Input
  visualizeTestValues(test_data);
  
  
  // Output
  d3.select("#NN_container")
      .append("text")
      .attr("id","input_text")
      .attr("class","IO_text")
      .attr("x", grid[2][0].x)
      .attr("y", function() {
        return grid[2][0].y;
      })
      .text(function() {
        return result;
      });
  
}
function updateVisualization(new_weight_matrices) {
  // Setup links
  setupLinks(new_weight_matrices);
  
  // Setup nodes
  setupNodes();
}


function printError(average_error) {
  d3.selectAll(".svg_text").remove();
  
  d3.select("#main_svg_container")
      .append("text")
      .attr("id","error_text")
      .attr("class","svg_text")
      .attr("x", NN_svg_width * 0.4)
      .attr("y", NN_svg_height * 0.1)
      .text(function() {
        return "Average error: " + Math.round(average_error * 10000)/10000;
      });
  
  d3.select("#main_svg_container")
      .append("text")
      .attr("id","epoch_counter_text")
      .attr("class","svg_text")
      .attr("x", NN_svg_width * 0.4)
      .attr("y", NN_svg_height * 0.05)
      .text(function() {
        return "Epoch: " + total_epochs;
      });
}


function updateTimeStep(self) {
  epoch_steps = self.property("value");
}


function resetVis() {
  
  resetVariables();
  initializeDataSets();
  initializeNetworkWeightMatrices();
  setupNNVis();
  addGateHeader(default_dataset);
}


function resetVariables() {
  // Reset to default dataset
  current_dataset = datasets[default_dataset];
  
  d3.select("#model_select_menu").property("value", default_dataset);
  
  // Reset epoch count
  total_epochs = 0;
  epoch_steps = time_step_default;
  
  
  test_input_1 = 0;
  test_input_2 = 0;
  expected_test_output = 0;
  d3.select("#test_input_1_select").property("value", test_input_1);
  d3.select("#test_input_2_select").property("value", test_input_2);
}
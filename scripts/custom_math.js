function createArray(rows, cols)
{
  var X = [];
  
  for (var i=0; i < rows; i++) {
    var new_row = [];
    for (var j=0; j < cols; j++) {
      var new_val = 2 * Math.random() - 1;
      new_row.push(new_val);
    }
    X.push(new_row);
  }
  
  return X;
}

function elementMultiply(ele, X) {
  var new_X = [];
  
  for (var i=0; i < X.length; i++) {
    var new_row = [];
    for (var j=0; j < X[i].length; j++) {
      new_row.push(ele * X[i][j]);
    }
    new_X.push(new_row);
  }
  
  return new_X;
}



function dot2(m1, m2)
{
  console.log("m1");
  console.log(m1);
  console.log("\n");
  
  console.log("m2");
  console.log(m2);
  console.log("\n");
  
  var new_rows = m1.length;
  var new_cols = m2[0].length;
  
  var new_matrix = new Array(new_rows);
  for (var i=0; i < new_rows; i++) {
    new_matrix[i] = new Array(new_cols);
  }
 
  var m1_value, m2_value;
  var new_value;
  
  for (var i=0; i < new_rows; i++)
  {
    console.log("i: " + i);
    for (var j=0; j < new_cols; j++)
    {
      console.log("\tj: " + j);
      new_value = 0;
      for (var k=0; k < m2.length; k++)
      {
        console.log("\t\tk: " + k);
        m1_value = m1[i][k];
        m2_value = m2[k][j];
        new_value += m1_value * m2_value;
        console.log("\t\t\tm1 val: " + m1_value);
      }
      new_matrix[i][j] = new_value;
    }
  }
  console.log("new matrix");
  console.log(new_matrix);
  console.log("\n");

  return new_matrix;
}

function matrixAdd(m1, m2) {
  var new_X = [];
  
  for (var i=0; i < m1.length; i++) {
    var new_row = [];
    for (var j=0; j < m1[i].length; j++) {
      new_row.push(m1[i][j] + m2[i][j]);
    }
    new_X.push(new_row);
  }
  
  return new_X;
}

function matrixSubtract(m1, m2) {
  var new_X = [];
  
  for (var i=0; i < m1.length; i++) {
    var new_row = [];
    for (var j=0; j < m1[i].length; j++) {
      new_row.push(m1[i][j] - m2[i][j]);
    }
    new_X.push(new_row);
  }
  
  return new_X;
}


function matrixMultiply(m1, m2) {
  var new_X = [];
  
  for (var i=0; i < m1.length; i++) {
    var new_row = [];
    for (var j=0; j < m1[i].length; j++) {
      new_row.push(m1[i][j] * m2[i][j]);
    }
    new_X.push(new_row);
  }
  
  return new_X;
}

function averageError(X) {
  var sum = 0.0;
  
  for (var i=0; i < X.length; i++) {
    var new_row = [];
    for (var j=0; j < X[i].length; j++) {
      sum += Math.abs(X[i][j]);
    }
  }
  
  var average = sum / X.length;
  
  return average;
}


function transpose(X) {
  var new_X = [];
  
  for (var i=0; i < X[0].length; i++) {
    var new_row = [];
    for (var j=0; j < X.length; j++) {
      new_row.push(0);
    }
    new_X.push(new_row);
  }
  
  for (var i=0; i < X.length; i++) {
    for (var j=0; j < X[i].length; j++) {
      new_X[j][i] = X[i][j];
    }
  }
  
  return new_X;
}



function activate(value, deriv=false, fxn="sigm") {
  if (fxn == "sigm") {
    if (!deriv) {
      return sigm(value);
    }
    else {
      return sigm_prime(value);
    }
  }
}



function sigm(X) {
  var new_X = [];
  for (var i=0; i < X.length; i++) {
    var new_row = [];
    for (var j=0; j < X[i].length; j++) {
      var sigm_value = 1.0 / (1.0 + Math.exp(-X[i][j]));
      new_row.push(sigm_value);
    }
    new_X.push(new_row);
  }
  
  return new_X;
}



function sigm_prime(X) {
  var new_X = [];
  for (var i=0; i < X.length; i++) {
    var new_row = [];
    for (var j=0; j < X[i].length; j++) {
      var sigm_prime_value = Math.exp(-X[i][j]) * (1 - Math.exp(-X[i][j]));
      new_row.push(sigm_prime_value);
    }
    new_X.push(new_row);
  }
  
  return new_X;
}



function RELU(value) {
  var relu_value = (value <= 0) ? 0 : value;
  return relu_value;
}


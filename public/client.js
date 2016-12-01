// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html


///////////////////////////////////////////////////////////////////////////////
// Get the data
///////////////////////////////////////////////////////////////////////////////

var socket = io();

console.log(socket);

var data = [];


$(function() {
  console.log('hello world :o');
  
  /*
  $.get('/data', function(data) {
    data.forEach(function(data_item) {
      
      var display = new moment().format('hh:mm:ss') + ', x: ' + data_item.x + ', y: ' + data_item.y + ', z: ' + data_item.z + ', magnitude: ' + data_item.magnitude

      console.log(display);
      $('<li></li>').text(display).appendTo('ul#data');
    });
  });
  */
    
  
  ///////////////////////////////////////////////////////////////////////////////
  // Graph ploting
  ///////////////////////////////////////////////////////////////////////////////
  
  var rawDataURL = '/latest_magnitudes/100';
  var xField = 'time';
  var yField = 'magnitude';
  
  var selectorOptions = {
      buttons: [{
          step: 'minute',
          stepmode: 'backward',
          count: 1,
          label: '1m'
      }, {
          step: 'hour',
          stepmode: 'backward',
          count: 1,
          label: '1h'
      }, {
          step: 'day',
          stepmode: 'todate',
          count: 1,
          label: '1d'
      }, {
          step: 'week',
          stepmode: 'backward',
          count: 1,
          label: '1w'
      }, {
          step: 'all',
      }],
  };
  
  Plotly.d3.json(rawDataURL, function(err, rawData) {
      if(err) throw err;
  
      data = prepData(rawData);
      var layout = {
          title: 'Magnitudes',
          xaxis: {
              rangeselector: selectorOptions,
              rangeslider: {}
          },
          yaxis: {
              //fixedrange: false,
              //range: [-0.2,0.2]
              //range: [-0.05,0.05]
              //range: [-1,1]
          }
      };
  
      Plotly.plot('magnitudeGraph', data, layout);
  });
  
  ///////////////////////////////////////////////////////////////////////////////
  // Put data in format required by plotly
  ///////////////////////////////////////////////////////////////////////////////

  function prepData(rawData) {
      var x = [];
      var y = [];
  
      rawData.forEach(function(datum, i) {
          x.push(new Date(datum[xField]));
          y.push(datum[yField] - 1);
      });
  
      return [{
          mode: 'lines',
          x: x,
          y: y
      }];
  }
  

  ///////////////////////////////////////////////////////////////////////////////
  // Posting test data
  ///////////////////////////////////////////////////////////////////////////////


  $('form').submit(function(event) {
    event.preventDefault();
    var data_item_x = $('#x').val();
    var data_item_y = $('#y').val();
    var data_item_z = $('#z').val();
    var data_item_magnitude = $('#magnitude').val();
    
    socket.emit('data', {x: data_item_x, y: data_item_y, z: data_item_z, magnitude: data_item_magnitude});

    /*
    $.post('/data?', {x: data_item_x, y: data_item_y, z: data_item_z, magnitude: data_item_magnitude}, function() {

      var display = new moment().format('hh:mm:ss') + ', x: ' + data_item_x + ', y: ' + data_item_y + ', z: ' + data_item_z + ', magnitude: ' + data_item_magnitude

      console.log(display);
      $('<li></li>').text(display).appendTo('ul#data');

      $('#x').val('');
      $('#y').val('');
      $('#z').val('');
      $('#magnitude').val('');
      $('input').focus();
    });
    */
  });
  
  socket.on('data', function(dataObj) {
    console.log(dataObj);

    data[0].x.push(new Date(dataObj[xField]));
    data[0].y.push(dataObj[yField] - 1);
    
    Plotly.redraw('magnitudeGraph');
  });
});

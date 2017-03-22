// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var request = require('request');

var LED_ERROR = 0
var LED_LAN_WARN = 1
var LED_GREEN = 2
var LED_BLUE = 3

// Magnitude range outside of which we'll send immediate data
var threshold_min = 0.99; //0.95
var threshold_max = 1.01; //1.05

function oneInEvery(number, every) {
  return !(number % every);
}

var counter = 0;

// Initialize the accelerometer.
accel.on('ready', function () {
	// Stream accelerometer data

  min_data = {
    x:0,
    y:0,
    z:0
  }

  max_data = {
    x:0,
    y:0,
    z:0
  }

	accel.on('data', function (xyz) {

    var previousData = data;

		var data = {
			x: xyz[0],//.toFixed(5),
			y: xyz[1],//.toFixed(5),
			z: xyz[2],//.toFixed(5),
      magnitude: Math.sqrt(xyz[0] * xyz[0] + xyz[1] * xyz[1] + xyz[2] * xyz[2]),
      id: 'tessel',
      min_data: min_data,
      max_data: max_data
    };

    //console.log(magnitude);

    min_data.x = Math.min(data.x, min_data.x);
    min_data.y = Math.min(data.y, min_data.y);
    min_data.z = Math.min(data.z, min_data.z);
    max_data.x = Math.max(data.x, max_data.x);
    max_data.y = Math.max(data.y, max_data.y);
    max_data.z = Math.max(data.z, max_data.z);


		counter++;
		if(oneInEvery(counter, 100) || data.magnitude > threshold_max || data.magnitude < threshold_min)
		{
//			console.log('Sending http request');
      console.log(JSON.stringify(data));

      var options = {
        uri: 'https://fluff-protocol.glitch.me/data',
        method: 'POST',
        json: data
      };

      blink(LED_BLUE, 200)
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          blink(LED_GREEN, 500)
          console.log('OK');

          min_data = {
            x:xyz[0],
            y:xyz[1],
            z:xyz[2]
          }

          max_data = {
            x:xyz[0],
            y:xyz[1],
            z:xyz[2]
          }

        } else {
          blink(LED_ERROR, 5000)
        }
      });

//			console.log('x:', xyz[0].toFixed(2),'y:', xyz[1].toFixed(2),'z:', xyz[2].toFixed(2));
		}

	});

	accel.on('error', function(err){
	   console.log('Error:', err);
	});
});

function blink(led, duration){
  tessel.led[led].on();
  setTimeout(function(){
    tessel.led[led].off()
  }, duration
  );

}
